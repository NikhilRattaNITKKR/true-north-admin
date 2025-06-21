import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createWorkshop } from '../services/workshops';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CreateWorkshop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    workshopLink: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
  
    const file = e.dataTransfer.files[0];
    if (!file) return;
  
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;
  
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG)');
      return;
    }
  
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }
  
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the workshop');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      setIsSubmitting(false);
      return;
    }

    if (!formData.date) {
      toast.error('Please select a date for the workshop');
      setIsSubmitting(false);
      return;
    }

    if (!formData.duration.trim()) {
      toast.error('Please enter the workshop duration');
      setIsSubmitting(false);
      return;
    }

    if (!formData.image) {
      toast.error('Please upload a workshop image');
      setIsSubmitting(false);
      return;
    }

    const workshopData = new FormData();
    workshopData.append('title', formData.title.trim());
    workshopData.append('description', formData.description.trim());
    workshopData.append('date', formData.date);
    workshopData.append('duration', formData.duration.trim());
    if (formData.workshopLink) {
      workshopData.append('workshopLink', formData.workshopLink.trim());
    }
    workshopData.append('image', formData.image);

    try {
      const response = await createWorkshop(workshopData);
      console.log('Workshop created successfully:', response);
      toast.success('Workshop created successfully');
      navigate('/workshops');
    } catch (error) {
      console.error('Error creating workshop:', error);
      toast.error('Failed to create workshop');
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <LoadingSpinner />;

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='container'> 
        <div className="min-h-screen py-16 px-4 w-full flex justify-center items-center">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Create New Workshop</h1>
              <p className="text-gray-600 text-lg">Add a new workshop to your platform</p>
            </div>

            {/* Form Container */}
            <div className="overflow-hidden w-full">
              <form onSubmit={handleSubmit} className="p-10" encType="multipart/form-data">
                {/* Title Field */}
                <div className="mb-8">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                    Workshop Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter workshop title..."
                  />
                </div>

                {/* Description Field */}
                <div className="mb-8">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows="4"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter workshop description..."
                  ></textarea>
                </div>

                {/* Date Field */}
                <div className="mb-8">
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-800 mb-3">
                    Workshop Date
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    id="date"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Duration Field */}
                <div className="mb-8">
                  <label htmlFor="duration" className="block text-sm font-semibold text-gray-800 mb-3">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2 hours, 1 day, etc."
                  />
                </div>

                {/* Workshop Link Field */}
                <div className="mb-8">
                  <label htmlFor="workshopLink" className="block text-sm font-semibold text-gray-800 mb-3">
                    Workshop Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="workshopLink"
                    id="workshopLink"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={formData.workshopLink}
                    onChange={handleChange}
                    placeholder="Enter workshop meeting link..."
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-10">
                  <label htmlFor="image" className="block text-sm font-semibold text-gray-800 mb-3">
                    Workshop Image
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl transition-all duration-200 ${
                      isDragging
                        ? 'border-[#507b00] bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="px-6 py-12 text-center">
                      <svg
                        className={`mx-auto h-16 w-16 mb-4 transition-colors duration-200 ${
                          isDragging ? 'text-[#507b00]' : 'text-gray-400'
                        }`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-gray-600 mb-2">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer font-medium text-[#507b00] hover:text-[#21b6ab] transition-colors duration-200"
                        >
                          <span>Upload an image</span>
                          <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-6">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Workshop preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center w-full gap-4 pt-8 mt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate('/workshops')}
                    className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.title || !formData.description || !formData.date || !formData.duration || !formData.image || isSubmitting}
                    className="px-8 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Workshop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 