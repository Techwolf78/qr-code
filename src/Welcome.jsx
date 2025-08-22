import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import bgImage from './assets/vyom.jpg';

const Welcome = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(100);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [showFeedbackBanner, setShowFeedbackBanner] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  // Check if user has visited before and show popup only on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowPopup(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // Show feedback banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackBanner(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize rate limiting data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('feedbackLimitData');
    if (savedData) {
      const { count, blockedUntil, violations } = JSON.parse(savedData);
      const now = Date.now();
      
      if (blockedUntil && now < blockedUntil) {
        // User is still blocked
        setIsBlocked(true);
        setFeedbackCount(count);
        setViolationCount(violations || 0);
        setCooldownTimer(Math.ceil((blockedUntil - now) / 1000));
      } else if (blockedUntil && now >= blockedUntil) {
        // Block period expired, reset feedback count but keep violation count
        localStorage.setItem('feedbackLimitData', JSON.stringify({
          count: 0,
          blockedUntil: null,
          violations: violations || 0
        }));
        setFeedbackCount(0);
        setViolationCount(violations || 0);
        setIsBlocked(false);
      } else {
        // Not blocked, restore data
        setFeedbackCount(count);
        setViolationCount(violations || 0);
      }
    }
  }, []);

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

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownTimer > 0) {
      const timer = setTimeout(() => {
        setCooldownTimer(cooldownTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cooldownTimer === 0 && isBlocked) {
      setIsBlocked(false);
      setFeedbackCount(0);
      // Update localStorage but keep violation count
      const savedData = localStorage.getItem('feedbackLimitData');
      const violations = savedData ? JSON.parse(savedData).violations || 0 : 0;
      localStorage.setItem('feedbackLimitData', JSON.stringify({
        count: 0,
        blockedUntil: null,
        violations: violations
      }));
    }
  }, [cooldownTimer, isBlocked]);



  const handleFeedback = async (type) => {
    // Check if user is blocked
    if (isBlocked) return;

    try {
      // Store feedback in Firebase
      const feedbackValue = type === 'positive' ? 'good' : 'bad';
      await addDoc(collection(db, 'feedback'), {
        feedback: feedbackValue,
        timestamp: new Date()
      });

      const newCount = feedbackCount + 1;
      setFeedbackCount(newCount);
      setFeedbackGiven(true);

      // Check if user exceeded the limit (3 times)
      if (newCount >= 3) {
        const newViolations = violationCount + 1;
        setViolationCount(newViolations);
        
        // Progressive penalty: 1st violation = 1 min, 2nd = 5 min, 3rd = 15 min, 4th+ = 30 min
        let penaltyMinutes;
        if (newViolations === 1) {
          penaltyMinutes = 1;
        } else if (newViolations === 2) {
          penaltyMinutes = 5;
        } else if (newViolations === 3) {
          penaltyMinutes = 15;
        } else {
          penaltyMinutes = 30;
        }
        
        const penaltySeconds = penaltyMinutes * 60;
        const blockedUntil = Date.now() + (penaltySeconds * 1000);
        
        setIsBlocked(true);
        setCooldownTimer(penaltySeconds);
        setFeedbackGiven(false);
        
        // Save to localStorage with violation count
        localStorage.setItem('feedbackLimitData', JSON.stringify({
          count: newCount,
          blockedUntil: blockedUntil,
          violations: newViolations
        }));
        return;
      } else {
        // Update localStorage with current count and violations
        localStorage.setItem('feedbackLimitData', JSON.stringify({
          count: newCount,
          blockedUntil: null,
          violations: violationCount
        }));
      }
      
      // Reset feedback after 3 seconds
      setTimeout(() => {
        setFeedbackGiven(false);
      }, 3000);
    } catch (error) {
      console.error('Error storing feedback:', error);
      // Still show thank you message even if storage fails
      setFeedbackGiven(true);
      setTimeout(() => {
        setFeedbackGiven(false);
      }, 3000);
    }
  };

  // Format time display for longer durations
  const formatTime = (seconds) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-[#181816]" style={{ margin: 0, padding: 0 }}>
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
            className="bg-white/90 rounded-xl px-6 py-8 sm:px-12 sm:py-10 flex flex-col items-center w-11/12 max-w-sm sm:max-w-lg shadow-2xl border border-white/20"
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
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
      <div className="flex-1 flex flex-col items-center justify-center w-full" style={{ paddingBottom: showFeedbackBanner ? '80px' : '0px' }}>
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#ffffff] mb-2 sm:mb-4">
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
      {showFeedbackBanner && (
        <div 
          className="fixed bottom-0 w-full bg-[#1a1a1a] border-t border-gray-600 shadow-lg z-40 py-2 px-6"
          style={{
            animation: 'slideUpFromBottom 0.6s ease-out',
            WebkitAnimation: 'slideUpFromBottom 0.6s ease-out',
          }}
        >
          {isBlocked ? (
            <div className="text-center">
              <p className="text-red-400 font-medium text-sm sm:text-base mb-1">
                You exceeded the limit of chances to give feedback
                {violationCount > 1 && <span className="text-xs block">(Violation #{violationCount})</span>}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm">
                Try again in <span className="font-bold text-red-400">{formatTime(cooldownTimer)}</span>
              </p>
            </div>
          ) : !feedbackGiven ? (
            <div className="flex items-center justify-center space-x-6">
              <span className="text-white font-medium text-sm sm:text-base">
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
      )}
      
      {/* Inline keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUpFromBottom {
            from { 
              transform: translateY(100%);
              opacity: 0;
            }
            to { 
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;