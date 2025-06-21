import React, { useState, useEffect, useRef } from 'react';
// import './Articles.css';
import { Link, useLocation } from 'react-router-dom';
import { getEbooks } from '../services/ebooks';
import Sidebar from '../components/Sidebar';
import EbookCard from '../components/EbookCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Ebook() {
  return (
    <div className="flex flex-row w-full ">
      <Sidebar />
      <EbookContent />
    </div>
  )
}

const EbookContent = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await getEbooks();
        setEbooks(response.data.ebooks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ebooks');
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex-1 p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Ebooks</h2>
          <Link
            to="/ebooks/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add New Ebook
          </Link>
        </div>
    
        {/* <input
          type="text"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search ebooks..."
        /> */}
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!Array.isArray(ebooks) || ebooks.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No ebooks found</div>
          ) : (
            ebooks.map((ebook) => (
              <EbookCard key={ebook._id} ebook={ebook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
