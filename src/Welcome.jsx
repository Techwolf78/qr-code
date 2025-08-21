import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import bgImage from './assets/vyom.jpg';

const Welcome = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [progress, setProgress] = useState(100);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');

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

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFeedback = async (type) => {
    try {
      // Store feedback in Firebase
      const feedbackValue = type === 'positive' ? 'good' : 'bad';
      await addDoc(collection(db, 'feedback'), {
        feedback: feedbackValue,
        timestamp: new Date()
      });

      setFeedbackType(type);
      setFeedbackGiven(true);
      
      // Reset feedback after 3 seconds
      setTimeout(() => {
        setFeedbackGiven(false);
      }, 3000);
    } catch (error) {
      console.error('Error storing feedback:', error);
      // Still show thank you message even if storage fails
      setFeedbackType(type);
      setFeedbackGiven(true);
      setTimeout(() => {
        setFeedbackGiven(false);
      }, 3000);
    }
  };

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
            className="bg-white/90 rounded-xl px-6 py-8 sm:px-12 sm:py-10 flex flex-col items-center w-11/12 max-w-sm sm:max-w-lg shadow-2xl border border-white/20 relative"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-[#127C8C] transition-colors duration-200 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close popup"
            >
              ✕
            </button>

            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-[#127C8C] text-center">Welcome to Vyom</h1>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-8 overflow-hidden">
              <div
                className="h-full bg-[#127C8C] transition-all"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.1s linear',
                }}
              ></div>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mt-4 text-center">Closing in {Math.ceil(progress / 33.3)}s...</p>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full pb-20">
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

      {/* Bottom Sticky Feedback Banner */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-40 py-3 px-6">
        {!feedbackGiven ? (
          <div className="flex items-center justify-center space-x-6">
            <span className="text-gray-700 font-medium text-sm sm:text-base">
              How was your experience?
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => handleFeedback('positive')}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-110"
                aria-label="Positive feedback"
              >
                <span className="text-white text-sm">👍</span>
              </button>
              <button
                onClick={() => handleFeedback('negative')}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                aria-label="Negative feedback"
              >
                <span className="text-white text-sm">👎</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[#127C8C] font-medium text-sm sm:text-base">
              Thank you for your feedback! 🙏
            </p>
          </div>
        )}
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