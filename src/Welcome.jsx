import React from 'react';
import './Welcome.css';
import vyomImage from './assets/vyom.jpg';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Vyom</h1>
        <h2 className="agenda-subtitle">Agenda</h2>
        <div className="agenda-image-container">
          <img 
            src={vyomImage} 
            alt="Event Agenda" 
            className="agenda-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
