import type { Recibo } from '../types'
import { recibos as seedRecibos } from '../database/recibos'

const RECEIPTS_KEY = 'rhe-simulador.recibos'

export const loadRecibos = (): Recibo[] => {
  const stored = window.localStorage.getItem(RECEIPTS_KEY)
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
  window.localStorage.setItem(RECEIPTS_KEY, JSON.stringify(items))
}

export const clearRecibos = (): void => {
  window.localStorage.removeItem(RECEIPTS_KEY)
}
