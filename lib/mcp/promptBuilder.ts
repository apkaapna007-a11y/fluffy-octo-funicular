import { PlanStep, KnowledgeEntry } from '../types';

export const prompts = {
  // Planning prompt
  buildPlanPrompt(query: string): string {
    return `You are a research planning expert. Create a detailed, structured research plan for the following query.

Query: "${query}"

Create a plan with 3-8 steps that will comprehensively answer this query. Each step should:
1. Have a clear, specific objective
2. Specify which tools/methods to use
3. Identify dependencies on previous steps
4. Be executable and verifiable

Output your plan in the following XML format:

<plan>
  <step id="1">
    <title>Brief title</title>
    <description>Detailed description of what to do</description>
    <tools>web_search,fetch_url</tools>
    <dependencies></dependencies>
  </step>
  <step id="2">
    <title>Brief title</title>
    <description>Detailed description</description>
    <tools>extract_data</tools>
    <dependencies>1</dependencies>
  </step>
  <!-- More steps as needed -->
</plan>

Create the plan now:`;
  },

  // Verification prompt
  buildVerifyPrompt(plan: PlanStep[], availableTools: string[]): string {
    const planJson = JSON.stringify(plan, null, 2);
    const toolsList = availableTools.join(', ');

    return `You are a verification expert. Validate the following research plan.

Available Tools: ${toolsList}

Plan to verify:
${planJson}

Check for:
1. All referenced tools exist in the available tools list
2. Dependencies are valid (no circular dependencies, referenced steps exist)
3. Steps are specific and executable
4. The plan logically flows from start to finish
5. No redundant or unnecessary steps

Respond in JSON format:
{
  "isValid": true/false,
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
  },

  // Execution prompt
  buildExecutePrompt(step: PlanStep, context: any[]): string {
    const contextStr = context.length > 0 
      ? `Context from previous steps:\n${JSON.stringify(context, null, 2)}`
      : 'No previous context available.';

    return `Execute the following research step:

Step: ${step.title}
Description: ${step.description}
Tools available: ${step.tools.join(', ')}

${contextStr}

Execute this step and return results in JSON format:
{
  "data": { /* your findings */ },
  "sources": [
    { "title": "...", "url": "...", "snippet": "...", "relevance": 0.9 }
  ],
  "confidence": 0.85,
  "summary": "Brief summary of findings"
}

Note: Since actual tool execution is simulated, provide realistic mock research data relevant to the step's objective.`;
  },

  // Synthesis prompt
  buildSynthesizePrompt(query: string, steps: PlanStep[], knowledge: KnowledgeEntry[]): string {
    const stepsData = steps
      .filter(s => s.result)
      .map(s => ({
        title: s.title,
        result: s.result,
      }));

    const knowledgeItems = knowledge.map(k => k.content);

    return `You are a research synthesis expert. Create a comprehensive research report.

Original Query: "${query}"

Research Steps Completed:
${JSON.stringify(stepsData, null, 2)}

Knowledge Base:
${knowledgeItems.join('\n\n')}

Create a well-structured research report that:
1. Directly answers the original query
2. Synthesizes information from all steps
3. Includes proper citations and sources
4. Uses clear, professional language
5. Highlights key findings and insights
6. Acknowledges any limitations or uncertainties

Format the report in Markdown with:
- Executive Summary
- Key Findings (bullet points)
- Detailed Analysis (sections as needed)
- Sources (numbered references)
- Conclusion

Write the report now:`;
  },

  // Policy decision prompt
  buildPolicyPrompt(
    query: string,
    currentPlan: PlanStep[],
    completedSteps: number,
    issues: string[]
  ): string {
    return `You are a policy engine for research orchestration. Decide the next action.

Query: "${query}"
Steps completed: ${completedSteps}/${currentPlan.length}
Issues encountered: ${issues.length > 0 ? issues.join('; ') : 'None'}

Current plan status:
${JSON.stringify(
  currentPlan.map(s => ({ title: s.title, status: s.status })),
  null,
  2
)}

Decide what to do next:
- "continue": Keep executing the plan
- "replan": Plan has issues, need to create a new plan
- "stop": Enough information gathered, synthesize results

Respond in JSON format:
{
  "action": "continue" | "replan" | "stop",
  "reason": "explanation for this decision",
  "confidence": 0.85
}`;
  },
};
