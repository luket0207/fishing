import React, { createContext, useReducer, useContext } from "react";

// Define the initial state and reducer
const initialState = {
  money: 0,
  rep: 0,
  mapRowOne: [],
  mapRowTwo: [],
  fishSpecies: [],
};

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_MONEY":
      return { ...state, money: action.payload };
    case "SET_REP":
      return { ...state, rep: action.payload };
    case "SET_DAY":
      return { ...state, day: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };

    // Maps
    case "SET_MAP_ROW_1":
      return { ...state, mapRow1: action.payload };
    case "SET_MAP_ROW_2":
      return { ...state, mapRow2: action.payload };
    case "SET_MAP_ROW_3":
      return { ...state, mapRow3: action.payload };
    case "SET_MAP_ROW_4":
      return { ...state, mapRow4: action.payload };
    case "SET_MAP_ROW_5":
      return { ...state, mapRow5: action.payload };
    case "SET_MAP_ROW_6":
      return { ...state, mapRow6: action.payload };

    //Fish
    case "SET_FISH_SPECIES":
      return { ...state, fishSpecies: action.payload };

    //Equipment
    case "SET_EQ_CURRENT":
      return { ...state, currentEqiptment: action.payload };
    case "SET_EQ_RODS":
      return { ...state, rods: action.payload };
    case "SET_EQ_HOOKS":
      return { ...state, hooks: action.payload };
    case "SET_EQ_LINE":
      return { ...state, line: action.payload };
    case "SET_EQ_FLOATS":
      return { ...state, floats: action.payload };
    case "SET_EQ_TACKLE":
      return { ...state, tackle: action.payload };

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
