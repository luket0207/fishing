import React, { createContext, useReducer, useContext } from 'react';

// Define the initial state and reducer
const initialState = {
  money: 0,
  rep: 0,
  mapRowOne: [],
  mapRowTwo: [],
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_MONEY':
      return { ...state, money: action.payload };
    case 'SET_REP':
      return { ...state, rep: action.payload };
    case 'SET_MAP_ROW_ONE':
      return { ...state, mapRowOne: action.payload };
    case 'SET_MAP_ROW_TWO':
      return { ...state, mapRowTwo: action.payload };
    // Add other actions as needed
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// Create context
const GameContext = createContext();

// Create a provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Create a custom hook to use the game context
export function useGame() {
  return useContext(GameContext);
}
