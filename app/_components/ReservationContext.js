"use client"

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();
const initialState = {from: undefined, to: undefined};

function ReservationProvider({children})
{
  const[range, SetRange] = useState(initialState);
  const ResetRange = () => SetRange(initialState);

  return (
  <ReservationContext.Provider value={{range, SetRange, ResetRange}}>
    {children}
  </ReservationContext.Provider>
  );
}

function useReservation()
{
  const context = useContext(ReservationContext);
  if(context === undefined) throw new Error("Context was used outside provider.");

  return context;
}

export {ReservationProvider, useReservation}