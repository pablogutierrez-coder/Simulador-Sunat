import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useReceipts } from '../hooks/useReceipts'
import { formatDate, formatMoney } from '../utils/format'
import styles from '../App.module.css'

const issuer = {
  nombre: 'GUTIERREZ CAMPOS PABLO ENRIQUE',
  direccion: 'AV. LOS LAURELES MZA. L LOTE. 27 LIMA LIMA LURIGANCHO',
  telefono: '-',
  ruc: '10700932066',
}

const units = [
  '',
  'UNO',
  'DOS',
  'TRES',
  'CUATRO',
  'CINCO',
  'SEIS',
  'SIETE',
  'OCHO',
  'NUEVE',
  'DIEZ',
  'ONCE',
  'DOCE',
  'TRECE',
  'CATORCE',
  'QUINCE',
  'DIECISEIS',
  'DIECISIETE',
  'DIECIOCHO',
  'DIECINUEVE',
]

const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']

const hundreds = [
  '',
  'CIENTO',
  'DOSCIENTOS',
  'TRESCIENTOS',
  'CUATROCIENTOS',
  'QUINIENTOS',
  'SEISCIENTOS',
  'SETECIENTOS',
  'OCHOCIENTOS',
  'NOVECIENTOS',
]

const numberToWords = (value: number): string => {
  const rounded = Math.floor(value)
  if (rounded === 0) {
    return 'CERO'
  }
  if (rounded === 100) {
    return 'CIEN'
  }
  if (rounded < 20) {
    return units[rounded]
  }
  if (rounded < 100) {
    const ten = Math.floor(rounded / 10)
    const unit = rounded % 10
    if (rounded < 30 && unit > 0) {
      return `VEINTI${units[unit].toLowerCase()}`.toUpperCase()
    }
    return unit ? `${tens[ten]} Y ${units[unit]}` : tens[ten]
  }
  if (rounded < 1000) {
    const hundred = Math.floor(rounded / 100)
    const rest = rounded % 100
    return rest ? `${hundreds[hundred]} ${numberToWords(rest)}` : hundreds[hundred]
  }

  const thousand = Math.floor(rounded / 1000)
  const rest = rounded % 1000
  const prefix = thousand === 1 ? 'MIL' : `${numberToWords(thousand)} MIL`
  return rest ? `${prefix} ${numberToWords(rest)}` : prefix
}

const amountInSoles = (value: number): string => {
  const cents = Math.round((value - Math.floor(value)) * 100)
  return `${numberToWords(value)} Y ${String(cents).padStart(2, '0')}/100 SOLES`
}

export function VistaPreviaPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { draft, emitir } = useReceipts()

  if (!draft.cliente || !draft.servicio || !draft.formaPago || !currentUser) {
    return <Navigate to="/emitir/cliente" replace />
  }

  const handleEmit = () => {
    const recibo = emitir(currentUser.ruc)
    if (recibo) {
      navigate('/emitir/emision', { state: { reciboId: recibo.id } })
    }
  }

  return (
    <div className={styles.sunatPage}>
      <h1 className={styles.previewTitle}>Emisión de RHE - Información Preliminar</h1>
      <section className={styles.preliminaryBox}>
        <div className={styles.issuerBlock}>
          <h2>{issuer.nombre}</h2>
          <p>-</p>
          <p>{issuer.direccion}</p>
          <p>
            <strong>
              <u>Telefono:</u>
            </strong>{' '}
            {issuer.telefono}
          </p>
        </div>

        <div className={styles.preliminaryDocumentBox}>
          <p>R.U.C. {issuer.ruc}</p>
          <strong>RECIBO POR HONORARIOS ELECTRONICO</strong>
          <span>SIMULADOR EDUCATIVO</span>
        </div>

        <div className={styles.preliminaryDetails}>
          <p>
            <strong>Recibí de:</strong> {draft.cliente.razonSocial}
          </p>
          <p>
            <strong>Identificado con</strong> {draft.cliente.tipoDocumento} número{' '}
            {draft.cliente.numero}
          </p>
          <p>
            <strong>Domiciliado en</strong>{' '}
            {draft.cliente.direccion ||
              'CAL. INCA GARCILASO DE LA VEGA NRO. 211 URB. MAGISTERIAL AREQUIPA AREQUIPA AREQUIPA'}
          </p>
          <p>
            <strong>Domicilio del Usuario:</strong> -
          </p>
          <p>
            <strong>Tipo de Transacción:</strong> {draft.formaPago}
          </p>
          <p>
            <strong>La suma de</strong> {amountInSoles(draft.servicio.monto)}
          </p>
          <p>
            <strong>Por concepto</strong> {draft.servicio.descripcion || 'PRUEBA'}
          </p>
          <p>
            <strong>Observación</strong> {draft.servicio.observacion || '-'}
          </p>
          <p>
            <strong>Inciso "A"</strong> DEL ARTÍCULO 33 DE LA LEY DEL IMPUESTO A LA RENTA
          </p>
          <p>
            <strong>Fecha de Emisión</strong> {formatDate(draft.servicio.fechaPrestacion)}
          </p>
        </div>

        <div className={styles.preliminaryTotals}>
          <div>
            <strong>Total por Honorarios:</strong>
            <span>{formatMoney(draft.servicio.monto)}</span>
          </div>
          <div>
            <strong>Retención (8 %) IR:</strong>
            <span>{formatMoney(draft.servicio.retencion)}</span>
          </div>
          <div>
            <strong>Total Neto Recibido:</strong>
            <span>{formatMoney(draft.servicio.totalNeto)}</span>
          </div>
        </div>
      </section>

      <div className={styles.sunatActions}>
        <button
          className={styles.blueButton}
          type="button"
          onClick={() => navigate('/emitir/confirmacion')}
        >
          Modificar
        </button>
        <button className={styles.greenButton} type="button" onClick={handleEmit}>
          Emitir Recibo
        </button>
      </div>
    </div>
  )
}
