import { NewsArticle, NewsCategory, TrendingTopic } from '../types/news';
import { generateMockArticles } from '../utils/mockData';

export async function fetchNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockArticles(20, category);
}

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { name: 'Global Economic Summit', count: 245, sentiment: 0.3, category: 'Business' },
    { name: 'AI Breakthrough', count: 189, sentiment: 0.8, category: 'Technology' },
    { name: 'Climate Change Report', count: 167, sentiment: -0.4, category: 'Environment' },
    { name: 'Healthcare Innovation', count: 156, sentiment: 0.6, category: 'Health' },
    { name: 'Space Exploration', count: 134, sentiment: 0.7, category: 'Science' },
    { name: 'Market Analysis', count: 123, sentiment: 0.1, category: 'Finance' },
    { name: 'Sports Championship', count: 112, sentiment: 0.5, category: 'Sports' },
    { name: 'Education Reform', count: 98, sentiment: 0.2, category: 'Education' },
    { name: 'Entertainment Awards', count: 87, sentiment: 0.4, category: 'Entertainment' },
    { name: 'Political Summit', count: 76, sentiment: -0.2, category: 'Politics' }
  ];
}