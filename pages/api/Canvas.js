import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ dots, range }) => {
  const canvasRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(1920);
  const [screenHeight, setScreenHeight] = useState(1080);

  const animateDots = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach((dot) => {
      context.beginPath();
      context.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
      context.fill();
      dot.x += dot.speedX * 4;
      dot.y += dot.speedY * 4;

      // Adjust boundary conditions as needed
      if (dot.x <= -10 || dot.x >= canvas.width + 10 || dot.y <= -10 || dot.y >= canvas.height + 10) {
        const edge = Math.floor(Math.random() * 4);

        let x, y;

        switch (edge) {
          case 0: // Top edge
            x = Math.random() * canvas.width;
            y = -10;
            break;
          case 1: // Bottom edge
            x = Math.random() * canvas.width;
            y = canvas.height + 10;
            break;
          case 2: // Left edge
            x = -10;
            y = Math.random() * canvas.height;
            break;
          case 3: // Right edge
            x = canvas.width + 10;
            y = Math.random() * canvas.height;
            break;
          default:
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        }
        dot.x = x;
        dot.y = y;
        dot.speedX = Math.random() - 0.5; // Random speed between -0.5 and 0.5
        dot.speedY = Math.random() - 0.5;
      }

      // Draw lines between dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < range) {
            const opacity = Math.pow(1 - distance / range, 4);
            context.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
            context.beginPath();
            context.moveTo(dots[i].x, dots[i].y);
            context.lineTo(dots[j].x, dots[j].y);
            context.stroke();
          }
        }
      }
    });

    requestAnimationFrame(animateDots);
  };

  useEffect(() => {
    // Update screen dimensions when the window resizes
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    // Initial call to set the width and height when the window is first defined
    handleResize();

    animateDots();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dots]);

  return (
      <canvas
        ref={canvasRef}
        width={screenWidth}
        height={screenHeight}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      />
  );
};

export default Canvas;
