import React, { useEffect, useRef, useState } from 'react';

interface HandControllerProps {
  onHandOpennessChange: (val: number) => void;
  isActive: boolean;
}

const HandController: React.FC<HandControllerProps> = ({ onHandOpennessChange, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const previousPixels = useRef<Uint8ClampedArray | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startVideo();

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
      cancelAnimationFrame(requestRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const w = 32; // Low res for performance
          const h = 24;
          canvas.width = w;
          canvas.height = h;
          
          // Draw video frame
          ctx.drawImage(video, 0, 0, w, h);
          const frame = ctx.getImageData(0, 0, w, h);
          const currentPixels = frame.data;
          
          let movementSum = 0;
          let skinPixelCount = 0;

          // Simple algorithm:
          // 1. Calculate movement (difference from previous frame) -> Reactivity
          // 2. Calculate "skin-like" pixels (rough YCrCb range) -> Presence
          
          for (let i = 0; i < currentPixels.length; i += 4) {
            const r = currentPixels[i];
            const g = currentPixels[i+1];
            const b = currentPixels[i+2];

            // Motion detection
            if (previousPixels.current) {
              const diff = Math.abs(r - previousPixels.current[i]) + 
                           Math.abs(g - previousPixels.current[i+1]) + 
                           Math.abs(b - previousPixels.current[i+2]);
              movementSum += diff;
            }

            // Very rough skin detection (Rule of thumb for RGB)
            // (R > 95) AND (G > 40) AND (B > 20) AND (Max - Min > 15) AND (|R-G| > 15) AND (R > G) AND (R > B)
            if (r > 95 && g > 40 && b > 20 && r > g && r > b && (Math.max(r,g,b) - Math.min(r,g,b) > 15)) {
              skinPixelCount++;
            }
          }

          previousPixels.current = new Uint8ClampedArray(currentPixels);

          // Normalize metrics
          // More movement = expanding
          // More skin pixels usually means open hand (vs closed fist which has less surface area visible or is shadowed)
          // This is a heuristic approximation for the demo.
          
          const totalPixels = w * h;
          const skinRatio = skinPixelCount / totalPixels;
          const movementRatio = Math.min(movementSum / (totalPixels * 50), 1.0); // Sensitivity

          // Combined metric: If moving a lot, expand. If huge skin area, expand.
          // Smooth it out
          const rawValue = Math.min((skinRatio * 2) + (movementRatio * 0.5), 1.0);
          
          onHandOpennessChange(rawValue);
        }
      }
      requestRef.current = requestAnimationFrame(processFrame);
    };

    requestRef.current = requestAnimationFrame(processFrame);
  }, [isActive, onHandOpennessChange]);

  return (
    <div className="hidden">
      <video ref={videoRef} playsInline muted />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default HandController;
