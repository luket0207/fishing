import React, { useState } from 'react';
import './Display.scss';

const Display = ({state, size}) => {

  return (
    <>
    <div><p>{size}</p></div>
    <div className="display-container">
      <div className={`float ${state}`} style={{ '--size': 50 }} />
    </div>
    </>
  );
};

export default Display;
