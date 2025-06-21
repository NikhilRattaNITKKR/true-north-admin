import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteWorkshop } from '../services/workshops';
import { toast } from 'react-toastify';

export default function WorkshopCard({ workshop }) {
  const navigate = useNavigate();
  const { title, description, date, duration, imageUrl, workshopLink } = workshop;

  const handleEdit = () => {
    navigate(`/workshops/${workshop._id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteWorkshop(workshop._id);
      toast.success('Workshop deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting workshop:', error);
      toast.error('Failed to delete workshop');
    }
  };

  const handleJoin = () => {
    if (workshopLink) {
      window.open(workshopLink, '_blank');
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
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/(\d+)(?=(st|nd|rd|th))/, (match) => {
                const day = parseInt(match);
                const suffix = ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day > 23 ? 0 : day % 10];
                return `${day}${suffix}`;
              })}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{duration}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          {workshopLink && (
            <button
              onClick={handleJoin}
              className="px-4 py-2 text-sm font-medium text-white bg-[#507b00] rounded-lg hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-1 transition-all duration-200"
            >
              Join Workshop
            </button>
          )}
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