import React, { useState } from "react";

import "./Snag.scss";

const Snag = (
  {biomeSnagModifier,
  endHook}
) => {
  const [attempt, setAttempt] = useState(0);
  const rodSnagModifier = 50;
  const lineSnagModifier = 50;

  const RandomNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  const calculateStrikeSnag = () => {
    const snagSave = rodSnagModifier + lineSnagModifier;

    if (RandomNumber(300 + attempt) < snagSave) {
      //freed
      console.log("Freed");
      endHook();
    } else {
      //not free
      if (RandomNumber(100) > (biomeSnagModifier + attempt)) {
        setAttempt(attempt + 10);
        console.log("Still Stuck");
        //still stuck
      } else {
        //broke
        if (RandomNumber(100) > 60) {
          lineBreak();
        } else {
          rodBreak();
        }
      }
    }
  };

  const calculateReelSnag = () => {
    const snagSave = (rodSnagModifier / 2) + lineSnagModifier;

    if (RandomNumber(300) < (snagSave + attempt)) {
      //freed
      console.log("Freed");
      endHook();
    } else {
      //not free
      if (RandomNumber(100) > (biomeSnagModifier + attempt)) {
        setAttempt(attempt + 10);
        console.log("Still Stuck");
        //still stuck
      } else {
        //broke
        if (RandomNumber(100) > 5) {
          lineBreak();
        } else {
          rodBreak();
        }
      }
    }
  };

  const lineBreak = () => {
    console.log("Break Line");
    endHook();
  };

  const rodBreak = () => {
    console.log("Break Rod");
    endHook();
  };

  return (
    <div className="hook-snag">
      <p>{attempt / 10}</p>
      <button onClick={calculateStrikeSnag}>Strike</button>
      <button onClick={calculateReelSnag}>Reel</button>
      <button onClick={lineBreak}>Cut Line</button>
    </div>
  );
};

export default Snag;
