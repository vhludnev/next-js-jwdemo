import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  preload: false,
  weight: ['500'],
  display: 'swap',
})

export const satoshi = localFont({
  src: '../../../public/fonts/Satoshi-Variable.woff2',
  style: 'normal',
  //weight: ['500', '600'],
  variable: '--font-satoshi',
  fallback: ['Roboto', 'sans-serif'],
  display: 'swap',
})
