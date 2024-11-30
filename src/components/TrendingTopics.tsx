import { TrendingTopic } from '../types/news';
import { TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTrendingTopics } from '../hooks/useTrendingTopics';
import { useRef, useState } from 'react';

export function TrendingTopics() {
  const { topics, isLoading } = useTrendingTopics();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  if (isLoading || !topics) {
    return null;
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-900 py-3 border-b border-primary-700 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-2">
          <TrendingUp className="w-4 h-4 text-primary-200 animate-pulse" />
          <h2 className="ml-2 text-sm font-medium text-white">Trending Now</h2>
        </div>

        <div className="relative">
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-primary-900 to-transparent pl-1 pr-3 py-4 text-white hover:text-primary-200 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-primary-900 to-transparent pr-1 pl-3 py-4 text-white hover:text-primary-200 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth py-1"
          >
            {topics.map((topic, index) => (
              <TopicCard key={topic.name} topic={topic} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic, index }: { topic: TrendingTopic; index: number }) {
  const sentimentColor = topic.sentiment > 0 
    ? 'bg-green-500/10 text-green-300 border-green-500/20'
    : topic.sentiment < 0
    ? 'bg-red-500/10 text-red-300 border-red-500/20'
    : 'bg-gray-500/10 text-gray-300 border-gray-500/20';

  const animationDelay = `${index * 100}ms`;

  return (
    <button
      style={{ animationDelay }}
      className={`
        flex-none animate-fade-in cursor-pointer
        rounded-lg border backdrop-blur-sm
        p-2 min-w-[200px] max-w-[200px]
        hover:scale-105 transition-transform duration-300
        ${sentimentColor}
      `}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/10">
          #{index + 1}
        </span>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/10">
          {topic.category}
        </span>
      </div>
      
      <h3 className="text-sm font-medium text-white leading-tight mb-1 text-left">
        {topic.name}
      </h3>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70">
          {topic.count.toLocaleString()}
        </span>
        <span className={`
          px-1.5 py-0.5 rounded-full text-xs
          ${topic.sentiment > 0 ? 'bg-green-500/20' : topic.sentiment < 0 ? 'bg-red-500/20' : 'bg-gray-500/20'}
        `}>
          {topic.sentiment > 0 ? '😊' : topic.sentiment < 0 ? '😟' : '😐'}
        </span>
      </div>
    </button>
  );
}