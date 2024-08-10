import React, { useState, useEffect } from "react";
import "./CastControl.scss";
import CastWheel from "../CastWheel/CastWheel";

const CastControl = ({
  size,
  activeSquareId,
  setActiveSquareId,
  setFishingScene,
  activeBiome,
  getActiveBiome,
}) => {
  const [castScene, setCastScene] = useState("start");
  const [aim, setAim] = useState(0);
  const [power, setPower] = useState(0);
  const aimRange = (Math.sqrt(size) - 1) / 2;
  const powerRange = Math.sqrt(size) - 1;
  const [aimValue, setAimValue] = useState(0);
  const [powerValue, setPowerValue] = useState(0);
  const [aimDirection, setAimDirection] = useState(1);
  const [powerDirection, setPowerDirection] = useState(1); // Separate direction for power
  const aimIntervalDuration = 20;
  const powerIntervalDuration = 50;

  useEffect(() => {
    let interval;
    if (castScene === "start") {
      setAimValue(0);
      setAimDirection(1);
      setActiveSquareId(null);
      setPowerValue(0);
    } else if (castScene === "aim") {
      interval = setInterval(() => {
        setAimValue((prev) => {
          // Update value based on direction
          let newValue = prev + aimDirection;

          // Check bounds and update direction
          if (newValue > aimRange) {
            newValue = aimRange;
            setAimDirection(-1); // Change direction to down
          } else if (newValue < -aimRange) {
            newValue = -aimRange;
            setAimDirection(1); // Change direction to up
          }

          return newValue;
        });
      }, aimIntervalDuration);
    } else if (castScene === "power") {
      interval = setInterval(() => {
        setPowerValue((prev) => {
          // Update value based on direction
          let newValue = prev + powerDirection;

          // Check bounds and update direction
          if (newValue > powerRange) {
            newValue = powerRange;
            setPowerDirection(-1); // Change direction to down
          } else if (newValue < 0) {
            newValue = 0;
            setPowerDirection(1); // Change direction to up
          }
          return newValue;
        });
      }, powerIntervalDuration);
    } else if (castScene === "idle") {
      setAim(aimValue);
      setPower(powerValue);
      const landedOn = calculateSquare(aimValue, powerValue, size);
      setActiveSquareId(landedOn);
      getActiveBiome(landedOn);
    }

    return () => clearInterval(interval);
  }, [
    castScene,
    aimRange,
    aimDirection,
    aimValue,
    powerRange,
    powerDirection,
    powerValue,
    size,
    setActiveSquareId,
  ]);

  const handleNextScene = () => {
    if (castScene === "start") {
      setCastScene("aim");
    } else if (castScene === "aim") {
      setCastScene("power");
    } else if (castScene === "power") {
      setCastScene("idle");
    } else if (castScene === "idle") {
      setFishingScene("hook");
    }
  };

  const calculateSquare = (aim, power, size) => {
    const square = size - (Math.sqrt(size) + 1) / 2;
    const rowSize = Math.sqrt(size);
    const rowCalc = square - power * rowSize;
    const newSquare = rowCalc + aim;
    return newSquare;
  };

  return (
    <div className="cast-control">
      <div className="panel">
        {castScene === "start" && (
          <div className="castScene">
            <button className="panel-button" onClick={handleNextScene}>
              Cast
            </button>
          </div>
        )}
        {castScene !== "start" && castScene !== "idle" && (
          <div className="castScene">
            <CastWheel
              aim={aimValue.toFixed(0)}
              power={powerValue.toFixed(0)}
              aimRange={aimRange}
              powerRange={powerRange}
            />
          </div>
        )}
        {castScene === "aim" && (
          <div className="castScene">
            <button className="panel-button" onClick={handleNextScene}>
              Aim
            </button>
          </div>
        )}
        {castScene === "power" && (
          <div className="castScene">
            <button className="panel-button" onClick={handleNextScene}>
              Cast
            </button>
          </div>
        )}
        {castScene === "idle" && (
          <>
            <div>
              <h2>Landed on {activeBiome}</h2>
            </div>
            <div className="castScene">
              <button className="panel-button" onClick={handleNextScene}>
                Ok
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CastControl;
