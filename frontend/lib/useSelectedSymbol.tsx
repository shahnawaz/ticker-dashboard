'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Ctx = { selected: string | null; setSelected: (s: string) => void };

const C = createContext<Ctx>({ selected: null, setSelected: () => {} });

export function SelectedSymbolProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem('symbol');
    if (saved) setSelected(saved);
  }, []);
  useEffect(() => {
    if (selected) localStorage.setItem('symbol', selected);
  }, [selected]);
  return <C.Provider value={{ selected, setSelected }}>{children}</C.Provider>;
}

export function useSelectedSymbol() {
  return useContext(C);
}
