import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers';
import ThemeInit from './theme-init';
import ThemeToggle from '../components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'Real-Time Trading Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <Providers>
          <ThemeInit />
          <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur dark:bg-gray-900/70">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight">Real‑Time Trading Dashboard</h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500 dark:text-gray-400">
            Built for MultiBank Group challenge
          </footer>
        </Providers>
      </body>
    </html>
  );
}
