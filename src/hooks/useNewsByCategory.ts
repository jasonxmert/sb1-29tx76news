import useSWR from 'swr';
import { NewsArticle, NewsCategory } from '../types/news';
import { fetchNewsByCategory } from '../services/newsScraper';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useNewsByCategory(category: NewsCategory) {
  const { data: articles, error, isLoading } = useSWR<NewsArticle[]>(
    ['news', category],
    () => fetchNewsByCategory(category),
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      dedupingInterval: 60000,
      keepPreviousData: true,
    }
  );

  return {
    articles,
    isLoading: isLoading && !articles,
    isError: error
  };
}