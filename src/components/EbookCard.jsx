import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEbook } from '../services/ebooks';
import { toast } from 'react-toastify';

export default function EbookCard({ ebook }) {
  const navigate = useNavigate();
  const { title, filename, size, fileUrl } = ebook;

  const handleEdit = () => {
    navigate(`/ebooks/${ebook._id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteEbook(ebook._id);
      toast.success('Ebook deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting ebook:', error);
      toast.error('Failed to delete ebook');
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
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{filename}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{size}</span>
          </div>
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