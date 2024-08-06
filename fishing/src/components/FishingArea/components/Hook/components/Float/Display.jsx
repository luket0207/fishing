import React, { useState, useEffect } from "react";
import "./Display.scss";

const Display = ({ state, size }) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    let intervalTime;

    switch (state) {
      case "rest":
        intervalTime = 2000;
        break;
      case "tease":
      case "fake":
        intervalTime = 1000;
        break;
      case "nibble":
        intervalTime = 500;
        break;
      default:
        intervalTime = 2000;
    }

    const interval = setInterval(() => {
      setRipples((prevRipples) => [
        ...prevRipples,
        { id: Date.now() },
      ]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [state]);

  const handleAnimationEnd = (id) => {
    setRipples((prevRipples) => prevRipples.filter((ripple) => ripple.id !== id));
  };

  return (
    <div className="display-container">
      <div className="ripple-container">
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="ripple"
            onAnimationEnd={() => handleAnimationEnd(ripple.id)}
          ></div>
        ))}
      </div>
      <div className="float-overflow">
        <div className={`float ${state}`} style={{ "--size": size + 5 }} />
      </div>
    </div>
  );
};

export default Display;
