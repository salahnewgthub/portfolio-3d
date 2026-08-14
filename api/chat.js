// Vercel Serverless Function: RAG Chatbot for Portfolio (Zero-Cost Version)
// Uses simple keyword matching - no API keys required!

// Portfolio knowledge base - embedded directly
const KNOWLEDGE_BASE = [
  {
    id: 'about',
    category: 'About',
    keywords: ['about', 'who', 'bio', 'background', 'salahuddin', 'muhammad', 'developer', 'experience', 'aspiring'],
    content: `Salahuddin Muhammad is an aspiring AI Automation & Agentic AI Developer passionate about building intelligent systems, AI agents, RAG chatbots, and automation solutions that solve real-world problems. He is dedicated to continuously learning, exploring emerging technologies, and transforming innovative ideas into practical, impactful AI solutions.`,
  },
  {
    id: 'skills-agentic-ai',
    category: 'Skills',
    keywords: ['agentic', 'autonomous', 'agent', 'agents', 'ai development', 'ai developer', 'skills', 'skill'],
    content: `Agentic AI Development: Designing autonomous agents that understand tasks, adapt to context, and deliver outcomes with minimal oversight.`,
  },
  {
    id: 'skills-ai-automation',
    category: 'Skills',
    keywords: ['automation', 'workflow', 'automate', 'data operations', 'decision-making', 'skills', 'skill'],
    content: `AI Automation: Automating workflows, data operations, and decision-making with intelligent systems that reduce manual effort.`,
  },
  {
    id: 'skills-rag-chatbots',
    category: 'Skills',
    keywords: ['rag', 'chatbot', 'chatbots', 'retrieval', 'augmented', 'knowledge', 'skills', 'skill'],
    content: `RAG Chatbots: Building retrieval-augmented chatbots that answer questions with accurate, up-to-date knowledge from real sources.`,
  },
  {
    id: 'skills-personal-ai-employees',
    category: 'Skills',
    keywords: ['personal ai', 'copilot', 'virtual assistant', 'assistant', 'productivity', 'ai employee', 'skills', 'skill'],
    content: `Personal AI Employees: Crafting AI copilots and virtual assistants that extend teams and improve productivity across roles.`,
  },
  {
    id: 'skills-api-integration',
    category: 'Skills',
    keywords: ['api', 'integration', 'apis', 'data platforms', 'services', 'connect', 'skills', 'skill'],
    content: `API Integration: Connecting modern APIs, data platforms, and AI services into seamless, composable digital products.`,
  },
  {
    id: 'skills-ai-powered-solutions',
    category: 'Skills',
    keywords: ['ai powered', 'solutions', 'machine intelligence', 'personalization', 'scalable', 'skills', 'skill'],
    content: `AI-Powered Solutions: Delivering user experiences enriched by machine intelligence, personalization, and scalable automation.`,
  },
  {
    id: 'project-3d-portfolio',
    category: 'Projects',
    keywords: ['3d portfolio', 'portfolio', 'three.js', 'webgl', 'immersive', 'cinematic', 'interactive'],
    content: `3D Portfolio Experience: A cinematic, interactive portfolio concept designed to feel like a living scene rather than a static page. Built with Three.js, WebGL, Immersive UI.`,
  },
  {
    id: 'project-interactive-product',
    category: 'Projects',
    keywords: ['interactive product', 'product interfaces', 'front-end', 'frontend', 'html', 'css', 'javascript'],
    content: `Interactive Product Interfaces: Polished front-end systems focused on clarity, motion, and a memorable user journey. Built with HTML, CSS, JavaScript.`,
  },
  {
    id: 'project-creative-landing',
    category: 'Projects',
    keywords: ['creative landing', 'landing pages', 'story-driven', 'animation', 'interaction', 'storytelling', 'brand'],
    content: `Creative Landing Pages: Story-driven digital experiences built for presentation, brand presence, and strong first impressions. Focus on Animation, Interaction, Storytelling.`,
  },
  {
    id: 'project-ai-employee',
    category: 'Projects',
    keywords: ['ai employee', 'digital employee', 'openclaw', 'whatsapp', 'discord', 'remote', 'task delegation', 'autonomous', '24/7', 'mobile', 'employee', 'digital worker', 'agent'],
    content: `24/7 Autonomous AI Digital Employee: An agentic AI system powered by OpenClaw, connected to WhatsApp and Discord for remote task delegation. Allows delegating tasks from mobile phone while travelling. Features: Work from anywhere, 24/7 digital employee, natural language interaction, autonomous task execution, mobile-first control via WhatsApp/Discord, task completion feedback. Tech: OpenClaw, Agentic AI, Autonomous AI Agents, WhatsApp Integration, Discord Integration, AI Model Integration, Task Automation, Remote AI Interaction, Tool-Based AI Workflows.`,
  },
  {
    id: 'contact',
    category: 'Contact',
    keywords: ['contact', 'whatsapp', 'linkedin', 'github', 'facebook', 'youtube', 'hire', 'freelance', 'collaborate', 'email', 'reach'],
    content: `Contact Information: Available for freelance work, creative collaborations, and ambitious digital ideas. Primary: WhatsApp (https://wa.me/923222820804). Secondary: LinkedIn (https://www.linkedin.com/in/salahuddin-muhammad). Also on GitHub (https://github.com/salahnewgthub), Facebook (https://www.facebook.com/salahuddin.muhammad.391), YouTube (https://www.youtube.com/@MrSalah3).`,
  },
];

