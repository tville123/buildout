import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const PaidContext = createContext<boolean>(false);

export function usePaid(): boolean {
  return useContext(PaidContext);
}

export function PaidProvider({ children }: { children: ReactNode }) {
  return <PaidContext.Provider value={false}>{children}</PaidContext.Provider>;
}
