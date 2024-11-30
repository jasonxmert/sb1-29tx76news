import axios from 'axios';
import { NewsArticle, NewsCategory } from '../types/news';
import { generateMockArticles } from '../utils/mockData';

const GDELT_API_BASE = 'https://api.gdeltproject.org/api/v2';
const NEWS_API = `${GDELT_API_BASE}/api/v2/doc/doc`;
const TIMESPAN = '15min';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function mapCategoryToGdeltQuery(category: NewsCategory): string {
  const queryMap: Record<NewsCategory, string> = {
    World: 'sourcecountry:US AND sourcelang:eng',
    Politics: 'theme:POLITICS AND sourcelang:eng',
    Business: 'theme:BUSINESS AND sourcelang:eng',
    Technology: 'theme:TECH AND sourcelang:eng',
    Science: 'theme:SCIENCE AND sourcelang:eng',
    Health: 'theme:HEALTH AND sourcelang:eng',
    Sports: 'theme:SPORTS AND sourcelang:eng',
    Entertainment: 'theme:ENTERTAINMENT AND sourcelang:eng',
    Property: 'theme:REAL_ESTATE AND sourcelang:eng',
    Finance: 'theme:FINANCIAL AND sourcelang:eng',
    Insurance: '(insurance OR insurer) AND sourcelang:eng',
    AI: '(artificial intelligence OR AI) AND sourcelang:eng',
    Environment: 'theme:ENV AND sourcelang:eng',
    Education: 'theme:EDUCATION AND sourcelang:eng',
    Automotive: '(automotive OR cars) AND sourcelang:eng'
  };

  return queryMap[category];
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GDELTNewsAggregator/1.0'
      },
      timeout: 15000
    });

    if (!response.data) {
      throw new Error('Empty response from API');
    }

    return response.data;
  } catch (error) {
    if (retries > 0) {
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function fetchNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  try {
    const query = mapCategoryToGdeltQuery(category);
    const url = `${NEWS_API}?format=json&maxrecords=20&timespan=${TIMESPAN}&query=${encodeURIComponent(query)}&mode=artlist&sort=DateDesc&trans=googtrans`;

    console.log('Fetching news from:', url);

    const data = await fetchWithRetry(url);

    if (!data?.articles?.length) {
      console.warn('No articles found from GDELT API, using fallback data');
      return generateMockArticles(20, category);
    }

    return data.articles
      .filter((article: any) => {
        if (!article.url || !article.title || !article.seendate) {
          console.warn('Filtering out invalid article:', article);
          return false;
        }
        try {
          new URL(article.url);
          return true;
        } catch {
          console.warn('Invalid URL in article:', article.url);
          return false;
        }
      })
      .map((article: any) => ({
        url: article.url,
        title: article.title,
        source: article.sourcename || article.domain || 'Unknown Source',
        category,
        publishedAt: article.seendate,
        tone: article.tone ? parseFloat(article.tone) : 0,
        location: article.locations?.[0] ? {
          country: article.locations[0].countryname || 'Unknown Location',
          lat: parseFloat(article.locations[0].lat) || 0,
          lng: parseFloat(article.locations[0].lon) || 0
        } : undefined
      }));
  } catch (error) {
    console.error('Error fetching news:', error);
    console.warn('Using fallback data due to API error');
    return generateMockArticles(20, category);
  }
}

export async function fetchTrendingTopics(): Promise<string[]> {
  try {
    const url = `${NEWS_API}?format=json&maxrecords=10&timespan=4h&query=sourcelang:eng&mode=artlist&sort=NumArticles&trans=googtrans`;
    
    console.log('Fetching trending topics from:', url);

    const data = await fetchWithRetry(url);

    if (!data?.articles?.length) {
      throw new Error('No trending topics found');
    }

    return data.articles
      .filter((article: any) => article.title && article.title.length > 10)
      .map((article: any) => article.title)
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    // Return some default trending topics as fallback
    return [
      'Global Economic Updates',
      'Technology Innovation News',
      'Climate Change Developments',
      'Healthcare Breakthroughs',
      'International Relations'
    ];
  }
}