import React, { useState } from "react";
import "./New.css";
import Sidebar from "../components/Sidebar";

export default function Newcourse() {
  return (
    <div>
      <App />
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <AddCourse />
      </div>
    </div>
  );
}

const AddCourse = () => {
  const [courseImage, setCourseImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="add-course-container">
      <h2>Add New Course</h2>
      <form className="course-form">
        <div className="form-left">
          <label>Course Title *</label>
          <input type="text" placeholder="Enter course title" required />

          <label>Description *</label>
          <textarea placeholder="Enter course description" required />

          <div className="form-row">
            <div>
              <label>Price (₹) *</label>
              <input type="number" placeholder="0.00" required />
            </div>
            <div>
              <label>Level *</label>
              <select required>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Type *</label>
              <select required>
                <option>Gold</option>
                <option>Silver</option>
                <option>Free</option>
              </select>
            </div>
            <div className="publish">
              <input type="checkbox" />
              <label>Publish course</label>
            </div>
          </div>
        </div>

        <div className="form-right">
          <label>Course Image</label>
          <div className="image-preview">
            {courseImage ? (
              <img src={courseImage} alt="Preview" />
            ) : (
              <span>Course preview</span>
            )}
          </div>
          <div className="upload-box">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
            />
            <p>Upload course image</p>
            <small>Recommended: 1280x720px, PNG or JPG</small>
          </div>
        </div>
      </form>

      <div className="course-chapters">
        <h3>Course Chapters</h3>
        <div className="chapters-box">
          <p>No chapters added yet. Add your first chapter to get started.</p>
        </div>
        <button className="add-chapter-btn">+ Add Chapter</button>
      </div>

      <div className="form-actions">
        <button className="cancel-btn">Cancel</button>
        <button className="create-btn">Create Course</button>
      </div>
    </div>
  );
};
