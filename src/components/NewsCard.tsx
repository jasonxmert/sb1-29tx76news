import { formatDistanceToNow } from 'date-fns';
import { Globe } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { ArticleLink } from './ArticleLink';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const sentimentColor = article.tone > 0 
    ? 'bg-green-50 text-green-700 border-green-200' 
    : article.tone < 0 
    ? 'bg-red-50 text-red-700 border-red-200' 
    : 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <article className="bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="mb-4">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 mb-3">
            {article.category}
          </div>
          <h2 className="text-xl font-serif font-bold text-gray-900 leading-tight hover:text-primary-600 transition-colors">
            <ArticleLink article={article} />
          </h2>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2">
          <span className="font-medium text-gray-700">{article.source}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">{timeAgo}</span>
        </div>
        
        {article.location && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Globe className="w-4 h-4 mr-2 text-primary-500" />
            <span>{article.location.country}</span>
          </div>
        )}
        
        <div className={`text-sm px-3 py-1.5 rounded-full inline-flex items-center border ${sentimentColor}`}>
          {article.tone > 0 ? '😊 Positive' : article.tone < 0 ? '😟 Negative' : '😐 Neutral'}
        </div>
      </div>
    </article>
  );
}