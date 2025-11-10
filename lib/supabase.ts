import { createClient } from '@supabase/supabase-js';
import { KnowledgeEntry } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      research_sessions: {
        Row: {
          id: string;
          query: string;
          plan: any;
          status: string;
          result: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          query: string;
          plan?: any;
          status?: string;
          result?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          query?: string;
          plan?: any;
          status?: string;
          result?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_entries: {
        Row: {
          id: string;
          session_id: string;
          content: string;
          sources: any;
          relevance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          content: string;
          sources?: any;
          relevance?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          content?: string;
          sources?: any;
          relevance?: number;
          created_at?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export const db = {
  // Create a new research session
  async createSession(query: string, plan: any) {
    const { data, error } = await supabase
      .from('research_sessions')
      .insert({
        query,
        plan,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update session status
  async updateSession(id: string, updates: { status?: string; plan?: any; result?: any }) {
    const { data, error } = await supabase
      .from('research_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add knowledge entry
  async addKnowledge(sessionId: string, entry: Omit<KnowledgeEntry, 'id' | 'timestamp' | 'sessionId'>) {
    const { data, error } = await supabase
      .from('knowledge_entries')
      .insert({
        session_id: sessionId,
        content: entry.content,
        sources: entry.sources,
        relevance: entry.relevance,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get knowledge entries for a session
  async getKnowledge(sessionId: string) {
    const { data, error } = await supabase
      .from('knowledge_entries')
      .select('*')
      .eq('session_id', sessionId)
      .order('relevance', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get session by ID
  async getSession(id: string) {
    const { data, error } = await supabase
      .from('research_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

// SQL schema for Supabase (to be run in Supabase SQL editor)
export const SUPABASE_SCHEMA = `
-- Create research_sessions table
CREATE TABLE IF NOT EXISTS research_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  plan JSONB,
  status TEXT DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_entries table
CREATE TABLE IF NOT EXISTS knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES research_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  relevance DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON research_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_session_id ON knowledge_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relevance ON knowledge_entries(relevance DESC);

-- Enable Row Level Security (optional)
ALTER TABLE research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for service key, adjust as needed)
CREATE POLICY "Allow all operations" ON research_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON knowledge_entries FOR ALL USING (true);
`;
