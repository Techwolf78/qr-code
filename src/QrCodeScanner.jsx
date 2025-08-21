import React, { useRef, useState, useEffect, useCallback } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function QrCodeScanner() {
  const [message, setMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const timeoutRefs = useRef([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Firebase function to verify HR
  const verifyEmployeeAccess = async (employeeId) => {
    try {
      const employeeQuery = query(collection(db, 'guests'), where('id', '==', employeeId));
      const querySnapshot = await getDocs(employeeQuery);
      
      if (!querySnapshot.empty) {
        const employeeDoc = querySnapshot.docs[0];
        const employeeData = employeeDoc.data();
        return {
          status: 'success',
          name: employeeData.name || 'Guest',
          id: employeeId,
          confirmed: employeeData.confirmed,
          reached: employeeData.reached
        };
      } else {
        return { status: 'not_found' };
      }
    } catch (error) {
      console.error('Firebase query error:', error);
      return { status: 'error' };
    }
  };

  // Process scanned QR code
  const handleScanResult = useCallback(async (scannedResult) => {
    // Prevent multiple scans while processing
    if (scannedResult && isScanning && !isProcessing) {
      console.log("QR Scanned at:", new Date().toLocaleTimeString());
      
      // Immediately set processing state to prevent multiple scans
      setIsProcessing(true);
      setIsScanning(false);
      
      // Clear any existing timeouts
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current = [];
      
      // Stop the camera immediately to prevent further scanning
      if (controlsRef.current) {
        try {
          controlsRef.current.stop();
        } catch (e) {
          console.warn("Error stopping camera:", e);
        }
        controlsRef.current = null;
      }
      
      const employeeId = scannedResult.trim();
      setMessage("Verifying attendance...");

      try {
        const verification = await verifyEmployeeAccess(employeeId);
        
        if (verification.status === 'success') {
          const statusMessage = verification.confirmed === 'confirmed' 
            ? `Welcome back, ${verification.name}! ✓ Confirmed Guest`
            : `Hello ${verification.name}! Please check your confirmation status`;
          setMessage(statusMessage);
        } else if (verification.status === 'not_found') {
          setMessage("Guest ID not found in database");
        } else {
          setMessage("System error - Please try again");
        }

        // Show message for 3 seconds, then clear and wait 2 more seconds before restarting camera
        const messageTimeout = setTimeout(() => {
          console.log("Message cleared at:", new Date().toLocaleTimeString());
          setMessage(""); // Clear message after 3 seconds
          
          const restartTimeout = setTimeout(() => {
            console.log("Camera restarting at:", new Date().toLocaleTimeString());
            setIsProcessing(false); // Reset processing state
            startCamera(); // Use the existing startCamera function
          }, 2000);
          
          timeoutRefs.current.push(restartTimeout);
        }, 3000);
        
        timeoutRefs.current.push(messageTimeout);

      } catch (error) {
        console.error("Verification error:", error);
        setMessage("System error - Please try again");
        
        const messageTimeout = setTimeout(() => {
          console.log("Message cleared at:", new Date().toLocaleTimeString());
          setMessage(""); // Clear message after 3 seconds
          
          const restartTimeout = setTimeout(() => {
            console.log("Camera restarting at:", new Date().toLocaleTimeString());
            setIsProcessing(false); // Reset processing state
            startCamera(); // Use the existing startCamera function
          }, 2000);
          
          timeoutRefs.current.push(restartTimeout);
        }, 3000);
        
        timeoutRefs.current.push(messageTimeout);
      }
    }
  }, [isScanning, isProcessing, startCamera]);

  // Start camera function (initial start only)
  const startCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video || isProcessing) return;

    try {
      setIsLoading(true);
      codeReaderRef.current = new BrowserQRCodeReader();
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      
      if (devices.length > 0) {
        controlsRef.current = await codeReaderRef.current.decodeFromVideoDevice(
          devices[0].deviceId,
          video,
          (result, err) => {
            if (result && !isProcessing) {
              handleScanResult(result.getText());
            }
            if (err && !['NotFoundException', 'NotFoundException2', 'IndexSizeError', 'ChecksumException2', 'FormatException2'].includes(err.name)) {
              console.warn("QR scan error:", err);
            }
          }
        );
        
        setIsLoading(false);
        setTimeout(() => {
          if (!isProcessing) {
            setIsScanning(true);
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setMessage("Camera access required");
      setIsLoading(false);
    }
  }, [handleScanResult, isProcessing]);

  // Start camera automatically
  useEffect(() => {
    const video = videoRef.current;
    startCamera();

    return () => {
      // Clear all timeouts
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current = [];
      
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      if (video && video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          @keyframes scanLine {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(400px); opacity: 0; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes success {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .scan-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 280px;
            height: 280px;
            border: 3px solid rgba(56, 189, 248, 0.8);
            border-radius: 24px;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(4px);
          }
          
          .scan-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #38bdf8, transparent);
            animation: scanLine 2s ease-in-out infinite;
          }
          
          .corner {
            position: absolute;
            width: 24px;
            height: 24px;
            border: 3px solid #38bdf8;
          }
          
          .corner-tl { top: -3px; left: -3px; border-right: none; border-bottom: none; border-radius: 16px 0 0 0; }
          .corner-tr { top: -3px; right: -3px; border-left: none; border-bottom: none; border-radius: 0 16px 0 0; }
          .corner-bl { bottom: -3px; left: -3px; border-right: none; border-top: none; border-radius: 0 0 0 16px; }
          .corner-br { bottom: -3px; right: -3px; border-left: none; border-top: none; border-radius: 0 0 16px 0; }
          
          @media (max-width: 768px) {
            .scan-overlay {
              width: 240px;
              height: 240px;
            }
          }
        `}
      </style>
      
      <div style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden"
      }}>
        
        {/* Header */}
        <header style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
          padding: "16px 24px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
              }}>
                📊
              </div>
              <div>
                <h1 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0,
                  lineHeight: 1
                }}>
                  AttendanceTracker
                </h1>
                <p style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  Guest Check-in System
                </p>
              </div>
            </div>
            
            <a 
              href="/admin"
              style={{
                padding: "8px 16px",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "8px",
                color: "#3b82f6",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(59, 130, 246, 0.15)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(59, 130, 246, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ⚙️ Admin
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          paddingTop: "28px",
          display: "flex",
          flexDirection: "column"
        }}>
          
          {/* Time & Date Section */}
          <section style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            margin: "20px",
            borderRadius: "20px",
            padding: "4px",
            textAlign: "center",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#1e293b",
              letterSpacing: "-0.02em",
              marginBottom: "4px",
              fontVariantNumeric: "tabular-nums"
            }}>
              {formatTime(currentTime)}
            </div>
            <div style={{
              fontSize: "16px",
              color: "#64748b",
              fontWeight: "500"
            }}>
              {formatDate(currentTime)}
            </div>
          </section>

          {/* Scanner Section */}
          <section style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            margin: "0 20px 20px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            position: "relative",
            minHeight: "500px"
          }}>
            
            {/* Scanner Header */}
            <div style={{
              padding: "24px 24px 16px",
              borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
              background: "rgba(248, 250, 252, 0.8)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px"
              }}>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: 0
                }}>
                  QR Code Scanner
                </h2>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  background: isScanning ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${isScanning ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: isScanning ? "#16a34a" : "#dc2626"
                }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isScanning ? "#16a34a" : "#dc2626",
                    animation: isScanning ? "pulse 2s infinite" : "none"
                  }} />
                  {isScanning ? "Active" : "Standby"}
                </div>
              </div>
              <p style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
                lineHeight: 1.5
              }}>
                Position your Guest ID card in front of the camera
              </p>
            </div>

            {/* Camera Section */}
            <div style={{
              flex: 1,
              position: "relative",
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px"
            }}>
              
              {isLoading && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0, 0, 0, 0.8)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                  color: "#fff"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid rgba(56, 189, 248, 0.3)",
                    borderTop: "4px solid #38bdf8",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "16px"
                  }} />
                  <p style={{ fontSize: "16px", margin: 0 }}>Initializing camera...</p>
                </div>
              )}

              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
                autoPlay
                muted
                playsInline
              />
              
              {/* Scanning Overlay */}
              {isScanning && !message && (
                <div className="scan-overlay">
                  <div className="scan-line" />
                  <div className="corner corner-tl" />
                  <div className="corner corner-tr" />
                  <div className="corner corner-bl" />
                  <div className="corner corner-br" />
                </div>
              )}

              {/* Instruction Text */}
              {isScanning && !message && (
                <div style={{
                  position: "absolute",
                  bottom: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.7)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "center",
                  animation: "slideIn 0.5s ease-out"
                }}>
                  📱 Hold your ID card steady in the frame
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Status Message Overlay */}
        {message && (
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: message.includes("Welcome") ? 
              "linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))" :
              message.includes("not found") ?
              "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))" :
              "linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(29, 78, 216, 0.95))",
            color: "#fff",
            padding: "32px 48px",
            borderRadius: "20px",
            fontSize: "20px",
            fontWeight: "600",
            textAlign: "center",
            zIndex: 9999,
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            animation: "success 0.5s ease-out",
            maxWidth: "90vw"
          }}>
            <div style={{ marginBottom: "8px" }}>
              {message.includes("Welcome") ? "✅" : 
               message.includes("not found") ? "❌" : "⏳"}
            </div>
            <div>{message}</div>
            {!isScanning && (
              <div style={{ 
                fontSize: '14px', 
                marginTop: '12px', 
                opacity: 0.9,
                fontWeight: "400"
              }}>
                Please wait...
              </div>
            )}
          </div>
        )}

        {/* Additional CSS for spinner animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </>
  );
}
