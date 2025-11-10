# 🧠 Deep Research Agent — MCP Orchestrator

> *A production-ready Progressive Web App for autonomous deep research and report generation powered by AI*

[![PWA](https://img.shields.io/badge/PWA-Ready-blue.svg)](PWA_FEATURES.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 🏗 Overview

The **Deep Research Agent** is an open-source, production-ready implementation of a **multi-step reasoning and research system** powered by **MCP-Agent** — a modular framework for connecting large language models (LLMs) to tool servers and structured data via the **Model Context Protocol (MCP)**.

It combines deterministic orchestration, context-aware planning, and dynamic workflow execution to perform **complex research tasks** autonomously — from academic investigations to financial and scientific analysis.

---

## 🎯 Objective

To build a **general-purpose deep research agent** that can:
- Perform complex, multi-step reasoning and tool-using tasks  
- Dynamically plan, execute, and refine research workflows  
- Integrate with multiple MCP servers and tools  
- Manage external context, memory, and token budgets efficiently  
- Verify and reflect on plans deterministically before execution  

---

## ⚙️ Architecture

### 1. Planning Layer
Breaks down the user’s objective into **structured subtasks** using a high-reasoning LLM.  
Defines dependencies, tool usage, and memory needs upfront.

### 2. Execution Layer
Executes the subtasks sequentially or in parallel.  
Each step gathers context, stores memory, and passes relevant knowledge forward.

### 3. Verification Layer
Validates the plan **before** running it:
- Checks MCP server and agent availability  
- Verifies dependency graph consistency  
- Prevents hallucinated calls or undefined tools  

### 4. Policy Engine
Controls workflow decisions:
- **Continue Executing** — proceed normally  
- **Trigger Replanning** — replan based on new context  
- **Emergency Stop** — halt due to repeated failure  
- **Force Completion** — end gracefully on timeout or budget limit  

---

## 🔍 Key Features

| Feature | Description |
|:--------|:-------------|
| **Deterministic Verification** | Code-based validation of plan structure, dependencies, and agents |
| **External Memory** | Knowledge banks for persistent, efficient context recall |
| **Dynamic Planning** | LLM builds and updates plans as tasks progress |
| **Context Graph** | Task dependency map defines what memory to propagate |
| **Budget Management** | Tracks tokens, cost, and latency through all steps |
| **Beast Mode** | Graceful fallback output when limits are reached |
| **XML-Structured Prompts** | Prompts built programmatically for clarity and modularity |
| **📱 PWA Ready** | Installable Progressive Web App with offline support |
| **🎬 Animated Splash** | Professional loading screen with branded animations |

---

## 📱 Progressive Web App Features

The Deep Research Agent is a **fully-featured PWA** providing a native app experience:

### 🏠 **Installable Native App**
- **Add to Home Screen**: One-click installation on any device
- **Standalone Mode**: Runs without browser UI like a native app
- **Custom App Icon**: Professional gradient search icon with research branding
- **Cross-Platform**: Works on iOS, Android, Windows, macOS, and Linux

### 🎬 **Animated Splash Screen**
- **Brand Experience**: Rotating search icon with pulsing animations
- **Smart Logic**: Shows on first visit and PWA launches
- **Smooth Transitions**: Professional fade in/out with Framer Motion
- **Loading States**: Engaging user experience during app initialization

### 🔄 **Offline Capabilities**
- **Service Worker**: Intelligent caching with NetworkFirst strategy
- **Background Sync**: Seamless data synchronization when connection returns
- **Offline Research**: Core functionality available without internet
- **Auto-Updates**: Service worker updates automatically in background

### 📦 **Smart Install Prompt**
- **User-Friendly**: Beautiful custom install card with app preview
- **Smart Timing**: Appears after 3 seconds of engagement
- **Remembers Choice**: Respects user install/dismiss decisions
- **Cross-Browser**: Works on Chrome, Edge, and PWA-compatible browsers

[📱 **View Complete PWA Documentation →**](PWA_FEATURES.md)

---

## 🔄 Evolution

### 🧱 Take 1 — Orchestrator
- Fixed plan created upfront  
- Worked well for simple workflows  
- Failed in dynamic reasoning and token efficiency  

### 🔄 Take 2 — Adaptive Workflow
- Added external memory, token budgets, and dynamic subagents  
- Over-engineered: slower, more complex, less reliable  

### 🚀 Take 3 — Deep Orchestrator
- Returned to simpler orchestration loop with deterministic verification  
- Balanced performance, reliability, and reasoning depth  

> **Core insight:**  
> *Simplicity beats complexity — verified loops outperform dynamic chaos.*

---

## 🧩 Core Loop

```text
1️⃣  Receive user objective  
2️⃣  Generate initial plan (with substeps + dependencies)  
3️⃣  Verify plan deterministically  
4️⃣  Execute tasks (sequentially/parallel)  
5️⃣  Aggregate context + update memory  
6️⃣  Verify outcome → if incomplete, replan  
7️⃣  Synthesize final result


---

💡 Key Learnings

1. Simple architecture wins — A minimal deterministic loop performs better than over-complex dynamic systems.


2. MCP is all you need — Any research or analysis task can be composed entirely from MCP tool servers.


3. Prompt structure matters — Well-formed, sectioned prompts with XML or structured formatting dramatically improve reasoning reliability.


4. Hybrid reasoning loop — Code + LLM synergy (deterministic checks + generative reasoning) leads to stable, scalable behavior.




---

🧠 Future Directions

Remote Execution via MCP — Expose orchestration as callable MCP servers

Intelligent Tool Selection — Smart subagent creation and tool filtering

Memory as MCP Resources — Represent knowledge stores as URI-accessible MCP data

Dynamic Model Switching — Use smaller LLMs for tool calls, larger for reasoning



---

🧭 Repository

Source code and examples available at:
👉 Deep Orchestrator Workflow – MCP-Agent


---

📘 Example Use Case

Finance Research Agent

Connects to an MCP server for financial datasets

Plans a multi-step query (trend analysis → data retrieval → synthesis)

Verifies plan, executes, and generates an analytical report

Replans if the objective remains unsatisfied



---

🧩 Tech Stack

Layer	Technology

Framework	MCP-Agent
Orchestration	Deep Orchestrator Workflow
Model	Any MCP-compatible LLM (Claude, GPT, etc.)
Memory	External Knowledge Store / MCP Resource
Verification	Deterministic plan validator (Python-based)
Execution	MCP Tool Calls / Subagent chaining
