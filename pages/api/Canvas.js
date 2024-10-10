import React, { useRef, useEffect } from 'react';

const Canvas = ({ dots, range }) => {
  const canvasRef = useRef(null);

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
      dot.x += dot.speedX;
      dot.y += dot.speedY;

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
    animateDots();
  }, [dots]);

  return <canvas ref={canvasRef} width={typeof window !== 'undefined' ? window.innerWidth : 0} height={typeof window !== 'undefined' ? window.innerHeight : 0} />;
};

export default Canvas;
