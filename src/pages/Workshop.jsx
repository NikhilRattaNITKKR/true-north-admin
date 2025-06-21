import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkshops } from '../services/workshops';
import WorkshopCard from '../components/WorkshopCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Workshop() {
  return (
    <div className="flex">
      <Sidebar />
      <WorkshopContent />
    </div>
  );
}

function WorkshopContent() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await getWorkshops();
        setWorkshops(response.data.workshops);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workshops:', error);
        setError('Failed to fetch workshops');
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="flex-1 p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workshops</h1>
        <Link
          to="/workshops/create"
          className="px-6 py-3 bg-[#507b00] text-white rounded-xl hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Add New Workshop
        </Link>
      </div>

      {workshops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No workshops found. Create your first workshop!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop._id} workshop={workshop} />
          ))}
        </div>
      )}
    </div>
  );
}
