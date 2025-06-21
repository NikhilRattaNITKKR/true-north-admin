import React from 'react'
import './webinars.css';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Webinars() {
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
        <WebinarList/>
      </div>
    </div>
  );
}

const webinars = [
  {
    id: 1,
    title: 'Digital Marketing',
    description: 'Learn advanced strategies...',
    date: '3/22/2025, 9:20:00 PM',
    duration: '2 hours',
    presenter: 'John Smith',
    image: 'public/images/Bullitt-029.jpg',
    link: '#'
  },
  {
    id: 2,
    title: 'title',
    description: 'kfdslkfmakldkwekds,ms dsa fdsaj akjdaskl dsnklak',
    date: '3/15/2025, 7:51:00 PM',
    duration: '1 hour',
    presenter: 'nikhil mohan',
    image: 'public/images/Bullitt-029.jpg',
    link: '#'
  },
  {
    id: 3,
    title: 'title',
    description: 'kfdslkfmakldkwekds,ms dsa fdsaj akjdaskl dsnklak',
    date: '3/15/2025, 7:51:00 PM',
    duration: '1 hour',
    presenter: 'nikhil mohan',
    image: 'public/images/Bullitt-029.jpg',
    link: '#'
  }
];

const WebinarList = () => {
  return (
    <div className="webinar-container">
      <div className="webinar-header">
        <h2>Webinars</h2>
        <button className="add-btn">+ Add New Webinar</button>
      </div>

      <div className="webinar-grid">
        {webinars.map((webinar) => (
          <div className="webinar-card" key={webinar.id}>
            <img src={webinar.image} alt={webinar.title} className="webinar-image" />
            <h3>{webinar.title}</h3>
            <p className="description">{webinar.description}</p>
            <p><span role="img" aria-label="calendar">📅</span> {webinar.date}</p>
            <p><span role="img" aria-label="clock">⏱️</span> Duration: {webinar.duration}</p>
            <p><strong>Presenter:</strong> {webinar.presenter}</p>
            <a href={webinar.link} className="join-link">🔗 Join Webinar</a>
            <div className="card-buttons">
              <button className="edit-btn">✏️ Edit</button>
              <button className="delete-btn">🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

