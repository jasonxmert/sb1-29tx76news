import { useNews } from '../hooks/useNews';
import { Flame } from 'lucide-react';
import { ArticleLink } from './ArticleLink';

export function MostRead() {
  const { articles, isLoading } = useNews();

  if (isLoading || !articles) {
    return null;
  }

  const topArticles = articles.slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-accent-50 to-accent-100 py-4 border-b border-accent-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-accent-600 mb-4">
          <Flame className="w-5 h-5 mr-2" />
          <h2 className="font-semibold">Most Read</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topArticles.map((article, index) => (
            <div key={article.url} className="flex items-start group">
              <span className="text-3xl font-bold text-accent-300 mr-4 group-hover:text-accent-400 transition-colors">
                {index + 1}
              </span>
              <div className="text-sm">
                <ArticleLink article={article} />
                <p className="text-accent-600 mt-1 text-xs">{article.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}