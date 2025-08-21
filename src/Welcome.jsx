import React, { useEffect, useState } from 'react';
import bgImage from './assets/vyom.jpg';

const Welcome = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!showPopup) return;
    let start = Date.now();
    const duration = 2000; // 2 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(percent);
      if (elapsed >= duration) {
        setShowPopup(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [showPopup]);

  return (
    <div className="w-screen min-h-screen p-2 sm:p-4 flex flex-col items-center justify-start bg-white">
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          style={{
            animation: 'fadeIn 0.7s',
            WebkitAnimation: 'fadeIn 0.7s',
          }}
        >
          <div className="bg-white rounded-xl  px-4 py-6 sm:px-10 sm:py-8 flex flex-col items-center w-11/12 max-w-xs sm:max-w-md">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-[#127C8C] text-center">Welcome to Vyom</h1>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-[#127C8C] transition-all"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.1s linear',
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Closing in {Math.ceil(progress / 33.3)}s...</p>
          </div>
        </div>
      )}
      
      {/* Heading and Subheading */}
      <div className="text-center mt-4 sm:mt-8 mb-6 sm:mb-8 px-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#127C8C] mb-2 sm:mb-4">
          Event Agenda
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          Join us for an amazing experience
        </p>
      </div>

      <div
        className="w-screen bg-contain bg-center bg-no-repeat  transition-all duration-500"
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: showPopup ? 0.3 : 1,
          filter: showPopup ? 'blur(2px)' : 'none',
          transition: 'opacity 0.5s, filter 0.5s',
          marginLeft: '-0.5rem',
          marginRight: '-0.5rem',
          minHeight: '50vh',
          height: 'auto',
        }}
      ></div>
      {/* Inline fadeIn keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;