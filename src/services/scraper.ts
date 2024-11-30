import axios from 'axios';
import * as cheerio from 'cheerio';
import { subHours } from 'date-fns';
import NodeCache from 'node-cache';
import schedule from 'node-schedule';
import { NewsArticle, NewsCategory, TrendingTopic } from '../types/news';

// Cache with 1-hour TTL
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour in seconds
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false
});

const NEWS_SOURCES = {
  'Reuters': {
    url: 'https://www.reuters.com',
    selectors: {
      articles: 'article[data-testid="story"]',
      title: '.story-content__headline__text',
      link: 'a.story-content__link',
      time: 'time'
    }
  },
  'BBC News': {
    url: 'https://www.bbc.com/news',
    selectors: {
      articles: 'article',
      title: 'h3',
      link: 'a',
      time: 'time'
    }
  },
  'The Guardian': {
    url: 'https://www.theguardian.com/international',
    selectors: {
      articles: '.fc-item--standard',
      title: '.fc-item__title',
      link: '.fc-item__link',
      time: 'time'
    }
  },
  'Bloomberg': {
    url: 'https://www.bloomberg.com',
    selectors: {
      articles: 'article[data-type="article"]',
      title: 'h3',
      link: 'a',
      time: 'time'
    }
  },
  'Financial Times': {
    url: 'https://www.ft.com',
    selectors: {
      articles: '.o-teaser',
      title: '.o-teaser__heading',
      link: '.o-teaser__heading-link',
      time: 'time'
    }
  }
};

// Rotate User-Agent strings to avoid detection
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
];

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
let lastRequestTime = Date.now();

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

