import { NewsArticle, NewsCategory, TrendingTopic } from '../types/news';
import { scrapeNewsByCategory, scrapeTrendingTopics } from './scraper';

// Cache for storing news articles and trending topics
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(key: string): boolean {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

export async function getNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  const cacheKey = `news-${category}`;
  
  if (isCacheValid(cacheKey)) {
    return cache.get(cacheKey)!.data;
  }

  try {
    const articles = await scrapeNewsByCategory(category);
    cache.set(cacheKey, { data: articles, timestamp: Date.now() });
    return articles;
  } catch (error) {
    console.error(`Error fetching news for ${category}:`, error);
    throw error;
  }
}

export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  const cacheKey = 'trending-topics';
  
  if (isCacheValid(cacheKey)) {
    return cache.get(cacheKey)!.data;
  }

  try {
    const topics = await scrapeTrendingTopics();
    cache.set(cacheKey, { data: topics, timestamp: Date.now() });
    return topics;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    throw error;
  }
}