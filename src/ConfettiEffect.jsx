// Simple confetti effect using canvas for React
// Usage: <ConfettiEffect trigger={boolean} />
import { useEffect, useRef } from 'react';

function randomColor() {
  const colors = ['#FFC700', '#FF0000', '#2E3192', '#41BBC7', '#7CFC00', '#FF69B4'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const ConfettiEffect = ({ trigger }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const confetti = useRef([]);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    confetti.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 40 + 10,
      color: randomColor(),
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      confetti.current.forEach(c => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.d / 5);
        ctx.stroke();
      });
      update();
      frame++;
      if (frame < 120) {
        animationRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    function update() {
      confetti.current.forEach(c => {
        c.y += Math.cos(c.d) + 2 + c.r / 2;
        c.x += Math.sin(0.01) * 2;
        c.tiltAngle += c.tiltAngleIncremental;
        c.tilt = Math.sin(c.tiltAngle) * 15;
        if (c.y > height) {
          c.x = Math.random() * width;
          c.y = -10;
        }
      });
    }
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [trigger]);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" style={{display: trigger ? 'block' : 'none'}} />
  );
};

export default ConfettiEffect;