async function scrapeNewsSource(source: string, config: any): Promise<NewsArticle[]> {
  try {
    await rateLimit();
    
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const response = await axios.get(config.url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const articles: NewsArticle[] = [];
    const cutoffTime = subHours(new Date(), 12);
    const seenUrls = new Set<string>();

    $(config.selectors.articles).each((_, element) => {
      try {
        const $element = $(element);
        const $title = $element.find(config.selectors.title);
        const $link = $element.find(config.selectors.link).first();
        const $time = $element.find(config.selectors.time);

        const title = $title.text().trim();
        const relativeUrl = $link.attr('href');
        if (!relativeUrl || !title) return;

        const url = relativeUrl.startsWith('http') ? relativeUrl : new URL(relativeUrl, config.url).href;
        
        // Skip duplicate URLs
        if (seenUrls.has(url)) return;
        seenUrls.add(url);

        const publishedAt = $time.attr('datetime') || new Date().toISOString();
        const publishDate = new Date(publishedAt);

        if (publishDate >= cutoffTime) {
          const category = determineCategory(title);
          articles.push({
            title,
            url,
            source,
            publishedAt: publishDate.toISOString(),
            category,
            tone: calculateTone(title)
          });
        }
      } catch (err) {
        console.warn(`Error processing article from ${source}:`, err);
      }
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping ${source}:`, error);
    return [];
  }
}

// Enhanced category detection with weighted keywords
const CATEGORY_KEYWORDS: Record<NewsCategory, Array<[string, number]>> = {
  World: [['international', 2], ['global', 2], ['world', 2], ['foreign', 1]],
  Politics: [['politics', 2], ['election', 2], ['government', 1], ['policy', 1]],
  Business: [['business', 2], ['economy', 2], ['market', 1], ['trade', 1]],
  Technology: [['technology', 2], ['tech', 2], ['digital', 1], ['software', 1]],
  Science: [['science', 2], ['research', 2], ['study', 1], ['discovery', 1]],
  Health: [['health', 2], ['medical', 2], ['healthcare', 1], ['disease', 1]],
  Sports: [['sports', 2], ['game', 1], ['tournament', 1], ['championship', 1]],
  Entertainment: [['entertainment', 2], ['movie', 1], ['music', 1], ['celebrity', 1]],
  Property: [['property', 2], ['real estate', 2], ['housing', 1], ['mortgage', 1]],
  Finance: [['finance', 2], ['banking', 2], ['investment', 1], ['stocks', 1]],
  Insurance: [['insurance', 2], ['coverage', 1], ['policy', 1], ['risk', 1]],
  AI: [['ai', 2], ['artificial intelligence', 2], ['machine learning', 1]],
  Environment: [['environment', 2], ['climate', 2], ['sustainable', 1]],
  Education: [['education', 2], ['school', 1], ['university', 1], ['learning', 1]],
  Automotive: [['automotive', 2], ['car', 1], ['vehicle', 1], ['electric', 1]]
};

function determineCategory(title: string): NewsCategory {
  const titleLower = title.toLowerCase();
  const scores = Object.entries(CATEGORY_KEYWORDS).map(([category, keywords]) => {
    const score = keywords.reduce((total, [keyword, weight]) => {
      return total + (titleLower.includes(keyword) ? weight : 0);
    }, 0);
    return { category: category as NewsCategory, score };
  });

  const highestScore = scores.reduce((max, current) => 
    current.score > max.score ? current : max
  );

  return highestScore.score > 0 ? highestScore.category : 'World';
}

function calculateTone(title: string): number {
  const titleLower = title.toLowerCase();
  let tone = 0;

  const sentimentWords = {
    positive: [
      ['excellent', 0.8], ['breakthrough', 0.7], ['success', 0.6],
      ['innovative', 0.5], ['growth', 0.4], ['improvement', 0.3]
    ],
    negative: [
      ['crisis', -0.8], ['disaster', -0.7], ['failure', -0.6],
      ['decline', -0.5], ['warning', -0.4], ['concern', -0.3]
    ]
  };

  sentimentWords.positive.forEach(([word, weight]) => {
    if (titleLower.includes(word as string)) tone += weight as number;
  });

  sentimentWords.negative.forEach(([word, weight]) => {
    if (titleLower.includes(word as string)) tone += weight as number;
  });

  return Math.max(-1, Math.min(1, tone));
}

async function updateNews() {
  console.log('Starting news update...');
  const startTime = Date.now();
  const allArticles: NewsArticle[] = [];

  for (const [source, config] of Object.entries(NEWS_SOURCES)) {
    try {
      const articles = await scrapeNewsSource(source, config);
      allArticles.push(...articles);
      console.log(`Fetched ${articles.length} articles from ${source}`);
    } catch (error) {
      console.error(`Failed to fetch from ${source}:`, error);
    }
  }

  if (allArticles.length > 0) {
    cache.set('articles', allArticles);
    cache.set('lastUpdate', new Date().toISOString());
    console.log(`Updated ${allArticles.length} articles in ${(Date.now() - startTime) / 1000}s`);
  } else {
    console.warn('No articles fetched in this update');
  }

  return allArticles;
}

// Schedule updates every hour
schedule.scheduleJob('0 * * * *', async () => {
  try {
    await updateNews();
  } catch (error) {
    console.error('Scheduled update failed:', error);
  }
});

// Initial update
updateNews().catch(console.error);

export async function scrapeNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  let articles = cache.get('articles') as NewsArticle[] | undefined;
  
  if (!articles) {
    articles = await updateNews();
  }

  return articles
    .filter(article => article.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20);
}

export async function scrapeTrendingTopics(): Promise<TrendingTopic[]> {
  const articles = cache.get('articles') as NewsArticle[] | undefined;
  
  if (!articles) {
    await updateNews();
    return [];
  }

  const topics = new Map<string, { count: number; category: NewsCategory; sentiment: number }>();
  
  articles.forEach(article => {
    const words = article.title
      .split(' ')
      .filter(word => word.length > 4)
      .map(word => word.toLowerCase());

    const uniqueWords = new Set(words);
    uniqueWords.forEach(word => {
      const existing = topics.get(word) || { 
        count: 0, 
        category: article.category,
        sentiment: 0 
      };
      
      topics.set(word, {
        count: existing.count + 1,
        category: article.category,
        sentiment: (existing.sentiment + article.tone) / 2
      });
    });
  });

  return Array.from(topics.entries())
    .map(([name, { count, category, sentiment }]) => ({
      name,
      count,
      category,
      sentiment
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}