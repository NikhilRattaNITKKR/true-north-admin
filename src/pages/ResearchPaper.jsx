import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResearchPapers } from '../services/researchPapers';
import Sidebar from '../components/Sidebar';
import ResearchPaperCard from '../components/ResearchPaperCard';

export default function ResearchPaper() {
  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <ResearchPaperContent />
    </div>
  );
}

const ResearchPaperContent = () => {
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchPapers = async () => {
      try {
        const response = await getResearchPapers();
        setResearchPapers(response.data.researchPapers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch research papers');
        setLoading(false);
      }
    };

    fetchResearchPapers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Research Papers</h2>
          <Link
            to="/research-papers/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Add New Research Paper
          </Link>
        </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!Array.isArray(researchPapers) || researchPapers.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No research papers found</div>
          ) : (
            researchPapers.map((paper) => (
              <ResearchPaperCard key={paper._id} researchPaper={paper} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 