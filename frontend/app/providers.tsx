'use client';
import { SelectedSymbolProvider } from '../lib/useSelectedSymbol';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SelectedSymbolProvider>{children}</SelectedSymbolProvider>;
}
