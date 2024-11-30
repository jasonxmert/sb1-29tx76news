import useSWR from 'swr';
import { TrendingTopic } from '../types/news';
import { fetchTrendingTopics } from '../services/newsScraper';

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function useTrendingTopics() {
  const { data: topics, error, isLoading } = useSWR<TrendingTopic[]>(
    'trending-topics',
    fetchTrendingTopics,
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
    topics,
    isLoading: isLoading && !topics,
    isError: error
  };
}