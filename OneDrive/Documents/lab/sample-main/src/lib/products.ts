import type { Product, ProductCard } from "@/types/product";
import { loadJsonFile, getPersistentData, setPersistentData } from "./storage";

const PRODUCTS_KEY = "products";
const PRODUCTS_FILE = "products.json";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_01",
    slug: "master-ai-in-28-days",
    title: "Master AI in 28 Days",
    shortDescription: "A practical, beginner-friendly roadmap to understand AI, use AI effectively and start building with it.",
    tagline: "From Zero to Confident With AI — a daily guide for beginners.",
    fullDescription: `Master AI in 28 Days is a structured, practical digital blueprint created to take everyday learners, students, and professionals from complete confusion to confident daily AI execution.

Instead of overwhelming you with 40 hours of passive video lectures, this guide breaks down modern artificial intelligence into 28 focused daily micro-lessons. Each day features one mental model, one prompt framework, and one hands-on exercise you can complete in under 20 minutes.

By Day 28, you will comfortably integrate AI into your daily work, automate repetitive tasks, prototype software without coding, and understand how to package AI skills into freelance services or creator income.`,
    description: `A practical, beginner-friendly roadmap to understand AI, use AI effectively and start building with it.`,
    price: 9900,           // ₹99 in paise
    originalPrice: 49900,  // ₹499 in paise
    coverImage: "/images/ai-28-days-cover.png",
    galleryImages: ["/images/ai-28-days-cover.png"],
    category: "Guide",
    features: [
      "28 daily action lessons with zero fluff",
      "No programming or tech background required",
      "50+ production-tested prompt templates",
      "Workflows for ChatGPT, Claude, Cursor & Midjourney",
      "Monetisation & client acquisition playbook",
      "Lifetime updates as new AI models launch",
    ],
    whatsIncluded: [
      "Complete 28-Day Roadmap (PDF & Interactive Notion Hub)",
      "Production Prompt Vault (50+ categorized prompts)",
      "Vetted AI Tool Stack Cheatsheet (Free & Paid alternatives)",
      "Starter Code & Landing Page Templates",
      "2026 AI Freelancing Proposal Pitch Kit",
      "Direct email/DM access to Anubhav Bharti",
    ],
    fileReference: "master-ai-in-28-days-edition-2026.pdf",
    curriculum: [
      {
        id: "week1",
        title: "Week 01: AI Foundations & Setup",
        description: "Demystifying LLMs, prompt architecture, context control, and setting up your personal AI workspace.",
        lessons: [
          "Day 01: Demystifying LLMs — How AI actually thinks",
          "Day 02: Prompt Engineering 101 — Context, Role & Constraints",
          "Day 03: The Persona Technique for deep expert outputs",
          "Day 04: Rapid Writing & Editing without sounding robotic",
          "Day 05: Deep Research & Literature Extraction in minutes",
          "Day 06: Data distillation — Turning messy PDFs into insights",
          "Day 07: Week 1 Milestone: Your Personal AI Toolkit Setup",
        ],
      },
      {
        id: "week2",
        title: "Week 02: Daily Productivity & Content 10x",
        description: "Save 10+ hours every week across work, writing, presentation drafting, and media generation.",
        lessons: [
          "Day 08: Inbox Zero — Automated email synthesis & drafting",
          "Day 09: Long-form Content Generation & Outline Architecture",
          "Day 10: Social Media & Viral Script generation that connects",
          "Day 11: Image Generation Fundamentals with Midjourney & DALL-E",
          "Day 12: Building Beautiful Pitch Decks & Presentations fast",
          "Day 13: Calendar & Task Automation workflows",
          "Day 14: Week 2 Milestone: Your Automated Content Engine",
        ],
      },
      {
        id: "week3",
        title: "Week 03: Building & Automating Without Code",
        description: "Use AI as your co-developer to prototype web tools, automate sheets, and deploy live creations.",
        lessons: [
          "Day 15: AI as your Co-Programmer (Claude, Cursor & Copilot)",
          "Day 16: Building your first functional landing page in 30 mins",
          "Day 17: No-Code Automation — Connecting AI to Google Sheets",
          "Day 18: Structuring data & building smart CSV extractors",
          "Day 19: Creating Custom GPTs trained on your own knowledge",
          "Day 20: Deploying your first web widget to the internet",
          "Day 21: Week 3 Milestone: Your Live Internet Creation",
        ],
      },
      {
        id: "week4",
        title: "Week 04: Monetisation, Freelancing & Growth",
        description: "Transform your newfound skills into freelance services, digital products, and personal creator leverage.",
        lessons: [
          "Day 22: Identifying High-Paying AI Freelance Services",
          "Day 23: Packaging AI solutions for local businesses & clients",
          "Day 24: Building digital products (templates, guides, assets)",
          "Day 25: Outreach & client acquisition scripts that convert",
          "Day 26: Pricing, positioning, and avoiding commodity traps",
          "Day 27: Building long-term creator leverage and systems",
          "Day 28: Graduation: Your Ongoing AI Growth Playbook",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need any technical or programming knowledge?",
        answer: "None whatsoever. The guide begins from complete zero. If you know how to use a web browser and type text, you have 100% of the prerequisites needed.",
      },
      {
        question: "How much time do I need to invest each day?",
        answer: "Around 20 to 30 minutes per day. Each lesson includes a 10-minute conceptual breakdown and a 15-minute hands-on exercise you can complete right away.",
      },
      {
        question: "How is this delivered after payment?",
        answer: "Immediately upon checkout, an email is automatically sent with your secure download links and Notion portal access. You can also download the initial onboarding kit directly from the receipt page.",
      },
      {
        question: "Will I need expensive paid subscriptions for AI tools?",
        answer: "No. 90% of the daily exercises use the free tiers of ChatGPT, Claude, and free open-source software. We explicitly outline free alternatives for every task.",
      },
    ],
    isPublished: true,
    isFeatured: true,
    metadata: {
      seoTitle: "Master AI in 28 Days — Beginner's Guide by Anubhav Bharti",
      seoDescription: "Learn AI from zero to confident in 28 daily lessons. Practical guide for students, professionals & entrepreneurs.",
      tags: ["AI", "Beginner", "Productivity", "ChatGPT", "Guide"],
    },
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-07T12:00:00.000Z",
  },
  {
    id: "prod_02",
    slug: "100-production-prompts-vault",
    title: "The 100+ Production Prompts Vault",
    shortDescription: "Deterministic, battle-tested prompt frameworks for copywriting, code generation, executive summaries, and research.",
    tagline: "Stop getting generic AI replies. Use prompts that output production-grade work.",
    fullDescription: `Most people get mediocre, robotic responses from AI because their prompts lack constraints, role definitions, and structured reasoning scaffolds.

The 100+ Production Prompts Vault is Anubhav Bharti's personal system of battle-tested prompts refined over 2 years of daily development and content creation.

Organized into clean categories (Engineering, Marketing, Client Proposals, Cold Outreach, Strategic Research, Data Extraction), each prompt is a fill-in-the-blank blueprint engineered to bypass LLM fluff and deliver high-precision results on the very first attempt.`,
    price: 14900,          // ₹149 in paise
    originalPrice: 49900,  // ₹499 in paise
    coverImage: "/images/prompts-vault-cover.png",
    galleryImages: ["/images/prompts-vault-cover.png"],
    category: "Prompt Pack",
    features: [
      "100+ deterministic prompt templates",
      "6 core categories (Tech, Copy, Strategy, Email, Sales, Data)",
      "Interactive Notion Hub + clean PDF reference",
      "Tested across Claude 3.5 Sonnet, GPT-4o, and Gemini Pro",
      "One-click copy to clipboard",
    ],
    whatsIncluded: [
      "The Master Notion Prompt Database with tags and search",
      "Printable PDF Quick Reference Cheatsheet",
      "Few-shot prompt formatting guide",
      "Monthly prompt additions & updates",
    ],
    fileReference: "100-production-prompts-vault.pdf",
    faqs: [
      {
        question: "Which AI models do these prompts work with?",
        answer: "They are optimized for Claude 3.5 Sonnet, ChatGPT (GPT-4o), Gemini 1.5/2.0, and open source models like Llama 3.",
      },
      {
        question: "Are these just simple one-line prompts?",
        answer: "No. These are multi-step system prompts utilizing role anchoring, few-shot formatting, negative constraints, and output schema specifications.",
      },
    ],
    isPublished: true,
    isFeatured: false,
    metadata: {
      seoTitle: "100+ Production Prompts Vault — By Anubhav Bharti",
      seoDescription: "Battle-tested prompt frameworks for engineers, marketers, and digital creators.",
      tags: ["Prompts", "ChatGPT", "Claude", "Productivity"],
    },
    createdAt: "2026-10-02T00:00:00.000Z",
    updatedAt: "2026-10-07T12:00:00.000Z",
  },
  {
    id: "prod_03",
    slug: "ai-freelance-client-kit",
    title: "AI Freelance & Client Services Kit",
    shortDescription: "Templates, proposals, contracts, and service packaging frameworks to land your first paying AI consulting clients.",
    tagline: "Turn your AI skills into a high-margin freelance business in 14 days.",
    fullDescription: `Small and mid-sized businesses want to implement AI, but they don't know where to start. They don't need machine learning researchers — they need practical builders who can set up automation workflows, train custom chatbots, and streamline their customer support.

This kit provides the complete business infrastructure:
- 5 Pre-packaged service offer templates (with pricing guidelines)
- Battle-tested client pitch deck
- Standard service agreement contract
- Cold outreach DM & email templates with 35%+ response rates
- Client onboarding checklist & questionnaire`,
    price: 19900,          // ₹199 in paise
    originalPrice: 99900,  // ₹999 in paise
    coverImage: "/images/freelance-kit-cover.png",
    galleryImages: ["/images/freelance-kit-cover.png"],
    category: "Blueprint",
    features: [
      "5 turnkey AI service offerings ready to sell",
      "Customizable client proposal & pitch deck (Figma / PDF)",
      "Standard client contract & NDA template",
      "Pricing calculator (Hourly vs Fixed vs Retainer)",
      "Case study presentation framework",
    ],
    whatsIncluded: [
      "Client Proposal Template (Figma + Canva + PDF)",
      "Legal Service Contract & Scope of Work doc",
      "Outreach Message Scripts for LinkedIn & Instagram",
      "Client Discovery Call Questionnaire",
    ],
    fileReference: "ai-freelance-client-kit-bundle.zip",
    faqs: [
      {
        question: "Can I use this if I haven't landed a client before?",
        answer: "Yes. The kit is specifically structured for first-time consultants to present themselves with institutional polish from day one.",
      },
    ],
    isPublished: true,
    isFeatured: false,
    metadata: {
      seoTitle: "AI Freelance & Client Services Kit — By Anubhav Bharti",
      seoDescription: "Templates and proposals to land paying AI consulting and automation clients.",
      tags: ["Freelancing", "Consulting", "Business", "Templates"],
    },
    createdAt: "2026-10-03T00:00:00.000Z",
    updatedAt: "2026-10-07T12:00:00.000Z",
  },
];

