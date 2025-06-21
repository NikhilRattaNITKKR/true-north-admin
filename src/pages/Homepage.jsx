import React, { useState, useEffect } from 'react';
import './Homepage.css'; // Import your CSS file

import { Link, useLocation } from 'react-router-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getDashboardStats } from '../services/dashboard';

// Mock data - replace with actual API call
const dashboardData = {
  articles: {
    byStatus: {
      draft: 5,
      published: 10
    },
    byCategory: {
      carbon: 3,
      energy: 4
    }
  },
  courses: {
    byAccess: {
      free: 5,
      paid: 8
    },
    byCategory: {
      carbon: 3,
      energy: 4
    },
    byLevel: {
      beginner: 4,
      intermediate: 6,
      advanced: 3
    }
  },
  workshops: { total: 5 },
  ebooks: { total: 8 },
  researchPapers: { total: 12 },
  newsletters: { total: 15 },
  users: {
    admin: 2,
    user: 50
  },
  caseStudies: { total: 7 }
};

export default function Homepage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50b700]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#50b700] mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to your content management dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Articles Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#50b700]">Articles</h2>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-[#50b700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-700">By Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats?.articles?.byStatus || {}).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <span className="block text-2xl font-bold text-[#50b700]">{count}</span>
                      <span className="text-sm text-gray-500 capitalize">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-700">By Category</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats?.articles?.byCategory || {}).map(([category, count]) => (
                    <div key={category} className="text-center">
                      <span className="block text-2xl font-bold text-[#50b700]">{count}</span>
                      <span className="text-sm text-gray-500 capitalize">{category.replace(/-/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Courses Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#50b700]">Courses</h2>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-[#50b700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-700">By Access</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats?.courses?.byAccess || {}).map(([access, count]) => (
                    <div key={access} className="text-center">
                      <span className="block text-2xl font-bold text-[#50b700]">{count}</span>
                      <span className="text-sm text-gray-500 capitalize">{access}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-700">By Category</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats?.courses?.byCategory || {}).map(([category, count]) => (
                    <div key={category} className="text-center">
                      <span className="block text-2xl font-bold text-[#50b700]">{count}</span>
                      <span className="text-sm text-gray-500 capitalize">{category.replace(/-/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-700">By Level</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(stats?.courses?.byLevel || {}).map(([level, count]) => (
                    <div key={level} className="text-center">
                      <span className="block text-2xl font-bold text-[#50b700]">{count}</span>
                      <span className="text-sm text-gray-500 capitalize">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Users Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#50b700]">Users</h2>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-[#50b700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-[#50b700]">{stats?.users?.total || 0}</span>
                  <span className="text-sm text-gray-500">Total Users</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resources Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#50b700]">Resources Overview</h2>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-[#50b700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold text-[#50b700]">{stats?.workshops?.total || 0}</span>
                <span className="text-sm text-gray-500">Workshops</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold text-[#50b700]">{stats?.ebooks?.total || 0}</span>
                <span className="text-sm text-gray-500">Ebooks</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold text-[#50b700]">{stats?.researchPapers?.total || 0}</span>
                <span className="text-sm text-gray-500">Research Papers</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold text-[#50b700]">{stats?.newsletters?.total || 0}</span>
                <span className="text-sm text-gray-500">Newsletters</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold text-[#50b700]">{stats?.caseStudies?.total || 0}</span>
                <span className="text-sm text-gray-500">Case Studies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
