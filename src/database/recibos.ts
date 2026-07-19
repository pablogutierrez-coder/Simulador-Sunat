import type { Recibo } from '../types'
import { clientes } from './clientes'

export const recibos: Recibo[] = [
  {
    id: 1,
    serie: 'E001',
    numero: '00000001',
    fechaEmision: '2026-07-15',
    usuarioRuc: '10456789123',
    cliente: clientes[0],
    servicio: {
      descripcion: 'Asesoria contable mensual',
      observacion: 'Registro inicial de entrenamiento',
      fechaPrestacion: '2026-07-15',
      rentaCuarta: true,
      afectoRetencion: true,
      monto: 1500,
      retencion: 120,
      totalNeto: 1380,
    },
    formaPago: 'CONTADO',
    estado: 'EMITIDO',
  },
]
