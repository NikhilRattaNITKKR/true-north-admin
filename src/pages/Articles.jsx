import React, { useState, useEffect, useRef } from 'react';
// import './Articles.css';
import { Link, useLocation } from 'react-router-dom';
import { getArticles } from '../services/articles';
import Sidebar from '../components/Sidebar';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Articles() {
  return (
    <div className="flex flex-row w-full ">
      <Sidebar />
      <ArticleContent />
    </div>
  )
}

function ArticlesApp() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
       <ArticleContent />
      </div>
    </div>
  );
}

const ArticleContent = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles();
        setArticles(response.data.articles);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex-1 p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Articles</h2>
          <Link
            to="/articles/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add New Article
          </Link>
        </div>
    
        {/* <input
          type="text"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search articles..."
        /> */}
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!Array.isArray(articles) || articles.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No articles found</div>
          ) : (
            articles.map((article) => (
              <div key={article._id} className="relative">
                {article.isFeatured && (
                  <div className="absolute top-4 left-3 px-3 z-10 py-1 rounded-full text-xs font-medium bg-[#507b00] bg-opacity-90 text-white">
                    Featured
                  </div>
                )}
                <ArticleCard article={article} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
