import React, { useState } from 'react';
import './research.css';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Research() {
  return (
    <div>
      <App/>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <UploadPaper/>
      </div>
    </div>
  );
}

const UploadPaper = () => {
  const [paperTitle, setPaperTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [papers, setPapers] = useState([]);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (paperTitle && pdfFile) {
      const newPaper = { title: paperTitle, file: pdfFile.name };
      setPapers([...papers, newPaper]);
      setPaperTitle('');
      setPdfFile(null);
    } else {
      alert('Please enter the title and select a PDF file.');
    }
  };

  return (
    <div className="container">
      <div className="upload-section">
        <h2>Upload Research Paper</h2>
        <label>Paper Title</label>
        <input
          type="text"
          placeholder="Enter paper title"
          value={paperTitle}
          onChange={(e) => setPaperTitle(e.target.value)}
        />
        <div className="file-upload">
          <label htmlFor="fileInput" className="file-label">
            <i className="fa fa-cloud-upload" style={{ fontSize: '2rem' }}></i>
            <p>Select PDF File</p>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
        <button onClick={handleUpload}>Upload Paper</button>
      </div>

      <div className="manage-section">
        <h2>Manage Research-papers</h2>
        <div className="paper-list">
          {papers.length === 0 ? (
            <div className="no-papers">
              <i className="fa fa-file-pdf-o" style={{ fontSize: '2rem' }}></i>
              <p>No research-papers available</p>
            </div>
          ) : (
            papers.map((paper, index) => (
              <div className="paper-item" key={index}>
                <i className="fa fa-file-pdf-o"></i>
                <span>{paper.title} ({paper.file})</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

