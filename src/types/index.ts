export type TipoDocumento = 'RUC' | 'DNI'

export type FormaPago = 'CONTADO' | 'CREDITO'

export type EstadoRecibo = 'BORRADOR' | 'EMITIDO' | 'ANULADO'

export interface Usuario {
  id: number
  ruc: string
  usuario: string
  clave: string
  nombre: string
}

export interface Cliente {
  id: number
  tipoDocumento: TipoDocumento
  numero: string
  razonSocial: string
  direccion?: string
}

export interface Pago {
  id: number
  reciboId: number
  formaPago: FormaPago
  monto: number
  fecha: string
}

export interface Servicio {
  descripcion: string
  observacion: string
  fechaPrestacion: string
  rentaCuarta: boolean
  afectoRetencion: boolean
  monto: number
  retencion: number
  totalNeto: number
}

export interface Recibo {
  id: number
  serie: string
  numero: string
  fechaEmision: string
  usuarioRuc: string
  cliente: Cliente
  servicio: Servicio
  formaPago: FormaPago
  estado: EstadoRecibo
}

export interface Configuracion {
  serie: string
  correlativoInicial: number
  moneda: string
  tasaRetencion: number
}

export interface DraftRecibo {
  cliente?: Cliente
  servicio?: Servicio
  formaPago?: FormaPago
}
