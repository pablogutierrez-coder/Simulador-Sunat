import { Download } from 'lucide-react'
import type { Recibo } from '../types'
import { generateReceiptPdf } from '../services/pdf'
import { formatDate, formatMoney } from '../utils/format'
import styles from '../App.module.css'

export function ReceiptTable({ recibos }: { recibos: Recibo[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Serie</th>
            <th>Numero</th>
            <th>Documento</th>
            <th>Razon social / nombres</th>
            <th>Total</th>
            <th>Estado</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {recibos.map((recibo) => (
            <tr key={recibo.id}>
              <td>{formatDate(recibo.fechaEmision)}</td>
              <td>{recibo.serie}</td>
              <td>{recibo.numero}</td>
              <td>{`${recibo.cliente.tipoDocumento} ${recibo.cliente.numero}`}</td>
              <td>{recibo.cliente.razonSocial}</td>
              <td>S/ {formatMoney(recibo.servicio.totalNeto)}</td>
              <td>
                <span className={styles.status}>{recibo.estado}</span>
              </td>
              <td>
                <button
                  className={styles.iconButton}
                  type="button"
                  onClick={() => generateReceiptPdf(recibo)}
                  title="Generar PDF simulado"
                >
                  <Download size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {recibos.length === 0 ? <div className={styles.empty}>No se encontraron registros.</div> : null}
    </div>
  )
}
