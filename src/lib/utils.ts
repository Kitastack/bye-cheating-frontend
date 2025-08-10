import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

type UnixTimeFormat = number
export function calculateTimesRemaining(timestamp: number): UnixTimeFormat {
  const now = Math.floor(Date.now() / 1000)
  const timestampRemaining = timestamp - now
  return timestampRemaining
}
