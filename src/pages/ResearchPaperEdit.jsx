import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getResearchPaper, updateResearchPaper } from '../services/researchPapers';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditResearchPaper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [filePreview, setFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchResearchPaper = async () => {
      try {
        const response = await getResearchPaper(id);
        const paper = response.data.researchPaper;
        setFormData({
          title: paper.title,
          description: paper.description,
        });
        setFilePreview(paper.fileUrl);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching research paper:', error);
        toast.error('Failed to fetch research paper details');
        navigate('/research-papers');
      }
    };

    fetchResearchPaper();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid PDF file');
        return;
      }

      // Validate file size (20MB max)
      const maxSize = 20 * 1024 * 1024; // 20MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 20MB');
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
      toast.error('Please enter a title for the research paper');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      setIsSubmitting(false);
      return;
    }

    const researchPaperData = new FormData();
    researchPaperData.append('title', formData.title.trim());
    researchPaperData.append('description', formData.description.trim());
    if (formData.file) {
      researchPaperData.append('file', formData.file);
    }

    try {
      const response = await updateResearchPaper(id, researchPaperData);
      console.log('Research paper updated successfully:', response);
      toast.success('Research paper updated successfully');
      navigate('/research-papers');
    } catch (error) {
      console.error('Error updating research paper:', error);
      toast.error('Failed to update research paper');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Edit Research Paper</h1>
              <p className="text-gray-600 text-lg">Update your research paper information</p>
            </div>

            {/* Form Container */}
            <div className="overflow-hidden w-full">
              <form onSubmit={handleSubmit} className="p-10" encType="multipart/form-data">
                {/* Title Field */}
                <div className="mb-8">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                    Research Paper Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter your research paper title..."
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
                    placeholder="Enter research paper description..."
                  ></textarea>
                </div>

                {/* File Upload */}
                <div className="mb-10">
                  <label htmlFor="file" className="block text-sm font-semibold text-gray-800 mb-3">
                    Research Paper File
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
                          <span>Upload new file</span>
                          <input
                            type="file"
                            name="file"
                            id="file"
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">PDF up to 20MB</p>
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
                            <p className="text-sm font-medium text-gray-900">
                              {formData.file ? formData.file.name : 'Current file'}
                            </p>
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
                    onClick={() => navigate('/research-papers')}
                    className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Update Research Paper
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