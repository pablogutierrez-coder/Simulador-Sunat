import { useMemo } from 'react'
import type { Recibo } from '../types'

export const useReceiptSearch = (recibos: Recibo[], query: string): Recibo[] => {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return recibos
    }

    return recibos.filter((recibo) => {
      const values = [
        recibo.cliente.numero,
        recibo.cliente.razonSocial,
        recibo.serie,
        recibo.numero,
        `${recibo.serie}-${recibo.numero}`,
      ]
      return values.some((value) => value.toLowerCase().includes(normalized))
    })
  }, [query, recibos])
}
