import React, { useState, useEffect } from "react";
import {
  getAdminSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../services/slider";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    isActive: true,
    file: null,
    source: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await getAdminSliders();
      if (response.status >= 200 && response.status < 300) {
        setSliders(response.data.sliders);
      }
    } catch (error) {
      toast.error("Failed to fetch sliders");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (editingId) {
        const response = await updateSlider(editingId, data);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Slider updated successfully");
        }
      } else {
        const response = await createSlider(data);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Slider created successfully");
        }
      }
      fetchSliders();
      resetForm();
    } catch (error) {
      toast.error(
        editingId ? "Failed to update slider" : "Failed to create slider"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        const response = await deleteSlider(id);
        if (response.status >= 200 && response.status < 300) {
          toast.success("Slider deleted successfully");
          fetchSliders();
        }
      } catch (error) {
        toast.error("Failed to delete slider");
      }
    }
  };

  const handleEdit = (slider) => {
    setFormData({
      title: slider.title,
      description: slider.description,
      order: slider.order,
      isActive: slider.isActive,
      file: null,
      source: slider.source,
    });
    setEditingId(slider._id);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: 0,
      isActive: true,
      file: null,
      source: "",
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="p-6 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Slider Management
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#507b00] focus:border-[#507b00]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#507b00] focus:border-[#507b00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-[#507b00] focus:border-[#507b00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#507b00] focus:border-[#507b00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#507b00] focus:border-[#507b00]"
              required={!editingId}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#507b00] focus:ring-[#507b00] border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#507b00] text-white rounded-lg hover:bg-[#3d5c00] transition-colors duration-200 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Slider"
                : "Create Slider"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <div key={slider._id} className="border rounded-lg p-4">
              <img
                src={slider.imageUrl}
                alt={slider.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{slider.title}</h3>
              <p className="text-gray-600 mb-2">{slider.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Order: {slider.order}
                </span>
                <span
                  className={`text-sm ${
                    slider.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {slider.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Source: {slider.source}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(slider)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slider._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderManagement;
