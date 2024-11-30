import { useState } from 'react';
import { useNewsByCategory } from '../hooks/useNews';
import { NewsCard } from './NewsCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { NewsCategory } from '../types/news';

const categories: NewsCategory[] = [
  'World',
  'Politics',
  'Business',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'Property',
  'Finance',
  'Insurance',
  'AI',
  'Environment',
  'Education',
  'Automotive'
];

export function NewsList() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('World');
  const { articles, isLoading, isError } = useNewsByCategory(selectedCategory);

  return (
    <div>
      <div className="mb-8 overflow-x-auto scrollbar-hide bg-white rounded-lg shadow-soft p-4">
        <div className="flex space-x-3 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-button ${
                selectedCategory === category
                  ? 'category-button-active'
                  : 'category-button-inactive'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isError && (
        <div className="text-center py-8">
          <div className="bg-red-50 text-red-600 p-6 rounded-lg inline-block shadow-soft">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium text-lg">Unable to load news articles</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {articles.map((article) => (
            <NewsCard key={article.url} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-12 bg-white rounded-lg shadow-soft">
          <p className="text-lg">No news articles available for {selectedCategory}</p>
          <p className="text-sm mt-2">Please try another category or check back later</p>
        </div>
      )}
    </div>
  );
}