// Simple keyword-based scoring
function scoreRelevance(query, item) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  // Common stopwords that shouldn't trigger matches
  const stopwords = new Set(['what', 'how', 'why', 'when', 'where', 'who', 'which', 'about', 'your', 'you', 'the', 'are', 'can', 'do', 'does', 'is', 'tell', 'me', 'have', 'has', 'built', 'today']);
  const meaningfulWords = queryWords.filter(w => !stopwords.has(w));

  let score = 0;

  // Check keywords (high priority)
  for (const keyword of item.keywords) {
    if (queryLower.includes(keyword.toLowerCase())) {
      score += keyword.length > 5 ? 4 : 2; // Longer keywords = more specific = higher score
    }
  }

  // Check content for meaningful query words only
  const contentLower = item.content.toLowerCase();
  for (const word of meaningfulWords) {
    if (contentLower.includes(word)) {
      score += 1;
    }
  }

  // Boost for category match with meaningful words
  const categoryLower = item.category.toLowerCase();
  for (const word of meaningfulWords) {
    if (categoryLower.includes(word)) {
      score += 3;
    }
  }

  return score;
}

// Retrieve relevant chunks using keyword matching
function retrieveRelevantChunks(query, topK = 4) {
  const scored = KNOWLEDGE_BASE.map((item) => ({
    ...item,
    score: scoreRelevance(query, item),
  }));

  scored.sort((a, b) => b.score - a.score);

  const filtered = scored.slice(0, topK).filter(item => item.score > 0);

  // If no good matches, return empty to trigger fallback response
  if (filtered.length === 0) {
    return [];
  }

  return filtered;
}

// Generate response without external API - uses template-based responses
async function* generateResponse(query, relevantChunks) {
  // Simulate streaming by yielding chunks
  const context = relevantChunks.map((c) => `[${c.category}] ${c.content}`).join('\n\n');

  // Build a natural response from the retrieved chunks
  let response = '';

  if (relevantChunks.length === 0) {
    response = "I don't have specific information about that. I can help you learn about Salahuddin's:\n\n• Projects (3D Portfolio, AI Employee, etc.)\n• Skills (Agentic AI, Automation, RAG Chatbots)\n• Background & experience\n• Contact information (WhatsApp, LinkedIn)\n\nWhat would you like to know more about?";
  } else {
    // Extract key information from chunks
    const categories = [...new Set(relevantChunks.map(c => c.category))];
    const contents = relevantChunks.map(c => c.content);

    // Build contextual response
    const queryLower = query.toLowerCase();

    // Check for specific project keywords first (high priority)
    if (queryLower.includes('ai employee') || queryLower.includes('digital employee') || queryLower.includes('openclaw')) {
      if (categories.includes('Projects')) {
        response = `Here are the relevant projects:\n\n${contents.join('\n\n')}`;
      }
    } else if (categories.includes('About') && (queryLower.includes('who') || (queryLower.includes('about') && !queryLower.includes('project')) || queryLower.includes('experience') || queryLower.includes('background') || queryLower.includes('bio'))) {
      response = contents.find(c => c.includes('Salahuddin Muhammad')) || contents[0];
    } else if (categories.includes('Projects') && (queryLower.includes('project') || queryLower.includes('built') || queryLower.includes('portfolio'))) {
      response = `Here are the relevant projects:\n\n${contents.join('\n\n')}`;
    } else if (categories.includes('Skills') && (queryLower.includes('skill') || queryLower.includes('what') || queryLower.includes('do') || queryLower.includes('expertise'))) {
      response = `Salahuddin's skills include:\n\n${contents.join('\n\n')}`;
    } else if (categories.includes('Contact') && (queryLower.includes('contact') || queryLower.includes('hire') || queryLower.includes('reach') || queryLower.includes('whatsapp') || queryLower.includes('linkedin'))) {
      response = contents[0];
    } else if (categories.includes('Projects')) {
      response = `Here are the relevant projects:\n\n${contents.join('\n\n')}`;
    } else if (categories.includes('Skills')) {
      response = `Salahuddin's skills include:\n\n${contents.join('\n\n')}`;
    } else if (categories.includes('Contact')) {
      response = contents[0];
    } else {
      // General case - combine top chunks
      response = contents.slice(0, 2).join('\n\n');
    }
  }

  // Simulate streaming by yielding word by word
  const words = response.split(' ');
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
    yield { content: chunk };
    // Small delay to simulate streaming
    await new Promise(r => setTimeout(r, 30));
  }

  yield { done: true };
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

    // Retrieve relevant knowledge using keyword matching
    const relevantChunks = retrieveRelevantChunks(message);

    // Generate streaming response
    const stream = generateResponse(message, relevantChunks);

    // Set up Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of stream) {
      if (chunk.content) {
        res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
      }
      if (chunk.done) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}