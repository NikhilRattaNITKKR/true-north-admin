import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteResearchPaper } from '../services/researchPapers';
import { toast } from 'react-toastify';

export default function ResearchPaperCard({ researchPaper }) {
  const navigate = useNavigate();
  const { title, description, fileUrl } = researchPaper;

  const handleEdit = () => {
    navigate(`/research-papers/${researchPaper._id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteResearchPaper(researchPaper._id);
      toast.success('Research paper deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting research paper:', error);
      toast.error('Failed to delete research paper');
    }
  };

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-[#507b00] rounded-lg hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-1 transition-all duration-200"
          >
            Download
          </button>
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