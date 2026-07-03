import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Camera, RefreshCw } from 'lucide-react';

export function Scanner({ onColorsDetected }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setScanning(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      try {
        // Convert base64 to blob
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');
        
        const response = await axios.post('http://127.0.0.1:5000/api/scan', formData);
        if (response.data.status === 'success') {
          onColorsDetected(response.data.colors);
        }
      } catch (error) {
        console.error("Failed to scan face", error);
      }
    }
    setScanning(false);
  }, [webcamRef, onColorsDetected]);

  return (
    <div className="scanner-container">
      <div className="webcam-wrapper">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
          className="webcam"
        />
        <div className="scanner-overlay">
          {/* Overlay a 3x3 grid for user alignment */}
          <div className="grid-overlay">
            {[...Array(9)].map((_, i) => <div key={i} className="grid-cell" />)}
          </div>
        </div>
      </div>
      
      <button 
        className="scan-button primary-button" 
        onClick={capture}
        disabled={scanning}
      >
        {scanning ? <RefreshCw className="spin" /> : <Camera />}
        <span>Scan Face</span>
      </button>
    </div>
  );
}
