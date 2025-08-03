import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createArticle } from "../services/articles";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = [
  "carbon",
  "energy",
  "conservation",
  "green-building",
  "biodiversity",
  "circular-economy",
  "sustainable-development-goals",
];

// Function to calculate read time in minutes
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

export default function CreateArticle() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
    status: "draft",
    author: "",
  });
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [manualReadTime, setManualReadTime] = useState(0);

  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refdiv = useRef(null);
  const editorRef = useRef(null); // store RTE instance

  useEffect(() => {
    if (refdiv.current) {
      const editor1cfg = { toolbar: "basic" };
      editorRef.current = new window.RichTextEditor(refdiv.current, editor1cfg);
      editorRef.current.setHTMLCode("Write your content here");
    }

    // return () => {
    //   // cleanup on unmount
    //   if (editorRef.current) editorRef.current.destroy();
    // };
  }, []);

  // Update estimated read time whenever content changes
  useEffect(() => {
    setEstimatedReadTime(calculateReadTime(formData.content));
  }, [formData.content]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
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
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const articleData = new FormData();
    articleData.append("title", formData.title);
    articleData.append("content", editorRef.current.getHTMLCode());

    // articleData.append("content", formData.content);
    articleData.append("category", formData.category);
    articleData.append("file", formData.image);
    articleData.append("status", formData.status);
    articleData.append("readTime", manualReadTime || estimatedReadTime);
    articleData.append("author", formData.author);

    try {
      const response = await createArticle(articleData);
      console.log("Article created successfully:", response);
      toast.success("Article created successfully");
      navigate("/articles");
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Failed to create article");
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="container">
        <div className="min-h-screen py-16 px-4 w-full flex justify-center items-center">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Create New Article
              </h1>
              <p className="text-gray-600 text-lg">
                Share your insights and expertise with the community
              </p>
            </div>

            {/* Form Container */}
            <div className="overflow-hidden w-full">
              <form
                onSubmit={handleSubmit}
                className="p-10"
                encType="multipart/form-data"
              >
                {/* Title Field */}
                <div className="mb-8">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
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
                  <label
                    htmlFor="author"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
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
                  <label
                    htmlFor="content"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Article Content
                  </label>
                  {/* <textarea
                    name="content"
                    id="content"
                    rows="12"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="Write your article content here..."
                  ></textarea> */}
                  <div ref={refdiv}></div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Estimated read time: {estimatedReadTime}{" "}
                      {estimatedReadTime === 1 ? "minute" : "minutes"}
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="manualReadTime"
                        className="text-sm text-gray-500"
                      >
                        Manual read time (minutes):
                      </label>
                      <input
                        type="number"
                        id="manualReadTime"
                        min="1"
                        value={manualReadTime || ""}
                        onChange={(e) =>
                          setManualReadTime(
                            Math.max(1, parseInt(e.target.value) || 0)
                          )
                        }
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
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-800 mb-3"
                    >
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
                        backgroundPosition: "right 12px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "16px",
                        padding: "6px",
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-semibold text-gray-800 mb-3"
                    >
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
                        backgroundPosition: "right 12px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "16px",
                        padding: "6px",
                      }}
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="published">Publish Now</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-10">
                  <label
                    htmlFor="image"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Featured Image
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl transition-all duration-200 ${
                      isDragging
                        ? "border-[#507b00] bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="px-6 py-12 text-center">
                      <svg
                        className={`mx-auto h-16 w-16 mb-4 transition-colors duration-200 ${
                          isDragging ? "text-[#507b00]" : "text-gray-400"
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
                            required
                          />
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="mt-6">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-80 object-cover rounded-xl shadow-sm border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center items-center w-full gap-4 pt-8 mt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate("/articles")}
                    className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    {formData.status === "draft"
                      ? "Save Draft"
                      : "Publish Article"}
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