const globalForProducts = globalThis as unknown as { __PRODUCTS_STORE__?: Product[] };
if (!globalForProducts.__PRODUCTS_STORE__) {
  globalForProducts.__PRODUCTS_STORE__ = loadJsonFile<Product[]>(PRODUCTS_FILE, [...INITIAL_PRODUCTS]);
}

async function getProductsStore(): Promise<Product[]> {
  const products = await getPersistentData<Product[]>(PRODUCTS_KEY, [...INITIAL_PRODUCTS]);
  globalForProducts.__PRODUCTS_STORE__ = products;
  return products;
}

async function persistProducts(products: Product[]) {
  globalForProducts.__PRODUCTS_STORE__ = products;
  await setPersistentData(PRODUCTS_KEY, products);
}

// ──────────────────────────────────────────────────────────────
// DATA ACCESS FUNCTIONS
// ──────────────────────────────────────────────────────────────

/** Fetch all published products for public listings */
export async function getPublishedProducts(): Promise<ProductCard[]> {
  const store = await getProductsStore();
  return store.filter((p) => p.isPublished).map(toProductCard);
}

/** Fetch a single published product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = await getProductsStore();
  const product = store.find((p) => p.slug === slug && p.isPublished);
  return product ? { ...product } : null;
}

/** Fetch a single product by ID (admin or internal lookup) */
export async function getProductById(id: string): Promise<Product | null> {
  const store = await getProductsStore();
  const product = store.find((p) => p.id === id);
  return product ? { ...product } : null;
}

