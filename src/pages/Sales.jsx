import React, { useState, useEffect } from 'react';
import { getSales, updateSales, toggleSalesPublish } from '../services/sales';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const Sales = () => {
  const [sales, setSales] = useState({ text: '', isPublished: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await getSales();
      if (response.status >= 200 && response.status < 300) {
        setSales(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch sales content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await updateSales(sales);
      if (response.status >= 200 && response.status < 300) {
        setSales(response.data);
        toast.success('Sales content updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update sales content');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const response = await toggleSalesPublish();
      if (response.status >= 200 && response.status < 300) {
        setSales(response.data);
        toast.success(`Sales content ${response.data.isPublished ? 'published' : 'unpublished'} successfully`);
      }
    } catch (error) {
      toast.error('Failed to toggle publish status');
    }
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
            <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Content</h1>
        <button
          onClick={handleTogglePublish}
          className={`px-4 py-2 rounded-lg ${
            sales.isPublished
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-[#507b00] hover:bg-[#3d5c00]'
          } text-white transition-colors duration-200`}
        >
          {sales.isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={sales.text}
            onChange={(e) => setSales({ ...sales, text: e.target.value })}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-[#507b00] focus:border-[#507b00]"
            placeholder="Enter sales content..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-[#507b00] text-white rounded-lg hover:bg-[#3d5c00] transition-colors duration-200 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default Sales; 