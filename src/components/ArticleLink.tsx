import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../types/news';

interface ArticleLinkProps {
  article: NewsArticle;
}

export function ArticleLink({ article }: ArticleLinkProps) {
  const slug = encodeURIComponent(article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      // Validate URL before opening
      const url = new URL(article.url);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
      window.open(url.href, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Invalid URL:', article.url);
      alert('This article link is currently unavailable. Please try another article.');
    }
  };

  return (
    <div className="group relative inline-block">
      <Link
        to={`/article/${slug}`}
        state={{ article }}
        className="hover:text-blue-600 transition-colors"
      >
        {article.title}
      </Link>
      <button
        onClick={handleExternalClick}
        className="inline-flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-600"
        title="Open original article"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
}