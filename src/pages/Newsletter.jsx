import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewsLetters } from '../services/newsletters';
import Sidebar from '../components/Sidebar';
import NewsletterCard from '../components/NewsletterCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Newsletter() {
  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <NewsletterContent />
    </div>
  );
}

const NewsletterContent = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await getNewsLetters();
        setNewsletters(response.data.newsletters);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch newsletters');
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Newsletters</h2>
          <Link
            to="/newsletters/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add New Newsletter
          </Link>
        </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!Array.isArray(newsletters) || newsletters.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No newsletters found</div>
          ) : (
            newsletters.map((newsletter) => (
              <NewsletterCard key={newsletter._id} newsletter={newsletter} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 