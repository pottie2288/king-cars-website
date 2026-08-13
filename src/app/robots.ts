import type { MetadataRoute } from 'next';

/**
 * Crawler policy.
 *
 * A wildcard rule already allowed everything, but AI assistants are now a real
 * discovery channel for car buyers, so the policy names them deliberately
 * rather than leaving it to a default. Two categories, allowed for different
 * reasons:
 *
 *   - Retrieval agents fetch pages to answer a question being asked right now,
 *     and cite what they use. These are what put King Cars into an answer.
 *   - Training agents build the corpora models learn from. Allowing them is how
 *     a model comes to know King Cars exists without having to search first.
 *
 * Both are allowed. A local dealership has nothing on its site worth
 * withholding, and publishers who blocked AI crawlers wholesale measured a ~23%
 * traffic decline without any drop in how often they were cited — the block
 * cost them readers and bought nothing.
 *
 * The exclusions below apply to every crawler: /api/ serves JSON with no reader
 * value, and /favourites renders a visitor's own saved cars from their browser
 * storage, so it is per-person and meaningless to index.
 */

/** Fetch pages live to answer a user's question, and cite sources. */
const AI_RETRIEVAL_AGENTS = [
  'OAI-SearchBot',    // ChatGPT search index
  'ChatGPT-User',     // ChatGPT fetching a page for a user
  'Claude-SearchBot', // Claude search index
  'Claude-User',      // Claude fetching a page for a user
  'PerplexityBot',    // Perplexity search index
  'Perplexity-User',  // Perplexity fetching a page for a user
];

/** Crawl for model training and AI-answer grounding. */
const AI_TRAINING_AGENTS = [
  'GPTBot',             // OpenAI
  'ClaudeBot',          // Anthropic
  'Google-Extended',    // Gemini and AI Overviews grounding
  'Applebot-Extended',  // Apple Intelligence
  'meta-externalagent', // Meta AI
  'CCBot',              // Common Crawl, a source for many models
];

const DISALLOWED = ['/api/', '/favourites'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED,
      },
      {
        userAgent: AI_RETRIEVAL_AGENTS,
        allow: '/',
        disallow: DISALLOWED,
      },
      {
        userAgent: AI_TRAINING_AGENTS,
        allow: '/',
        disallow: DISALLOWED,
      },
    ],
    sitemap: 'https://www.kingcars.co.za/sitemap.xml',
  };
}
