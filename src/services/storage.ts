import type { Recibo } from '../types'
import { recibos as seedRecibos } from '../database/recibos'

const RECEIPTS_KEY = 'rhe-simulador.recibos'

export const loadRecibos = (): Recibo[] => {
  let stored: string | null = null

  try {
    stored = window.localStorage.getItem(RECEIPTS_KEY)
  } catch {
    return seedRecibos
  }

  if (!stored) {
    return seedRecibos
  }

  try {
    const parsed = JSON.parse(stored) as Recibo[]
    return parsed.length > 0 ? parsed : seedRecibos
  } catch {
    return seedRecibos
  }
}

export const saveRecibos = (items: Recibo[]): void => {
  try {
    window.localStorage.setItem(RECEIPTS_KEY, JSON.stringify(items))
  } catch {
    // In embedded lessons, storage can be blocked. The in-memory React state still works.
  }
}

export const clearRecibos = (): void => {
  try {
    window.localStorage.removeItem(RECEIPTS_KEY)
  } catch {
    // Ignore storage failures in restricted iframe contexts.
  }
}
