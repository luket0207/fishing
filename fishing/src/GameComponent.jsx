import React from 'react';
import { useGame } from './GameContext';

function GameComponent() {
  const { state, dispatch } = useGame();

  const increaseMoney = () => {
    dispatch({ type: 'SET_MONEY', payload: state.money + 10 });
  };

  return (
    <div>
      <h1>Money: {state.money}</h1>
      <button onClick={increaseMoney}>Earn Money</button>
    </div>
  );
}

export default GameComponent;
