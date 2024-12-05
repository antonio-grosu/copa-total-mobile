import React, { createContext, useContext, useState } from "react";

// Create Context
const TournamentContext = createContext();

// Provider Component
export const TournamentProvider = ({ children }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  return (
    <TournamentContext.Provider
      value={{ selectedTournament, setSelectedTournament }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

// Hook to Use Tournament Context
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};
