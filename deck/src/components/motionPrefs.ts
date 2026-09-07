import { createContext, useContext } from 'react'

/* True when the OS asks for reduced motion or the deck was opened with ?static.
   Every animated component reads this, so both paths render the finished state. */
export const ReducedContext = createContext(false)
export const useReduced = () => useContext(ReducedContext)
