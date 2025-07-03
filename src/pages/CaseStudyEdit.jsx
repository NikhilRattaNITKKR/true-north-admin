import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCaseStudy,
  updateCaseStudy,
  setFeaturedCaseStudy,
} from "../services/caseStudies";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditCaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    document: null,
    isFeatured: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const response = await getCaseStudy(id);
        const caseStudy = response.data.caseStudy;
        setFormData({
          title: caseStudy.title,
          content: caseStudy.content,
          isFeatured: caseStudy.isFeatured || false,
        });
        setImagePreview(caseStudy.imageUrl);
        setDocumentName(caseStudy.documentName || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching case study:", error);
        toast.error("Failed to fetch case study details");
        navigate("/case-studies");
      }
    };

    fetchCaseStudy();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, WEBP)");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "document") {
      const file = files[0];

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Please upload a valid document file (PDF, DOC, DOCX, PPT, PPTX)"
        );
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error("Document size must be less than 10MB");
        return;
      }

      setFormData({ ...formData, document: file });
      setDocumentName(file.name);
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
      if (file.type.startsWith("image/")) {
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
      } else if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/vnd.ms-powerpoint" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        setFormData({ ...formData, document: file });
        setDocumentName(file.name);
      }
    }
  };

  const handleFeaturedChange = async (e) => {
    const newFeaturedStatus = e.target.checked;
    try {
      if (newFeaturedStatus) {
        const response = await setFeaturedCaseStudy(id);
        if (response.status === 200) {
          toast.success("Case study set as featured");
          setFormData((prev) => ({ ...prev, isFeatured: true }));
        }
      } else {
        toast.info(
          "To unset featured status, set another case study as featured"
        );
        e.target.checked = true; // Keep the toggle checked
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
      e.target.checked = !newFeaturedStatus; // Revert the toggle
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the case study");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter the case study content");
      return;
    }

    const caseStudyData = new FormData();
    caseStudyData.append("title", formData.title.trim());
    caseStudyData.append("content", formData.content.trim());
    if (formData.image) {
      caseStudyData.append("image", formData.image);
    }
    if (formData.document) {
      caseStudyData.append("document", formData.document);
    }

    try {
      const response = await updateCaseStudy(id, caseStudyData);
      console.log("Case study updated successfully:", response);
      toast.success("Case study updated successfully");
      navigate("/case-studies");
    } catch (error) {
      console.error("Error updating case study:", error);
      toast.error("Failed to update case study");
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
    <div className="flex flex-col items-center justify-center w-full">
      <div className="container">
        <div className="min-h-screen py-16 px-4 w-full flex justify-center items-center">
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Edit Case Study
              </h1>
              <p className="text-gray-600 text-lg">
                Update your case study information
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
                    Case Study Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter case study title..."
                  />
                </div>

                {/* Content Field */}
                <div className="mb-8">
                  <label
                    htmlFor="content"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Content
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows="8"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="Enter case study content..."
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div className="mb-8">
                  <label
                    htmlFor="image"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Case Study Image
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
                          <span>Upload new image</span>
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
                      <p className="text-sm text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                      <p className="text-sm text-gray-500">
                        Please ensure the file name doesn't contain any spaces
                      </p>
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="mt-6">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Case study preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Upload */}
                <div className="mb-10">
                  <label
                    htmlFor="document"
                    className="block text-sm font-semibold text-gray-800 mb-3"
                  >
                    Case Study Document
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
                          htmlFor="document"
                          className="relative cursor-pointer font-medium text-[#507b00] hover:text-[#21b6ab] transition-colors duration-200"
                        >
                          <span>Upload new document</span>
                          <input
                            type="file"
                            name="document"
                            id="document"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                        <span className="text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX, PPT, PPTX up to 10MB
                      </p>
                      <p className="text-sm text-gray-500">
                        Please ensure the file name doesn't contain any spaces
                      </p>
                    </div>
                  </div>

                  {documentName && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-700">{documentName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, document: null });
                            setDocumentName("");
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Featured Case Study Toggle */}
                <div className="mb-10">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Featured Case Study
                      </h3>
                      <p className="text-sm text-gray-500">
                        Set this case study as the featured case study on the
                        landing page
                      </p>
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

                {/* Action Buttons */}
                <div className="flex justify-center items-center w-full gap-4 pt-8 mt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate("/case-studies")}
                    className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Update Case Study
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
