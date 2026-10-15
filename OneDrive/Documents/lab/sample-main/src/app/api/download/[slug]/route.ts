import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const content = `# =================================================================
# ${product.title.toUpperCase()}
# Official Digital Edition • 2026 Release
# Author: Anubhav Bharti (vedxlabs)
# Contact: contact@anubhavbharti.dev | DM @vedxlabs
# =================================================================

Welcome to ${product.title}!

Thank you for enrolling. This digital handbook is your structured blueprint 
to go from complete zero to daily confidence with modern AI tools.

-----------------------------------------------------------------
1. QUICK START & NOTION WORKSPACE ACCESS
-----------------------------------------------------------------
To duplicate the interactive 28-Day Notion Hub with embedded prompt generators 
and daily checkboxes:
-> Access URL: https://notion.so/vedxlabs/${slug}-interactive-hub
-> Click "Duplicate" in top right corner to add to your personal Notion.

-----------------------------------------------------------------
2. THE 28-DAY ROADMAP BREAKDOWN
-----------------------------------------------------------------

[WEEK 1: AI FOUNDATIONS & SETUP]
- Day 01: Demystifying Modern AI — Tokens, Latency & Mental Models
  * Tool: ChatGPT Free / Claude 3.5 Sonnet
  * Prompt: "Explain [complex topic] using the Feynman technique for a 12-year-old."
- Day 02: Choosing Your Optimal Tool Stack — Free vs Paid Alternatives
- Day 03: The Art of Context Engineering — System Prompts & Roles
- Day 04: Few-Shot Prompting — Forcing Structured Outputs & JSON
- Day 05: Hallucination Prevention — Grounding AI in Verified Facts
- Day 06: Data Distillation — Turning messy 50-page PDFs into actionable summaries
- Day 07: Week 1 Milestone: Your Personal Custom GPT Configured

[WEEK 2: PRODUCTIVITY & 10X CONTENT CREATION]
- Day 08: Inbox Zero — Executive Email Synthesis & Context-Aware Replies
- Day 09: Long-Form Writing & Outline Architecture with Claude
- Day 10: Viral Hook & Script Generation for LinkedIn & Twitter/X
- Day 11: Image Prompting Fundamentals (Midjourney & DALL-E 3)
- Day 12: Generating Executive Pitch Decks & Slide Outlines in 15 Minutes
- Day 13: Calendar & Task Automation Workflows
- Day 14: Week 2 Milestone: Your Automated Content Engine Live

[WEEK 3: BUILDING & NO-CODE AUTOMATION]
- Day 15: AI as Your Co-Developer (Cursor, Copilot & Claude Code)
- Day 16: Building Your First Functional Landing Page in 30 Minutes
- Day 17: No-Code Automation — Connecting AI with Google Sheets & Make.com
- Day 18: Structuring Unstructured Data & Smart CSV Extractors
- Day 19: Training Custom Knowledge Assistants on Personal Notes
- Day 20: Deploying a Web Tool to the Public Internet (Vercel)
- Day 21: Week 3 Milestone: Your First Live Internet Micro-App

[WEEK 4: MONETISATION & ADVANCED SKILLS]
- Day 22: AI-Powered Freelancing — Packaging Turnkey Services
- Day 23: Cold Outreach & Proposal Generation with 35%+ Response Rates
- Day 24: Building Workflow Automations for Local Businesses
- Day 25: Creating High-Margin Digital Assets & Templates
- Day 26: Evaluating New AI Models as They Launch
- Day 27: Ethics, Copyright & Sustainable AI Workflows
- Day 28: Graduation Milestone: Your 90-Day AI Growth Blueprint

-----------------------------------------------------------------
3. PRODUCTION PROMPTS VAULT (TOP SAMPLES)
-----------------------------------------------------------------

[PROMPT 1: CODE REFACTOR & PERFORMANCE REVIEW]
"Act as a Principal Software Engineer. Review the following code snippet. 
Identify performance bottlenecks, memory leaks, and anti-patterns. 
Provide a refactored version with explanations for every change:
[PASTE CODE]"

[PROMPT 2: HIGH-CONVERTING LANDING PAGE COPY]
"Act as an elite direct-response copywriter. Write hero copy for [product].
Format: 
1. Attention-grabbing eyebrow
2. Punchy headline (max 8 words)
3. Clarity-first subheadline
4. 3 bulleted transformation benefits
5. High-intent call-to-action button copy."

[PROMPT 3: EXECUTIVE BRIEFING FROM MESSY DATA]
"Analyze the attached raw data/notes. Extract:
1. Executive Summary (3 sentences)
2. 5 Key Takeaways with metrics
3. Top 3 risks or friction points
4. Recommended next steps for the next 7 days."

-----------------------------------------------------------------
4. NEED ASSISTANCE OR HAVE FEEDBACK?
-----------------------------------------------------------------
Have questions about any lesson or want feedback on your prompts?
- Creator Email: contact@anubhavbharti.dev
- Instagram DM: @vedxlabs
- Community: Join 500+ builders in the private Telegram / Discord

Enjoy your journey mastering AI!
— Anubhav Bharti
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-handbook-2026.md"`,
    },
  });
}
