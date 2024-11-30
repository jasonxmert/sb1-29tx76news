import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NewsArticle } from '../types/news';

export function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article as NewsArticle;

  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      const url = new URL(article.url);
      window.open(url.href, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Invalid URL:', article.url);
      alert('Sorry, this article link appears to be invalid.');
    }
  };

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Article not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Return to home
        </button>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const sentimentColor = article.tone > 0 ? 'text-green-600' : article.tone < 0 ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to news
      </button>

      <article className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">{article.source}</span>
              <span className="mx-2">•</span>
              <span>{timeAgo}</span>
            </div>
            <button
              onClick={handleExternalClick}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              Read original article
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {article.location && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <p className="text-gray-700">{article.location.country}</p>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Sentiment Analysis</h2>
          <p className={`${sentimentColor}`}>
            This article has a {article.tone > 0 ? 'positive' : article.tone < 0 ? 'negative' : 'neutral'} tone
          </p>
        </div>
      </article>
    </div>
  );
}