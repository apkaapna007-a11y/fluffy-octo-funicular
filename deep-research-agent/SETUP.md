# 🚀 Deep Research Agent - Complete Setup Guide

This guide will walk you through setting up the Deep Research Agent from scratch.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** for version control
- ✅ An **OpenRouter** account ([Sign up](https://openrouter.ai/))
- ✅ A **Supabase** account ([Sign up](https://supabase.com/))

---

## 🔑 Step 1: Get Your API Keys

### OpenRouter Setup

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to **Keys** section
4. Click **Create Key**
5. Copy your API key (starts with `sk-or-v1-...`)

**Why OpenRouter?**
- Access to 100+ AI models via one API
- Automatic failover and load balancing
- Pay-per-use pricing (no subscriptions)

### Supabase Setup

1. Go to [Supabase](https://supabase.com/)
2. Click **New Project**
3. Fill in:
   - **Name**: deep-research-agent
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait for project to provision (~2 minutes)
5. Go to **Settings > API**
6. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbG...`
   - **service_role key**: `eyJhbG...` (keep this secret!)

---

## 💻 Step 2: Install the Application

### Clone the Repository

```bash
# Clone the repo
git clone <your-repository-url>
cd deep-research-agent

# Install dependencies
npm install
```

### Configure Environment

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your keys:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_API_BASE=https://openrouter.ai/api/v1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
```

⚠️ **Security Note**: Never commit `.env.local` to version control!

---

## 🗄️ Step 3: Set Up Database

### Create Database Tables

1. Go to your Supabase project
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Paste this SQL:

```sql
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_created_at 
  ON research_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_session_id 
  ON knowledge_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relevance 
  ON knowledge_entries(relevance DESC);

-- Enable Row Level Security
ALTER TABLE research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now)
CREATE POLICY "Allow all operations" 
  ON research_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" 
  ON knowledge_entries FOR ALL USING (true);
```

5. Click **Run** or press `Ctrl+Enter`
6. Verify success: "Success. No rows returned"

### Verify Tables

Go to **Table Editor** and verify:
- ✅ `research_sessions` table exists
- ✅ `knowledge_entries` table exists

---

## ▶️ Step 4: Run the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- ✅ "Deep Research Agent" header
- ✅ Welcome screen with features
- ✅ Input box at bottom

### Test the Application

1. Enter a query: `"Explain quantum computing in simple terms"`
2. Click **Research**
3. Watch the orchestration:
   - ⏳ Planning phase
   - ✅ Steps executing
   - 📄 Final report generated

---

## 🚀 Step 5: Deploy to Vercel

### Connect GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Deep Research Agent"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/your-username/deep-research-agent.git

# Push
git push -u origin main
```

### Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New... > Project**
3. **Import** your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables**:
   Click **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `OPENROUTER_API_KEY` | `sk-or-v1-...` |
   | `OPENROUTER_API_BASE` | `https://openrouter.ai/api/v1` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` |
   | `SUPABASE_SERVICE_KEY` | `eyJhbG...` |

6. Click **Deploy**

Your app will be live at `https://your-project.vercel.app` in ~2 minutes! 🎉

---

## 🔧 Step 6: Customize Configuration

### Change AI Models

Edit `lib/config.ts`:

```typescript
export const MODEL_ROUTING = {
  planner: "anthropic/claude-3.5-sonnet",       // Change to your preferred planner
  verifier: "openai/gpt-4o-mini",               // Change to your preferred verifier
  executor: "mistralai/mixtral-8x7b-instruct",  // Change to your preferred executor
  synthesizer: "openai/gpt-4o",                 // Change to your preferred synthesizer
};
```

**Available Models**: See [OpenRouter Models](https://openrouter.ai/models)

### Adjust Timeouts

Edit `lib/config.ts`:

```typescript
export const ORCHESTRATION_LIMITS = {
  maxSteps: 10,              // Max research steps
  maxRetries: 3,             // Plan generation retries
  stepTimeout: 60000,        // 60s per step
  totalTimeout: 300000,      // 5 min total
  maxTokens: 4096,          // Max tokens per call
};
```

### Add Custom Tools

Edit `lib/config.ts`:

```typescript
export const AVAILABLE_TOOLS = [
  // ... existing tools
  {
    name: 'my_custom_tool',
    description: 'Description of what this tool does',
    parameters: {
      param1: 'string',
      param2: 'number',
    },
  },
];
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch session"

**Cause**: Supabase credentials incorrect

**Solution**:
1. Double-check `.env.local` values
2. Verify Supabase project is active
3. Check RLS policies allow access

### Issue: "LLM call failed"

**Cause**: OpenRouter API key invalid or insufficient credits

**Solution**:
1. Verify API key in `.env.local`
2. Check OpenRouter dashboard for credits
3. Try different model in `lib/config.ts`

### Issue: "Verification failed"

**Cause**: Plan doesn't meet quality standards

**Solution**:
1. Check query is specific enough
2. Verify tools are properly configured
3. Review planner model output

### Issue: Build fails on Vercel

**Cause**: Environment variables not set

**Solution**:
1. Go to Vercel project settings
2. Add all required environment variables
3. Redeploy

---

## 📊 Monitoring

### Check Database Usage

1. Go to Supabase Dashboard
2. Click **Database > Usage**
3. Monitor:
   - Database size
   - API requests
   - Bandwidth

### Check API Usage

1. Go to OpenRouter Dashboard
2. View usage statistics
3. Set spending limits (recommended)

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ Never commit `.env.local` to Git
- ✅ Use different keys for dev/prod
- ✅ Rotate keys periodically
- ✅ Use Vercel environment variables for production

### Supabase Security

- ✅ Use Row Level Security (RLS)
- ✅ Never expose service key to client
- ✅ Set up proper authentication (if multi-user)
- ✅ Enable database backups

### Rate Limiting

Consider adding rate limiting:

```typescript
// app/api/orchestrate/route.ts
import rateLimit from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Add rate limiting
  const limitResult = await rateLimit(request);
  if (!limitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // ... rest of code
}
```

---

## 🎯 Next Steps

Now that you're set up:

1. **Test different queries** to understand capabilities
2. **Customize the UI** in `app/components/`
3. **Add custom MCP tools** for domain-specific research
4. **Implement authentication** for multi-user access
5. **Set up monitoring** with Vercel Analytics
6. **Add team features** for collaborative research

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

## 💬 Get Help

- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Join our community (coming soon)

---

**Ready to research? Open the app and ask your first question! 🚀**
