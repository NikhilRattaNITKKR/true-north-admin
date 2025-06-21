import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateArticle, getArticle, setFeaturedArticle } from '../services/articles';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const categories = [
  'carbon',
  'energy',
  'conservation',
  'green-building',
  'biodiversity',
  'circular-economy',
  'sustainable-development-goals',
];

// Function to calculate read time in minutes
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [manualReadTime, setManualReadTime] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: 'draft',
    imageUrl: null,
    image: null,
    isFeatured: false,
    author: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update estimated read time whenever content changes
  useEffect(() => {
    setEstimatedReadTime(calculateReadTime(formData.content));
  }, [formData.content]);

  // Simulate fetching article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
            const response = await getArticle(id);
            if (response.status === 200) {
                setArticle(response.data.article);
                setFormData({
                    title: response.data.article.title,
                    content: response.data.article.content,
                    category: response.data.article.category,
                    status: response.data.article.status,
                    imageUrl: response.data.article.imageUrl,
                    image: null,
                    isFeatured: response.data.article.isFeatured || false,
                    author: response.data.article.author || '',
                });
                setManualReadTime(response.data.article.readTime || 0);
                setImagePreview(response.data.article.imageUrl);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            setLoading(false);
        }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
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
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFeaturedChange = async (e) => {
    const newFeaturedStatus = e.target.checked;
    try {
      if (newFeaturedStatus) {
        const response = await setFeaturedArticle(id);
        if (response.status === 200) {
          toast.success('Article set as featured');
          setFormData(prev => ({ ...prev, isFeatured: true, status: 'published' }));
        }
      } else {
        // If you have an endpoint to unset featured status, call it here
        // For now, we'll just show a message that it can't be unchecked
        toast.info('To unset featured status, set another article as featured');
        e.target.checked = true; // Keep the toggle checked
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
      e.target.checked = !newFeaturedStatus; // Revert the toggle
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const articleData = new FormData();
    articleData.append('title', formData.title);
    articleData.append('content', formData.content);
    articleData.append('category', formData.category);
    articleData.append('status', formData.status);
    articleData.append('readTime', manualReadTime || estimatedReadTime);
    articleData.append('author', formData.author);
    if (formData.image) {
      articleData.append('file', formData.image);
    }

    try {
      const response = await updateArticle(id, articleData);
      console.log('Article updated successfully:', response);
      toast.success('Article updated successfully');
      navigate('/articles');
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Failed to update article');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/articles`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-row w-full justify-start">
        <Sidebar />
    <div className="min-h-screen py-16 px-4 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Edit Article</h1>
          <p className="text-gray-600 text-lg">Update your article details and content</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-10">
            
            {/* Title Field */}
            <div className="mb-8">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                Article Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter your article title..."
              />
            </div>

            {/* Author Field */}
            <div className="mb-8">
              <label htmlFor="author" className="block text-sm font-semibold text-gray-800 mb-3">
                Author
              </label>
              <input
                type="text"
                name="author"
                id="author"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name..."
              />
            </div>

            {/* Content Field */}
            <div className="mb-8">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-800 mb-3">
                Article Content
              </label>
              <textarea
                name="content"
                id="content"
                rows="12"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Write your article content here..."
              ></textarea>
              <div className="mt-2 flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Estimated read time: {estimatedReadTime} {estimatedReadTime === 1 ? 'minute' : 'minutes'}
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="manualReadTime" className="text-sm text-gray-500">Manual read time (minutes):</label>
                  <input
                    type="number"
                    id="manualReadTime"
                    min="1"
                    value={manualReadTime || ''}
                    onChange={(e) => setManualReadTime(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Category */}
              <div>
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
                    backgroundSize: '16px'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-800 mb-3">
                  Publication Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 bg-white appearance-none"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 12px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </select>
              </div>
            </div>

            {/* Featured Article Toggle */}
            <div className="mb-8">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Featured Article</h3>
                  <p className="text-sm text-gray-500">Set this article as the featured article on the landing page</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleFeaturedChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#507b00]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#507b00]"></div>
                </label>
              </div>
            </div>

            {/* Current Image Display */}
            {formData.imageUrl && !formData.image && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Current Image
                </label>
                <img
                  src={formData.imageUrl}
                  alt="Current article"
                  className="w-full h-60 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}

            {/* Image Upload */}
            <div className="mb-10">
              <label htmlFor="image" className="block text-sm font-semibold text-gray-800 mb-3">
                {formData.imageUrl ? 'Update Featured Image' : 'Featured Image'}
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
                      <span>{formData.imageUrl ? 'Upload new image' : 'Upload an image'}</span>
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
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              
              {imagePreview && formData.image && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-800 mb-3">New Image Preview</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-xl shadow-sm border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Update Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ArticleEdit;