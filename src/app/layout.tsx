'use client'
import Normal from "./components/normal";
import { useState, useEffect } from 'react';
import { Providers } from "./providers";

export default function  RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to 'light' theme if no value is present in local storage
      localStorage.setItem('theme', 'light');
    }
  }, []);
  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <html lang="en">
      <body data-theme={theme}>
    
    <div className={`app ${theme}`}>
      <button onClick={switchTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} Theme
      </button>
      </div>
      <Providers>{children}</Providers>
    </body>
    </html>
  );
}