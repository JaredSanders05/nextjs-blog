import React, { useState, useEffect } from 'react';
import Canvas from './/api/Canvas';


const Home = () => {
  const numDots = 50;
  const [canvasWidth, setCanvasWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [canvasHeight, setCanvasHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);

  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
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
      <div className="centered-text">
        <h1>Hey, I'm Jared Sanders.</h1>
        <p>I'm a computer science student</p>
      </div>
    </div>
  );
};

export default Home;
