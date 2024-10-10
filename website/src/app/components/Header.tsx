// components/Navbar.tsx
import React from "react";
import "@/app/styles/Home.css"

const Navbar = () => {
  return (
    <div className="bar">
      <div className="links">
        <span className="link" style={{cursor: 'pointer'}} 
              onClick={() => {
                  window.location.href=`/`;
              }}
              >
                Home
        </span>
        <span className="link" style={{cursor: 'pointer'}} 
              onClick={() => {
                  window.location.href=`/projects`;
              }}
              >
                Projects
        </span>
        <span className="link" style={{cursor: 'pointer'}} 
            onClick={() => {
                window.location.href=`/about`;
            }}
            >
              About
        </span>
        <span className="link" style={{cursor: 'pointer'}} 
            onClick={() => {
                window.location.href=`/contact`;
            }}
            >
              Contact
        </span>
        
      </div>
         
    </div>
  );
};

export default Navbar;
