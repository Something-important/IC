"use client"
import './css/globals.css'
import { Providers } from "./providers";
import useLocalStorage from 'use-local-storage'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');

  return (
    <html lang="en">
      <body data-theme={theme}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}