import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCaseStudies } from '../services/caseStudies';
import CaseStudyCard from '../components/CaseStudyCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CaseStudy() {
  return (
    <div className="flex">
      <Sidebar />
      <CaseStudyContent />
    </div>
  );
}

function CaseStudyContent() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await getCaseStudies();
        setCaseStudies(response.data.caseStudies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching case studies:', error);
        setError('Failed to fetch case studies');
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex-1 p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Case Studies</h1>
        <Link
          to="/case-studies/create"
          className="px-6 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Add New Case Study
        </Link>
      </div>

      {caseStudies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No case studies found. Create your first case study!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => (
            <div key={caseStudy._id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
              {caseStudy.isFeatured && (
                <div className="absolute top-2 right-2 z-10 bg-[#507b00] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
              <div className="relative h-48">
                <img
                  src={caseStudy.imageUrl}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{caseStudy.content}</p>
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/case-studies/${caseStudy._id}/edit`}
                    className="px-4 py-2 bg-[#507b00] text-white rounded-lg hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 text-center"
                  >
                    Edit Case Study
                  </Link>
                  {caseStudy.documentUrl && (
                    <a
                      href={caseStudy.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border-2 border-[#507b00] text-[#507b00] rounded-lg hover:bg-[#507b00] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 text-center flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Document
                    </a>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Created: {new Date(caseStudy.createdAt).toLocaleDateString()}</p>
                  <p>Last Updated: {new Date(caseStudy.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 