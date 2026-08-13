// Vercel Serverless Function: RAG Chatbot for Portfolio
// Handles chat requests with portfolio knowledge base

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Portfolio knowledge base - embedded directly
const KNOWLEDGE_BASE = [
  {
    id: 'about',
    category: 'About',
    content: `Salahuddin Muhammad is an aspiring AI Automation & Agentic AI Developer passionate about building intelligent systems, AI agents, RAG chatbots, and automation solutions that solve real-world problems. He is dedicated to continuously learning, exploring emerging technologies, and transforming innovative ideas into practical, impactful AI solutions.`,
  },
  {
    id: 'skills-agentic-ai',
    category: 'Skills',
    content: `Agentic AI Development: Designing autonomous agents that understand tasks, adapt to context, and deliver outcomes with minimal oversight.`,
  },
  {
    id: 'skills-ai-automation',
    category: 'Skills',
    content: `AI Automation: Automating workflows, data operations, and decision-making with intelligent systems that reduce manual effort.`,
  },
  {
    id: 'skills-rag-chatbots',
    category: 'Skills',
    content: `RAG Chatbots: Building retrieval-augmented chatbots that answer questions with accurate, up-to-date knowledge from real sources.`,
  },
  {
    id: 'skills-personal-ai-employees',
    category: 'Skills',
    content: `Personal AI Employees: Crafting AI copilots and virtual assistants that extend teams and improve productivity across roles.`,
  },
  {
    id: 'skills-api-integration',
    category: 'Skills',
    content: `API Integration: Connecting modern APIs, data platforms, and AI services into seamless, composable digital products.`,
  },
  {
    id: 'skills-ai-powered-solutions',
    category: 'Skills',
    content: `AI-Powered Solutions: Delivering user experiences enriched by machine intelligence, personalization, and scalable automation.`,
  },
  {
    id: 'project-3d-portfolio',
    category: 'Projects',
    content: `3D Portfolio Experience: A cinematic, interactive portfolio concept designed to feel like a living scene rather than a static page. Built with Three.js, WebGL, Immersive UI.`,
  },
  {
    id: 'project-interactive-product',
    category: 'Projects',
    content: `Interactive Product Interfaces: Polished front-end systems focused on clarity, motion, and a memorable user journey. Built with HTML, CSS, JavaScript.`,
  },
  {
    id: 'project-creative-landing',
    category: 'Projects',
    content: `Creative Landing Pages: Story-driven digital experiences built for presentation, brand presence, and strong first impressions. Focus on Animation, Interaction, Storytelling.`,
  },
  {
    id: 'project-ai-employee',
    category: 'Projects',
    content: `24/7 Autonomous AI Digital Employee: An agentic AI system powered by OpenClaw, connected to WhatsApp and Discord for remote task delegation. Allows delegating tasks from mobile phone while travelling. Features: Work from anywhere, 24/7 digital employee, natural language interaction, autonomous task execution, mobile-first control via WhatsApp/Discord, task completion feedback. Tech: OpenClaw, Agentic AI, Autonomous AI Agents, WhatsApp Integration, Discord Integration, AI Model Integration, Task Automation, Remote AI Interaction, Tool-Based AI Workflows.`,
  },
  {
    id: 'contact',
    category: 'Contact',
    content: `Contact Information: Available for freelance work, creative collaborations, and ambitious digital ideas. Primary: WhatsApp (https://wa.me/923222820804). Secondary: LinkedIn (https://www.linkedin.com/in/salahuddin-muhammad). Also on GitHub (https://github.com/salahnewgthub), Facebook (https://www.facebook.com/salahuddin.muhammad.391), YouTube (https://www.youtube.com/@MrSalah3).`,
  },
];

// Simple embedding function using OpenAI
async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });
  return response.data[0].embedding;
}

// Cosine similarity
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Pre-compute embeddings for knowledge base (cached in memory)
let knowledgeEmbeddings = null;

async function initializeEmbeddings() {
  if (knowledgeEmbeddings) return knowledgeEmbeddings;

  knowledgeEmbeddings = await Promise.all(
    KNOWLEDGE_BASE.map(async (item) => ({
      ...item,
      embedding: await getEmbedding(item.content),
    }))
  );
  return knowledgeEmbeddings;
}

// Retrieve relevant chunks
async function retrieveRelevantChunks(query, topK = 4) {
  const embeddings = await initializeEmbeddings();
  const queryEmbedding = await getEmbedding(query);

  const scored = embeddings.map((item) => ({
    ...item,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

// Generate response with streaming
async function generateResponse(query, relevantChunks) {
  const context = relevantChunks.map((c) => `[${c.category}] ${c.content}`).join('\n\n');

  const systemPrompt = `You are a helpful AI assistant for Salahuddin Muhammad's portfolio website.
Answer questions about his skills, projects, experience, and contact information based ONLY on the provided context.
Be concise, professional, and friendly. If the answer isn't in the context, say you don't have that information and suggest contacting him directly.
Keep responses to 2-4 sentences unless more detail is requested.`;

  const userPrompt = `Context:\n${context}\n\nQuestion: ${query}`;

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 300,
    stream: true,
  });

  return stream;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Retrieve relevant knowledge
    const relevantChunks = await retrieveRelevantChunks(message);

    // Generate streaming response
    const stream = await generateResponse(message, relevantChunks);

    // Set up Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}