import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCaseStudy } from '../services/caseStudies';
import { toast } from 'react-toastify';

export default function CaseStudyCard({ caseStudy }) {
  const navigate = useNavigate();
  const { title, content, imageUrl } = caseStudy;

  const handleEdit = () => {
    navigate(`/case-studies/${caseStudy._id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteCaseStudy(caseStudy._id);
      toast.success('Case study deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting case study:', error);
      toast.error('Failed to delete case study');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover" 
        />
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {content}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 