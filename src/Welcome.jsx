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
    <div className="w-screen min-h-screen p-4 flex flex-col items-center justify-start bg-black">
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          style={{
            animation: 'fadeIn 0.7s',
            WebkitAnimation: 'fadeIn 0.7s',
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl px-10 py-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-2 text-[#127C8C]">Welcome to Vyom</h1>
            <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-[#127C8C] transition-all"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.1s linear',
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Closing in {Math.ceil(progress / 33.3)}s...</p>
          </div>
        </div>
      )}
      <div
        className="w-full max-w-3xl h-96 bg-contain bg-center bg-no-repeat shadow-lg mt-16 transition-all duration-500"
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: showPopup ? 0.3 : 1,
          filter: showPopup ? 'blur(2px)' : 'none',
          transition: 'opacity 0.5s, filter 0.5s',
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