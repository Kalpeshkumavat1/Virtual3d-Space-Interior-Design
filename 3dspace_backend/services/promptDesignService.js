const OpenAI = require('openai');

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('⚠️  OPENAI_API_KEY not set. Falling back to mock prompt-to-design responses.');
}

const baseResponseShape = () => ({
  summary: '',
  layoutPlan: {
    zones: [],
    circulation: [],
    lighting: [],
    notes: [],
  },
  furniturePlan: [],
  colorPalettes: [],
  lightingPlan: [],
  renderPrompts: [],
  actionSteps: [],
  estimatedBudget: {
    currency: 'USD',
    total: 0,
    breakdown: [],
  },
  sources: [],
});

function sanitizeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildConstraintSummary(constraints = {}) {
  const segments = [];

  if (constraints.roomType) {
    segments.push(`Room type: ${constraints.roomType}`);
  }

  if (constraints.style) {
    segments.push(`Preferred style: ${constraints.style}`);
  }

  if (constraints.dimensions) {
    const { width, depth, height } = constraints.dimensions;
    segments.push(
      `Dimensions (m): ${width || '?'}W x ${depth || '?'}D x ${height || '?'}H`,
    );
  }

  if (constraints.budget) {
    segments.push(`Budget: ${constraints.budget} ${constraints.currency || 'USD'}`);
  }

  if (constraints.occupants) {
    segments.push(`Occupants: ${constraints.occupants}`);
  }

  if (constraints.mustHave?.length) {
    segments.push(`Must include: ${constraints.mustHave.join(', ')}`);
  }

  if (constraints.feel) {
    segments.push(`Desired mood: ${constraints.feel}`);
  }

  return segments.join('\n');
}

function normalizeAiPayload(payload = {}) {
  const base = baseResponseShape();

  return {
    ...base,
    ...payload,
    layoutPlan: {
      ...base.layoutPlan,
      ...(payload.layoutPlan || {}),
    },
    estimatedBudget: {
      ...base.estimatedBudget,
      ...(payload.estimatedBudget || {}),
    },
    furniturePlan: Array.isArray(payload.furniturePlan) ? payload.furniturePlan : [],
    colorPalettes: Array.isArray(payload.colorPalettes) ? payload.colorPalettes : [],
    lightingPlan: Array.isArray(payload.lightingPlan) ? payload.lightingPlan : [],
    renderPrompts: Array.isArray(payload.renderPrompts) ? payload.renderPrompts : [],
    actionSteps: Array.isArray(payload.actionSteps) ? payload.actionSteps : [],
    sources: Array.isArray(payload.sources) ? payload.sources : [],
  };
}

