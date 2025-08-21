import React, { useRef, useState, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import ConfettiEffect from "./ConfettiEffect";

function QROverlay({ scanning }) {
  if (!scanning) return null;
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 180,
      height: 180,
      border: "3px solid #fff",
      borderRadius: 12,
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
      zIndex: 10,
      pointerEvents: "none"
    }}>
      <div style={{
        position: "absolute",
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        border: "2px solid #3b82f6",
        borderRadius: 12,
        animation: "scanPulse 2s infinite"
      }} />
      <style>
        {`
        @keyframes scanPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        `}
      </style>
      {/* Corner brackets */}
      <div style={{ position: "absolute", top: -8, left: -8, width: 24, height: 24, borderTop: "4px solid #3b82f6", borderLeft: "4px solid #3b82f6", borderRadius: "4px 0 0 0" }} />
      <div style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderTop: "4px solid #3b82f6", borderRight: "4px solid #3b82f6", borderRadius: "0 4px 0 0" }} />
      <div style={{ position: "absolute", bottom: -8, left: -8, width: 24, height: 24, borderBottom: "4px solid #3b82f6", borderLeft: "4px solid #3b82f6", borderRadius: "0 0 0 4px" }} />
      <div style={{ position: "absolute", bottom: -8, right: -8, width: 24, height: 24, borderBottom: "4px solid #3b82f6", borderRight: "4px solid #3b82f6", borderRadius: "0 0 4px 0" }} />
    </div>
  );
}

export default function QrCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  // Start scanning
  const startScan = async () => {
    setError("");
    setResult("");
    setShowPopup(false);
    setShowConfetti(false);
    setIsLoading(true);
    setScanning(true);

    try {
      codeReaderRef.current = new BrowserQRCodeReader();
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId;
      if (!deviceId) {
        setError("No camera found.");
        setScanning(false);
        setIsLoading(false);
        return;
      }
      codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            setResult(result.getText());
            setShowPopup(true);
            setShowConfetti(true);
            stopScan();
          }
          if (err && err.name !== "NotFoundException") {
            setError("Error scanning QR code.");
          }
        }
      );
      setIsLoading(false);
    } catch {
      setError("Camera access denied or unavailable.");
      setScanning(false);
      setIsLoading(false);
    }
  };

  // Stop scanning
  const stopScan = () => {
    setScanning(false);
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopScan();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <ConfettiEffect trigger={showConfetti} />
      <div style={{
        background: "#fff",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.06)",
        padding: 40,
        width: "100%",
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backdropFilter: "blur(10px)"
      }}>
        {/* App Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            fontSize: 48, 
            marginBottom: 12,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>📱</div>
          <h1 style={{ 
            fontWeight: 800, 
            fontSize: 28, 
            marginBottom: 8,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>QR Scanner</h1>
          <p style={{ 
            color: "#64748b", 
            fontSize: 16, 
            lineHeight: 1.5,
            margin: 0
          }}>
            Point your camera at a QR code to scan
          </p>
        </div>

        {/* Camera Preview */}
        <div style={{
          width: "100%",
          height: 280,
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: 16,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          border: "3px solid transparent",
          backgroundImage: scanning 
            ? "linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(white, white), linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "content-box, border-box"
        }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 12,
              opacity: scanning ? 1 : 0,
              transition: "opacity 0.4s ease"
            }}
            autoPlay
            muted
            playsInline
          />
          {!scanning && (
            <div style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16
            }}>
              <div style={{ 
                fontSize: 64, 
                opacity: 0.4,
                filter: "grayscale(1)"
              }}>📷</div>
              <span style={{ 
                color: "#94a3b8", 
                fontSize: 16,
                fontWeight: 500
              }}>Camera Preview</span>
            </div>
          )}
          <QROverlay scanning={scanning} />
        </div>

        {/* Action Button */}
        <button
          onClick={scanning ? stopScan : startScan}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 12,
            border: "none",
            background: isLoading 
              ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
              : scanning
              ? "linear-gradient(90deg, #ef4444, #dc2626)"
              : "linear-gradient(90deg, #667eea, #764ba2)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            cursor: isLoading ? "not-allowed" : "pointer",
            marginBottom: error ? 16 : 0,
            transition: "all 0.3s ease",
            transform: "translateY(0)",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
          }}
        >
          {isLoading ? "Starting Camera..." : scanning ? "⏹ Stop Scanning" : "📸 Start Scanning"}
        </button>

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: "#ef4444", 
            fontSize: 14, 
            textAlign: "center",
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: 8,
            border: "1px solid rgba(239, 68, 68, 0.2)",
            width: "100%"
          }}>
            <strong>⚠️ {error}</strong>
          </div>
        )}
      </div>
      {/* Success Popup */}
      {showPopup && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.3s ease"
        }}>
          <style>
            {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            `}
          </style>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            minWidth: 300,
            maxWidth: 400,
            margin: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            textAlign: "center",
            animation: "slideUp 0.4s ease"
          }}>
            <div style={{ 
              fontSize: 48, 
              marginBottom: 16,
              color: "#10b981"
            }}>✓</div>
            <h3 style={{ 
              fontWeight: 700, 
              fontSize: 24, 
              marginBottom: 12,
              color: "#1f2937"
            }}>
              Success!
            </h3>
            <p style={{ 
              color: "#6b7280", 
              fontSize: 16, 
              marginBottom: 8,
              fontWeight: 500
            }}>
              Welcome
            </p>
            <div style={{
              color: "#1f2937",
              fontSize: 18,
              fontWeight: 600,
              wordBreak: "break-all",
              marginBottom: 24,
              padding: "16px",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: 12,
              border: "1px solid rgba(102, 126, 234, 0.2)"
            }}>{result}</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  color: "#374151",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#fff";
                }}
              >📋 Copy</button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setShowConfetti(false);
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >✨ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
