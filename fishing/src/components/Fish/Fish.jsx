import React, { useState } from "react";
import "./Fish.scss";
import { useGame } from "../../GameContext";

// Utility function to adjust color brightness
function adjustColorBrightness(color, amount) {
  let usePound = false;

  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;

  r = Math.min(Math.max(0, r), 255);
  g = Math.min(Math.max(0, g), 255);
  b = Math.min(Math.max(0, b), 255);

  return (usePound ? "#" : "") + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const Fish = ({ id, size = "small" }) => {
  const { state } = useGame();
  const [isHovered, setIsHovered] = useState(false);

  const fish = state.fishSpecies ? state.fishSpecies[id - 1] : null;
  const { colourOne, colourTwo, name, pattern, shape, minSize, maxSize } = fish;

  if (!fish) return <div className="fish">Fish not found</div>;

  // Determine the secondary pattern color (15% lighter)
  const patternColorSecondary = adjustColorBrightness(colourOne, 30);

  return (
    <div
      className={`fish ${size} ${shape}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="fish-tail" style={{ backgroundColor: colourTwo }}></div>
      <div className="fish-topFin" style={{ backgroundColor: colourTwo }}></div>
      <div className="fish-bottomFin" style={{ backgroundColor: colourTwo }}></div>
      <div className="fish-body" style={{ backgroundColor: colourOne }}>
        <div
          className={`fish-body-pattern ${pattern}`}
          style={{
            '--pattern-color': colourOne,
            '--pattern-color-secondary': patternColorSecondary,
          }}
        ></div>
      </div>
      <div className="fish-sideFin" style={{ backgroundColor: colourTwo }}></div>
      <div className="fish-eye"></div> 
      {isHovered && <div className="tooltip"><p>{name}</p></div>}
    </div>
  );
};

export default Fish;
