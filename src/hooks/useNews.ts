import { useNewsByCategory } from './useNewsByCategory';
import { useTrendingTopics } from './useTrendingTopics';

export { useNewsByCategory, useTrendingTopics };

// Main hook for general news functionality
export function useNews() {
  const { articles } = useNewsByCategory('World');
  const { topics } = useTrendingTopics();

  return {
    articles,
    topics
  };
}