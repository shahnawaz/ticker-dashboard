'use client';
import { useEffect } from 'react';
export default function ThemeInit() {
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldDark);
  }, []);
  return null;
}
