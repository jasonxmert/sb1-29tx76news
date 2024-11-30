import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsArticle, NewsCategory, TrendingTopic } from '../types/news';
import { generateMockArticles } from '../utils/mockData';

// RSS feed proxy URLs (using RSS2JSON API as a fallback)
const RSS_FEEDS = {
  World: [
    'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Frss.xml',
    'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frss.nytimes.com%2Fservices%2Fxml%2Frss%2Fnyt%2FWorld.xml'
  ],
  Technology: [
    'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2FTechCrunch',
    'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.wired.com%2Ffeed%2Frss'
  ],
  Business: [
    'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bloomberg.com%2Fmarkets%2Fnews.rss'
  ]
};

async function fetchRSSFeed(feedUrl: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get(feedUrl);
    const feed = response.data;

    if (!feed?.items) {
      console.warn('Invalid feed data:', feed);
      return [];
    }

    return feed.items.map((item: any) => ({
      url: item.link || '',
      title: item.title || '',
      source: feed.feed?.title || 'Unknown Source',
      publishedAt: item.pubDate || new Date().toISOString(),
      tone: 0,
      category: 'World', // Will be overridden by the calling function
      location: undefined
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}

export async function fetchNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  try {
    const feeds = RSS_FEEDS[category] || [];
    
    if (feeds.length === 0) {
      console.log(`No RSS feeds configured for ${category}, using fallback data`);
      return generateMockArticles(20, category);
    }

    const articles = await Promise.all(feeds.map(feed => fetchRSSFeed(feed)));
    
    const flattenedArticles = articles
      .flat()
      .map(article => ({
        ...article,
        category
      }))
      .filter(article => article.title && article.url)
      .slice(0, 20);

    if (flattenedArticles.length === 0) {
      console.log(`No articles found for ${category}, using fallback data`);
      return generateMockArticles(20, category);
    }

    return flattenedArticles;
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error);
    return generateMockArticles(20, category);
  }
}

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    const categories = Object.keys(RSS_FEEDS) as NewsCategory[];
    const allArticles = await Promise.all(
      categories.map(category => fetchNewsByCategory(category))
    );

    const topics = allArticles
      .flat()
      .map(article => ({
        name: article.title,
        count: Math.floor(Math.random() * 200) + 50,
        sentiment: (Math.random() * 2 - 1),
        category: article.category
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return topics;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [
      { name: 'Global Economic Updates', count: 245, sentiment: 0.3, category: 'Business' },
      { name: 'Technology Innovation', count: 189, sentiment: 0.8, category: 'Technology' },
      { name: 'World News', count: 167, sentiment: -0.4, category: 'World' }
    ];
  }
}