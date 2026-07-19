import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { configuracion } from '../database/configuracion'
import type { DraftRecibo, FormaPago, Recibo, Servicio } from '../types'
import { nextNumber, todayIso } from '../utils/format'
import { loadRecibos, saveRecibos } from '../services/storage'
import { ReceiptContext } from './ReceiptStore'

export interface ReceiptContextValue {
  recibos: Recibo[]
  draft: DraftRecibo
  setCliente: (cliente: NonNullable<DraftRecibo['cliente']>) => void
  setServicio: (servicio: Servicio) => void
  setFormaPago: (formaPago: FormaPago) => void
  clearDraft: () => void
  emitir: (usuarioRuc: string) => Recibo | null
}

export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [recibos, setRecibos] = useState<Recibo[]>(() => loadRecibos())
  const [draft, setDraft] = useState<DraftRecibo>({})

  useEffect(() => {
    saveRecibos(recibos)
  }, [recibos])

  const setCliente = useCallback((cliente: NonNullable<DraftRecibo['cliente']>) => {
    setDraft((current) => ({ ...current, cliente }))
  }, [])

  const setServicio = useCallback((servicio: Servicio) => {
    setDraft((current) => ({ ...current, servicio }))
  }, [])

  const setFormaPago = useCallback((formaPago: FormaPago) => {
    setDraft((current) => ({ ...current, formaPago }))
  }, [])

  const clearDraft = useCallback(() => {
    setDraft({})
  }, [])

  const emitir = useCallback(
    (usuarioRuc: string) => {
      if (!draft.cliente || !draft.servicio || !draft.formaPago) {
        return null
      }

      const lastNumber = recibos
        .filter((item) => item.serie === configuracion.serie)
        .map((item) => item.numero)
        .sort()
        .at(-1)

      const nuevo: Recibo = {
        id: Math.max(0, ...recibos.map((item) => item.id)) + 1,
        serie: configuracion.serie,
        numero: nextNumber(lastNumber, configuracion.correlativoInicial),
        fechaEmision: todayIso(),
        usuarioRuc,
        cliente: draft.cliente,
        servicio: draft.servicio,
        formaPago: draft.formaPago,
        estado: 'EMITIDO',
      }

      setRecibos((current) => [...current, nuevo])
      return nuevo
    },
    [draft, recibos],
  )

  const value = useMemo(
    () => ({
      recibos,
      draft,
      setCliente,
      setServicio,
      setFormaPago,
      clearDraft,
      emitir,
    }),
    [clearDraft, draft, emitir, recibos, setCliente, setFormaPago, setServicio],
  )

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>
}
