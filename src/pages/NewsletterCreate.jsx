import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNewsLetter } from '../services/newsletters';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'Energy',
  'Carbon',
  'Conservation',
  'Green Building',
  'Biodiversity',
  'Circular Economy',
  'Sustainable Development Goals',
];

export default function CreateNewsletter() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null,
  });

  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid PDF or Word document');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFormData({ ...formData, file });
      setFilePreview(URL.createObjectURL(file));
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
    if (file) {
      setFormData({ ...formData, file });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the newsletter');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      setIsSubmitting(false);
      return;
    }

    if (!formData.file) {
      toast.error('Please upload a newsletter file');
      setIsSubmitting(false);
      return;
    }

    const newsletterData = new FormData();
    newsletterData.append('title', formData.title.trim());
    newsletterData.append('description', formData.description.trim());
    newsletterData.append('file', formData.file);

    try {
      const response = await createNewsLetter(newsletterData);
      console.log('Newsletter created successfully:', response);
      toast.success('Newsletter created successfully');
      navigate('/newsletters');
    } catch (error) {
      console.error('Error creating newsletter:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create newsletter';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='container'> 
        <div className="min-h-screen py-16 px-4 w-full flex justify-center items-center">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Create New Newsletter</h1>
              <p className="text-gray-600 text-lg">Share your newsletter with the community</p>
            </div>

            {/* Form Container */}
            <div className="overflow-hidden w-full">
              <form onSubmit={handleSubmit} className="p-10" encType="multipart/form-data">
                {/* Title Field */}
                <div className="mb-8">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                    Newsletter Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter your newsletter title..."
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
                    placeholder="Enter newsletter description..."
                  ></textarea>
                </div>

                {/* Category Field */}
                {/* <div className="mb-8">
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-3">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 bg-white appearance-none"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      padding: '6px'
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* File Upload */}
                <div className="mb-10">
                  <label htmlFor="file" className="block text-sm font-semibold text-gray-800 mb-3">
                    Newsletter File
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
                          htmlFor="file"
                          className="relative cursor-pointer font-medium text-[#507b00] hover:text-[#21b6ab] transition-colors duration-200"
                        >
                          <span>Upload a file</span>
                          <input
                            type="file"
                            name="file"
                            id="file"
                            onChange={handleChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </div>
                  
                  {filePreview && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center w-full gap-4 pt-8 mt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate('/newsletters')}
                    className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Create Newsletter
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