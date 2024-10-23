import React, { useState, useEffect } from 'react';
import Canvas from './/api/Canvas';
import SpotifyNowPlaying from './api/Spotify';


// ?code=AQCDjBUne1_FCbqgamZwRrPpB0sPh8dBavRWGIfDGB0TKIhrd6olJ5FKY2lpnQRt1Em1sJQ5YicgGNZClk4vwwOHZAVzGOj83fxi5wAitGKfuoMaidQxbqGhIouYiGsBFMXPlGY-RXEfUXNbOi4UFomb0FkScl5LfKOib66HTAUAyRPiAW34-_GPC2lb0uhHmP16nyrJ1a9VS2bWLWYgmpfIbDFklHXS-cXAotr8BsXtJ8kiLUrork8OMtNvUV4CcPTTf_Mi8We_8aFZQ7IpcA
// N2Q3OTVlZWJmYmU0NGQzZGI1OWQ1NjkxMDA2Y2QzNGQ6YzE4MTFlN2Q0Y2VlNGVmYmJlNTk4YTlkMTE0MGQwZDI=
// curl -H "Authorization: Basic N2Q3OTVlZWJmYmU0NGQzZGI1OWQ1NjkxMDA2Y2QzNGQ6YzE4MTFlN2Q0Y2VlNGVmYmJlNTk4YTlkMTE0MGQwZDI=" -d grant_type=authorization_code -d code=AQCDjBUne1_FCbqgamZwRrPpB0sPh8dBavRWGIfDGB0TKIhrd6olJ5FKY2lpnQRt1Em1sJQ5YicgGNZClk4vwwOHZAVzGOj83fxi5wAitGKfuoMaidQxbqGhIouYiGsBFMXPlGY-RXEfUXNbOi4UFomb0FkScl5LfKOib66HTAUAyRPiAW34-_GPC2lb0uhHmP16nyrJ1a9VS2bWLWYgmpfIbDFklHXS-cXAotr8BsXtJ8kiLUrork8OMtNvUV4CcPTTf_Mi8We_8aFZQ7IpcA -d redirect_uri=http://localhost:3000 https://accounts.spotify.com/api/token
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
          <p>I’m a dedicated student with a passion for coding 
            that began in high school. I’m driven by the goal of
             creating revolutionary technology and am always 
             eager to learn and grow, welcoming constructive 
             criticism to improve my skills.</p> 
        </div>
      <div className="spotify-container">
        <SpotifyNowPlaying />
      </div>
    </div>

  );
};

export default Home;
