export interface NewsArticle {
  url: string;
  title: string;
  source: string;
  publishedAt: string;
  tone: number;
  category: string;
  location?: {
    country: string;
    lat: number;
    lng: number;
  };
}

export interface TrendingTopic {
  name: string;
  count: number;
  sentiment: number;
  category: string;
}

export interface TopArticle {
  title: string;
  url: string;
  readCount: number;
  category: string;
}

export type NewsCategory = 
  | 'World'
  | 'Politics'
  | 'Business'
  | 'Technology'
  | 'Science'
  | 'Health'
  | 'Sports'
  | 'Entertainment'
  | 'Property'
  | 'Finance'
  | 'Insurance'
  | 'AI'
  | 'Environment'
  | 'Education'
  | 'Automotive';