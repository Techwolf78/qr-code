import React from 'react';
import vyomImage from './assets/vyom.jpg';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <img 
          src={vyomImage} 
          alt="Event Agenda" 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Welcome;
