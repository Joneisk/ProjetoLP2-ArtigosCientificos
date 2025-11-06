// src/lib/utils.ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Junta classes condicionalmente e aplica merge de Tailwind
 * Exemplo: cn('px-2', isActive && 'bg-blue-500')
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