function buildMockResponse({ prompt, constraints }) {
  const constraintSummary = buildConstraintSummary(constraints);
  return normalizeAiPayload({
    summary: `Concept inspired by your prompt: "${prompt.slice(0, 120)}..."`,
    layoutPlan: {
      zones: [
        { name: 'Conversation Zone', details: 'Anchor with feature seating and warm accent lighting' },
        { name: 'Workspace Nook', details: 'Compact desk with task lighting near natural light source' },
      ],
      circulation: [
        'Maintain 1m clearance between major furniture pieces',
        'Keep pathways parallel to focal wall for clean sightlines',
      ],
      lighting: [
        'Layered approach: ambient (track or recessed), task (floor/desk lamps), accent (wall washers)',
      ],
      notes: constraintSummary ? [constraintSummary] : [],
    },
    furniturePlan: [
      {
        category: 'Seating',
        suggestions: [
          {
            name: 'Low-profile sofa',
            placement: 'Centered on feature wall, 30cm off the wall to avoid cramped feel',
            approxCost: 1400,
            color: 'Muted neutral',
          },
          {
            name: 'Sculptural accent chair',
            placement: 'Angles toward sofa to complete conversation triangle',
            approxCost: 650,
            color: 'Bold accent hue pulled from palette',
          },
        ],
      },
      {
        category: 'Surfaces & Storage',
        suggestions: [
          {
            name: 'Mixed-material coffee table',
            placement: 'Align with sofa center, leave 45cm clearance',
            approxCost: 450,
          },
          {
            name: 'Floating media console',
            placement: 'Opposite sofa, keeps floor space airy',
            approxCost: 520,
          },
        ],
      },
    ],
    colorPalettes: [
      {
        name: 'Fresh Contrast',
        description: 'Grounding earth tones with energetic accents',
        colors: [
          { hex: '#2F2F2F', usage: 'Anchor furniture' },
          { hex: '#F5F1E7', usage: 'Walls & large surfaces' },
          { hex: '#AE7E5D', usage: 'Textiles & accents' },
          { hex: '#3A7DCE', usage: 'Statement pieces' },
        ],
      },
    ],
    lightingPlan: [
      { layer: 'Ambient', fixtures: ['Slim LED track', 'Cove lighting'], notes: 'Dimmable to shift moods quickly' },
      { layer: 'Task', fixtures: ['Adjustable arm floor lamp', 'Linear desk light'], notes: '3000-3500K for focus' },
    ],
    renderPrompts: [
      'Wide angle interior render, natural daylight, camera height 1.4m, focal length 24mm, cinematic contrast',
    ],
    actionSteps: [
      'Rough-sketch zoning on floor plan to confirm circulation',
      'Prioritize large anchor pieces within budget, then layer accent items',
      'Test palette samples at different times of day for color accuracy',
      'Use warm dimmable bulbs to maintain cozy ambiance in evenings',
    ],
    estimatedBudget: {
      currency: constraints?.currency || 'USD',
      total: constraints?.budget || 4200,
      breakdown: [
        { category: 'Seating', amount: 2050 },
        { category: 'Tables & Storage', amount: 970 },
        { category: 'Lighting', amount: 600 },
        { category: 'Accessories', amount: 580 },
      ],
    },
    sources: [
      'Generated via mock planner because OPENAI_API_KEY is missing',
    ],
  });
}

function buildUserMessage(prompt, constraints) {
  const constraintSummary = buildConstraintSummary(constraints);
  return [
    constraintSummary && `Constraints:\n${constraintSummary}`,
    `User prompt:\n${prompt}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

async function generateDesignFromPrompt({ prompt, constraints = {}, userContext = {} }) {
  if (!openaiClient) {
    return {
      usingFallback: true,
      ...buildMockResponse({ prompt, constraints }),
    };
  }

  const messages = [
    {
      role: 'system',
      content: [
        'You are an award-winning interior designer who produces detailed, structured plans.',
        'Return JSON with summary, layoutPlan (zones, circulation, lighting, notes), furniturePlan, colorPalettes, lightingPlan, renderPrompts, actionSteps, estimatedBudget, sources.',
        'Keep recommendations feasible for real-world implementation and cite assumptions when relevant.',
      ].join(' '),
    },
    {
      role: 'system',
      content: `User subscription tier: ${userContext.subscription || 'unknown'}.`,
    },
    {
      role: 'user',
      content: buildUserMessage(prompt, constraints),
    },
  ];

  try {
    const response = await openaiClient.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty OpenAI response');
    }

    const parsed = JSON.parse(content);
    const normalized = normalizeAiPayload(parsed);
    normalized.sources = normalized.sources?.length
      ? normalized.sources
      : ['Generated via OpenAI prompt-to-design pipeline'];

    normalized.estimatedBudget.total = sanitizeNumber(normalized.estimatedBudget.total) || constraints.budget || 0;
    normalized.estimatedBudget.currency = normalized.estimatedBudget.currency || constraints.currency || 'USD';

    return {
      usingFallback: false,
      ...normalized,
    };
  } catch (error) {
    console.error('Prompt design AI error:', error);
    return {
      usingFallback: true,
      ...buildMockResponse({ prompt, constraints }),
    };
  }
}

module.exports = {
  generateDesignFromPrompt,
};



