import type { DraftRecibo, Recibo } from '../types'
import { formatDate, formatMoney } from '../utils/format'
import styles from '../App.module.css'

interface ReceiptSummaryProps {
  data: DraftRecibo | Recibo
  serie?: string
  numero?: string
}

export function ReceiptSummary({ data, serie, numero }: ReceiptSummaryProps) {
  const cliente = 'cliente' in data ? data.cliente : undefined
  const servicio = 'servicio' in data ? data.servicio : undefined
  const formaPago = 'formaPago' in data ? data.formaPago : undefined

  return (
    <div className={styles.receiptBox}>
      <div className={styles.receiptTop}>
        <div>
          <strong>Recibo por Honorarios Electronico</strong>
          <span>SIMULADOR EDUCATIVO - sin validez legal</span>
        </div>
        <div className={styles.receiptNumber}>
          <span>{serie ?? 'E001'}</span>
          <strong>{numero ?? 'Pendiente'}</strong>
        </div>
      </div>
      <dl className={styles.summaryGrid}>
        <div>
          <dt>Documento receptor</dt>
          <dd>{cliente ? `${cliente.tipoDocumento} ${cliente.numero}` : '-'}</dd>
        </div>
        <div>
          <dt>Razon social / nombres</dt>
          <dd>{cliente?.razonSocial ?? '-'}</dd>
        </div>
        <div>
          <dt>Fecha de prestacion</dt>
          <dd>{servicio ? formatDate(servicio.fechaPrestacion) : '-'}</dd>
        </div>
        <div>
          <dt>Forma de pago</dt>
          <dd>{formaPago ?? '-'}</dd>
        </div>
        <div className={styles.fullWidth}>
          <dt>Servicio prestado</dt>
          <dd>{servicio?.descripcion ?? '-'}</dd>
        </div>
        <div>
          <dt>Importe total</dt>
          <dd>S/ {formatMoney(servicio?.monto ?? 0)}</dd>
        </div>
        <div>
          <dt>Retencion</dt>
          <dd>S/ {formatMoney(servicio?.retencion ?? 0)}</dd>
        </div>
        <div>
          <dt>Total neto</dt>
          <dd>S/ {formatMoney(servicio?.totalNeto ?? 0)}</dd>
        </div>
      </dl>
    </div>
  )
}
