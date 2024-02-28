'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ThemeIcon from './ThemeIcon'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <ThemeIcon />
      <div
        id='sunmoon'
        className={theme === 'light' ? 'sun' : ''}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      ></div>
    </>
  )
}

export default ThemeSwitcher
