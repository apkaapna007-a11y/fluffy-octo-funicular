# 🧠 Deep Research Agent — MCP Orchestrator

> *A general-purpose deep research agent built on the MCP-Agent architecture.*

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
