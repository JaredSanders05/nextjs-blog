import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import { Dot } from './components/Dot';

const Home = () => {
  const numDots = 50;
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const dots = Array.from({ length: numDots }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    speedX: Math.random() - 0.5, // Random speed between -0.5 and 0.5
    speedY: Math.random() - 0.5,
  }));
  const range = 100;

  return (
    <div>
      <Canvas dots={dots} range={range} />
    </div>
  );
};

export default Home;