/** Fetch all products (admin — includes unpublished) */
export async function getAllProducts(): Promise<Product[]> {
  const store = await getProductsStore();
  return [...store];
}

/** Fetch featured product for primary hero or homepage spotlight */
export async function getFeaturedProduct(): Promise<Product | null> {
  const store = await getProductsStore();
  const product = store.find((p) => p.isFeatured && p.isPublished);
  return product ? { ...product } : store[0] || null;
}

/** Fetch published products by category */
export async function getProductsByCategory(category: string): Promise<ProductCard[]> {
  const store = await getProductsStore();
  return store.filter(
    (p) => p.isPublished && p.category.toLowerCase() === category.toLowerCase()
  ).map(toProductCard);
}

/** Helper mapper to ProductCard */
function toProductCard(p: Product): ProductCard {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription || p.tagline || "",
    tagline: p.tagline || p.shortDescription,
    price: p.price,
    originalPrice: p.originalPrice,
    coverImage: p.coverImage,
    category: p.category,
    features: p.features,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
  };
}

/** Save or create a product (admin) */
export async function saveProduct(data: Partial<Product>): Promise<Product> {
  const now = new Date().toISOString();
  const store = await getProductsStore();

  if (data.id) {
    const index = store.findIndex((p) => p.id === data.id);
    if (index !== -1) {
      const existing = store[index];
      const updated: Product = {
        ...existing,
        ...data,
        id: existing.id,
        updatedAt: now,
      } as Product;
      store[index] = updated;
      await persistProducts(store);
      return updated;
    }
  }

  // Creating new product
  const newProduct: Product = {
    id: data.id || `prod_${Date.now()}`,
    slug: data.slug || `product-${Date.now()}`,
    title: data.title || "Untitled Product",
    shortDescription: data.shortDescription || "",
    fullDescription: data.fullDescription || "",
    price: data.price ?? 9900,
    originalPrice: data.originalPrice,
    coverImage: data.coverImage || "/images/ai-28-days-cover.png",
    galleryImages: data.galleryImages || [data.coverImage || "/images/ai-28-days-cover.png"],
    features: data.features || [],
    whatsIncluded: data.whatsIncluded || [],
    category: data.category || "Guide",
    fileReference: data.fileReference || "starter-guide.pdf",
    isPublished: data.isPublished ?? true,
    isFeatured: data.isFeatured ?? false,
    curriculum: data.curriculum,
    faqs: data.faqs,
    metadata: data.metadata,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  store.unshift(newProduct);
  await persistProducts(store);
  return newProduct;
}

/** Delete a product (admin) */
export async function deleteProduct(id: string): Promise<boolean> {
  const store = await getProductsStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  await persistProducts(store);
  return true;
}

