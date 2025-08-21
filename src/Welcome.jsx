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
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-white" style={{ margin: 0, padding: 0 }}>
      {/* Sticky Banner */}
      <div className="w-full bg-[#127C8C] text-white text-center py-3 px-4 sticky top-0 z-40 shadow-md">
        <p className="text-sm sm:text-lg font-medium">
          Thank you for joining us! 
        </p>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.7s',
            WebkitAnimation: 'fadeIn 0.7s',
          }}
        >
          <div 
            className="bg-white/90 rounded-xl px-4 py-6 sm:px-10 sm:py-8 flex flex-col items-center w-11/12 max-w-xs sm:max-w-md shadow-2xl border border-white/20"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
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
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#127C8C] mb-2 sm:mb-4">
            Event Agenda
          </h1>
        </div>

        <div
          className="w-screen bg-contain bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `url(${bgImage})`,
            opacity: showPopup ? 0.3 : 1,
            filter: showPopup ? 'blur(2px)' : 'none',
            transition: 'opacity 0.5s, filter 0.5s',
            margin: 0,
            minHeight: '60vh',
            height: 'auto',
          }}
        ></div>
      </div>
      
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