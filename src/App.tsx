import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NewsList } from './components/NewsList';
import { ArticlePage } from './pages/ArticlePage';
import { Newspaper } from 'lucide-react';
import { TrendingTopics } from './components/TrendingTopics';
import { MostRead } from './components/MostRead';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Newspaper className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Global News Live</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Real-time news updates from thousands of sources worldwide
          </p>
        </div>
      </header>

      <TrendingTopics />
      <MostRead />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Powered by <span className="font-medium text-primary-600">Acquisition.si</span> - Updates every 5 minutes
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;