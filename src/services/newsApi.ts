import axios from 'axios';
import { NewsArticle, NewsCategory } from '../types/news';

const API_KEY = '982fbb4fc4fe405ab45bf23407e1ae2b';
const BASE_URL = 'https://newsapi.org/v2';

const categoryMapping: Record<NewsCategory, string> = {
  World: 'general',
  Politics: 'general',
  Business: 'business',
  Technology: 'technology',
  Science: 'science',
  Health: 'health',
  Sports: 'sports',
  Entertainment: 'entertainment',
  Property: 'business',
  Finance: 'business',
  Insurance: 'business',
  AI: 'technology',
  Environment: 'science',
  Education: 'general',
  Automotive: 'business'
};

export async function fetchNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  try {
    const apiUrl = `${BASE_URL}/everything`;
    const response = await axios.get(apiUrl, {
      params: {
        q: category.toLowerCase(),
        apiKey: API_KEY,
        language: 'en',
        pageSize: 20,
        sortBy: 'publishedAt'
      },
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': API_KEY
      }
    });

    if (!response.data?.articles?.length) {
      throw new Error(`No articles found for category: ${category}`);
    }

    return response.data.articles
      .filter((article: any) => {
        return article.url && article.title && article.publishedAt && article.source?.name;
      })
      .map((article: any) => ({
        url: article.url,
        title: article.title,
        source: article.source.name,
        category,
        publishedAt: article.publishedAt,
        tone: 0,
        location: undefined
      }));
  } catch (error: any) {
    console.error(`Error fetching news for category ${category}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function fetchTrendingTopics(): Promise<string[]> {
  try {
    const apiUrl = `${BASE_URL}/top-headlines`;
    const response = await axios.get(apiUrl, {
      params: {
        country: 'us',
        apiKey: API_KEY,
        language: 'en',
        pageSize: 10
      },
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': API_KEY
      }
    });

    if (!response.data?.articles?.length) {
      throw new Error('No trending topics found');
    }

    return response.data.articles
      .map((article: any) => article.title)
      .filter(Boolean)
      .slice(0, 10);
  } catch (error: any) {
    console.error('Error fetching trending topics:', error.response?.data || error.message);
    throw error;
  }
}