import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeedbacks } from "../services/feedbacks";
import Sidebar from "../components/Sidebar";
import FeedbackCard from "../components/FeedbackCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Feedback() {
  return (
    <div className="flex flex-row w-full ">
      <Sidebar />
      <FeedBackContent />
    </div>
  );
}

const FeedBackContent = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchfeedbacks = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getFeedbacks(params);
      setFeedbacks(response.data.feedbacks);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch feedbacks");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchfeedbacks();
  }, []);

  const handleSearch = () => {
    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    fetchfeedbacks(params);
  };

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    fetchfeedbacks();
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="flex-1 p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="p-6 container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Feedbacks</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
          <div>
            <label className="block text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#507b00] text-white px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Reset
          </button>
        </div>

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {!Array.isArray(feedbacks) || feedbacks.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                No Feedbacks found
              </div>
            ) : (
              feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback._id}
                  feedback={feedback}
                  className="w-full"
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
