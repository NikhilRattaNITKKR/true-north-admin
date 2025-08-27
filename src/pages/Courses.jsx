import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCourses, deleteCourse } from "../services/course";
import CreateCourseModal from "../components/CreateCourseModal";
import EditCourseModal from "../components/EditCourseModal";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Course() {
  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <AllCourses />
    </div>
  );
}

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      if (response.success) {
        setCourses(response.courses);
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await deleteCourse(courseId);
        if (response.success) {
          toast.success("Course deleted successfully");
          fetchCourses();
        }
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create New Course
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex gap-4">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="carbon">Carbon</option>
            <option value="energy">Energy</option>
            <option value="conservation">Conservation</option>
            <option value="green-building">Green Building</option>
            <option value="biodiversity">Biodiversity</option>
            <option value="circular-economy">Circular Economy</option>
            <option value="sustainable-development-goals">SDGs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    course.level === "beginner"
                      ? "bg-green-100 text-green-800"
                      : course.level === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {course.access}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  {course.access === "paid" ? `₹${course.price}` : "Free"}
                </span>
                <div className="flex gap-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsEditModalOpen(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchCourses();
        }}
      />

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchCourses();
        }}
        course={selectedCourse}
      />
    </div>
  );
};
