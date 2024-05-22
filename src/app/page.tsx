"use client"
import Advanced from "./components/advanced"
import Normal from "./components/normal"
import { useState } from "react";
import Link from "next/link";
import useLocalStorage from 'use-local-storage'

export default function swap() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
  const [isNormal, setIsNormal] = useState(true);

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  return (
    <div className="app" >
      <button onClick={switchTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} Theme
      </button>
      <Normal />
    </div>

  );
}