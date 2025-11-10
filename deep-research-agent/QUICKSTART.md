# ⚡ Quick Start Guide

Get your Deep Research Agent running in 5 minutes!

---

## 📋 What You Need

1. **OpenRouter API Key** - [Get one here](https://openrouter.ai/) (takes 2 minutes)
2. **Supabase Account** - [Sign up free](https://supabase.com/) (takes 3 minutes)
3. **Node.js 18+** - [Download](https://nodejs.org/)

---

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local with your keys
nano .env.local  # or use your favorite editor
```

Add your keys:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
```

### Step 3: Set Up Database

1. Go to your Supabase project
2. Click **SQL Editor**
3. Run this query (also available in `lib/supabase.ts`):

```sql
-- Create tables
CREATE TABLE research_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  plan JSONB,
  status TEXT DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES research_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  relevance DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sessions_created_at ON research_sessions(created_at DESC);
CREATE INDEX idx_knowledge_session_id ON knowledge_entries(session_id);

-- Enable RLS
ALTER TABLE research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all" ON research_sessions FOR ALL USING (true);
CREATE POLICY "Allow all" ON knowledge_entries FOR ALL USING (true);
```

### Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Test It Out

### Try These Queries:

1. **Simple Test:**
   ```
   Explain quantum computing in simple terms
   ```

2. **Complex Research:**
   ```
   Compare renewable energy solutions and their economic viability
   ```

3. **Technical Deep Dive:**
   ```
   Analyze the security implications of quantum computing on current encryption
   ```

---

## 🐛 Common Issues

### "Failed to fetch session"
- Check your Supabase credentials in `.env.local`
- Verify database tables were created
- Check RLS policies are set

### "LLM call failed"
- Verify OpenRouter API key is correct
- Check you have credits on OpenRouter
- Try a different model in `lib/config.ts`

### Build errors
- Run `npm install` again
- Delete `.next` folder: `rm -rf .next`
- Check Node.js version: `node -v` (needs 18+)

---

## 📚 Next Steps

1. **Customize Models**: Edit `lib/config.ts` to change AI models
2. **Add Tools**: Extend `AVAILABLE_TOOLS` in `lib/config.ts`
3. **Modify UI**: Update components in `app/components/`
4. **Deploy**: Follow the Vercel deployment guide in `README.md`

---

## 💡 Tips

- **Start Simple**: Test with short queries first
- **Watch Console**: Keep browser DevTools open to see progress
- **Check Limits**: Default timeout is 5 minutes (configurable)
- **Monitor Costs**: OpenRouter dashboard shows token usage

---

## 🆘 Need Help?

- 📖 Read the full [Setup Guide](./SETUP.md)
- 📘 Check the [README](./README.md)
- 🐛 Report issues on GitHub
- 💬 Join our community (coming soon)

---

**Ready? Run `npm run dev` and start researching! 🚀**
