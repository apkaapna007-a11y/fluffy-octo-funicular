# 🔬 Deep Research Agent — MCP Orchestrator

A production-ready autonomous research agent built on **Next.js 15**, **OpenRouter**, **Supabase**, and **MCP architecture**. Get comprehensive, well-sourced research reports powered by advanced AI orchestration.

![Deep Research Agent](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **🧠 Intelligent Planning**: AI breaks down complex queries into executable research steps
- **✅ Deterministic Verification**: Ensures plan validity with both deterministic and LLM-based checks
- **⚡ Parallel Execution**: Executes independent research steps concurrently
- **📊 Real-time Progress**: Beautiful UI showing step-by-step research progress
- **📚 Knowledge Memory**: Persistent storage of findings with source citations
- **🎯 Confidence Scoring**: Each result includes confidence metrics
- **📄 Export Reports**: Download research reports as Markdown
- **🌐 Multi-Model Routing**: Optimized model selection per orchestration phase
- **🔄 Beast Mode**: Automatic fallback for time/budget constraints

---

## 🏗️ Architecture

### Core Components

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Planner │  (Claude 3.5 Sonnet)
    └────┬────┘
         │
    ┌────▼────┐
    │Verifier │  (GPT-4o Mini)
    └────┬────┘
         │
    ┌────▼────┐
    │Executor │  (Mixtral 8x7B)
    └────┬────┘
         │
    ┌────▼────────┐
    │ Synthesizer │  (GPT-4o)
    └────┬────────┘
         │
    ┌────▼────────┐
    │ Final Report│
    └─────────────┘
```

### Model Routing

| Phase | Model | Purpose |
|-------|-------|---------|
| **Planner** | Claude 3.5 Sonnet | Generate structured research plans |
| **Verifier** | GPT-4o Mini | Validate plan correctness |
| **Executor** | Mixtral 8x7B | Execute research tasks |
| **Synthesizer** | GPT-4o | Compile comprehensive reports |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- Supabase account ([Sign up](https://supabase.com/))

### 1. Clone and Install

```bash
git clone <your-repo>
cd deep-research-agent
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your credentials:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_API_BASE=https://openrouter.ai/api/v1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_KEY=eyJhbG...
```

### 3. Set Up Database

Run this SQL in your Supabase SQL Editor:

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON research_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_session_id ON knowledge_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_relevance ON knowledge_entries(relevance DESC);

-- Enable Row Level Security
ALTER TABLE research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations" ON research_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON knowledge_entries FOR ALL USING (true);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/deep-research-agent)

### Manual Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `OPENROUTER_API_KEY`
     - `OPENROUTER_API_BASE`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY`

3. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes! 🚀

---

## 🎯 Usage Examples

### Example 1: Climate Research
```
Query: "Research climate change impacts on agriculture in developing countries"

Plan Generated:
1. Search for recent climate data and trends
2. Identify most affected agricultural regions
3. Analyze economic impact studies
4. Gather adaptation strategies from WHO/UN
5. Synthesize findings with policy recommendations

Result: Comprehensive 2000-word report with 15+ citations
```

### Example 2: Technology Analysis
```
Query: "Compare quantum computing approaches and their commercial viability"

Plan Generated:
1. Research quantum computing technologies (gate-based, annealing, topological)
2. Analyze current commercial applications
3. Compare leading companies and their approaches
4. Evaluate technical challenges and timelines
5. Assess market predictions and investment trends

Result: Detailed analysis with confidence scores per finding
```

---

## 🛠️ Configuration

### Model Routing

Edit `lib/config.ts` to customize model selection:

```typescript
export const MODEL_ROUTING = {
  planner: "anthropic/claude-3.5-sonnet",
  verifier: "openai/gpt-4o-mini",
  executor: "mistralai/mixtral-8x7b-instruct",
  synthesizer: "openai/gpt-4o",
};
```

### Orchestration Limits

Adjust timeouts and constraints:

```typescript
export const ORCHESTRATION_LIMITS = {
  maxSteps: 10,              // Maximum research steps
  maxRetries: 3,             // Plan retry attempts
  stepTimeout: 60000,        // 60 seconds per step
  totalTimeout: 300000,      // 5 minutes total
  maxTokens: 4096,          // Max tokens per LLM call
};
```

### Available Tools

Extend MCP tools in `lib/config.ts`:

```typescript
export const AVAILABLE_TOOLS = [
  { name: 'web_search', description: '...', parameters: {...} },
  { name: 'fetch_url', description: '...', parameters: {...} },
  { name: 'extract_data', description: '...', parameters: {...} },
  // Add your custom tools here
];
```

---

## 📁 Project Structure

```
deep-research-agent/
├── app/
│   ├── api/
│   │   └── orchestrate/
│   │       └── route.ts          # Main orchestration endpoint
│   ├── components/
│   │   ├── ChatInput.tsx         # User input component
│   │   ├── StepCard.tsx          # Research step display
│   │   ├── KnowledgeSidebar.tsx  # Knowledge memory panel
│   │   └── ReportPreview.tsx     # Final report viewer
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── lib/
│   ├── mcp/
│   │   ├── planner.ts            # Plan generation
│   │   ├── verifier.ts           # Plan validation
│   │   ├── executor.ts           # Task execution
│   │   ├── synthesizer.ts        # Report synthesis
│   │   ├── policyEngine.ts       # Decision making
│   │   └── promptBuilder.ts      # Prompt templates
│   ├── config.ts                 # App configuration
│   ├── llm.ts                    # OpenRouter integration
│   ├── supabase.ts               # Database client
│   └── types.ts                  # TypeScript types
├── .env.local.example            # Environment template
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🔧 Advanced Features

### Beast Mode

Automatically activates when:
- 80% of timeout elapsed
- 2+ retries with <30% progress

Forces completion with available results.

### Policy Engine

Decides orchestration flow:
- **Continue**: Execute remaining steps
- **Replan**: Plan has issues, regenerate
- **Stop**: Sufficient info, synthesize now

### Knowledge Persistence

All findings are stored in Supabase:
- Automatic relevance scoring
- Source attribution
- Session-based retrieval

---

## 🎨 UI Features

- **Perplexity-style Interface**: Clean, modern design
- **Framer Motion Animations**: Smooth transitions
- **Dark Mode Support**: Automatic theme detection
- **Responsive Layout**: Mobile-friendly
- **Real-time Updates**: Live progress tracking
- **Markdown Export**: One-click download

---

## 🧪 Development

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Build Production
```bash
npm run build
npm start
```

---

## 📊 Performance

- **Cold Start**: ~2-3 seconds
- **Average Research**: 30-90 seconds
- **Max Duration**: 5 minutes
- **Edge Runtime**: Optional for <1s latency

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🔗 Links

- **OpenRouter**: [https://openrouter.ai](https://openrouter.ai)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **Next.js**: [https://nextjs.org](https://nextjs.org)
- **MCP Architecture**: [AI Alliance Deep Orchestrator](https://github.com/ai-alliance)

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/deep-research-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/deep-research-agent/discussions)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using Next.js, OpenRouter, and Supabase**
