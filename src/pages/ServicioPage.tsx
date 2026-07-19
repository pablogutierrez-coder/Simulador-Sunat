import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { configuracion } from '../database/configuracion'
import { useReceipts } from '../hooks/useReceipts'
import type { Servicio } from '../types'
import { addDays, dateToIso, formatDate, todayIso } from '../utils/format'
import { validateAmount, validateEmissionDateRange, validateRequired } from '../utils/validators'
import styles from '../App.module.css'

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

const paymentMethods = [
  '-- Seleccione Medio de Pago --',
  'Depósito en Cuenta',
  'Giro',
  'Transferencia de Fondos',
  'Orden de Pago',
  'Tarjeta de Débito',
  'Tarjeta de Crédito emitida en el país por una empresa del Sistema Financiero',
  'Cheques con cláusula: no negociables - intransferibles - no a la orden o similar',
  'Efectivo - por operaciones donde no existe obligación de utilizar Medios de Pago',
  'Efectivo - en los demás casos',
  'Medios de Pago Usados en Comercio Exterior',
  'Documentos de EDPYMES y Cooperativas de Ahorro y Crédito',
  'Tarjeta de crédito emitida o no en el país por entes ajenos al Sistema F.',
  'Tarjetas de crédito emitidas en el exterior por bancos o F. no domiciliadas',
]

const buildCalendarDays = (baseDate: Date) => {
  const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const start = addDays(first, -first.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index)
    return {
      date,
      iso: dateToIso(date),
      inMonth: date.getMonth() === baseDate.getMonth(),
    }
  })
}

export function ServicioPage() {
  const navigate = useNavigate()
  const { draft, setServicio } = useReceipts()
  const [descripcion, setDescripcion] = useState(draft.servicio?.descripcion ?? '')
  const [observacion, setObservacion] = useState(draft.servicio?.observacion ?? '')
  const [fechaPrestacion, setFechaPrestacion] = useState(
    draft.servicio?.fechaPrestacion ?? todayIso(),
  )
  const [rentaCuarta, setRentaCuarta] = useState(draft.servicio?.rentaCuarta ?? true)
  const [afectoRetencion, setAfectoRetencion] = useState(
    draft.servicio?.afectoRetencion ?? false,
  )
  const [monto, setMonto] = useState(String(draft.servicio?.monto ?? ''))
  const [medioPago, setMedioPago] = useState(paymentMethods[0])
  const [error, setError] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [pendingDate, setPendingDate] = useState(fechaPrestacion)
  const calendarBaseDate = useMemo(() => new Date(`${todayIso()}T00:00:00`), [])
  const minDate = useMemo(() => dateToIso(addDays(calendarBaseDate, -2)), [calendarBaseDate])
  const maxDate = useMemo(() => dateToIso(calendarBaseDate), [calendarBaseDate])
  const calendarDays = useMemo(() => buildCalendarDays(calendarBaseDate), [calendarBaseDate])

  const calculated = useMemo(() => {
    const numeric = Number(monto)
    const amount = Number.isFinite(numeric) ? numeric : 0
    const retencion = afectoRetencion ? amount * configuracion.tasaRetencion : 0
    return {
      amount,
      retencion,
      totalNeto: amount - retencion,
    }
  }, [afectoRetencion, monto])

  if (!draft.cliente) {
    return <Navigate to="/emitir/cliente" replace />
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = validateRequired(descripcion, 'Descripción del servicio')
    const dateValidation = validateEmissionDateRange(fechaPrestacion)
    const amountValidation = validateAmount(calculated.amount)

    if (!required.valid || !dateValidation.valid || !amountValidation.valid) {
      setError(required.message ?? dateValidation.message ?? amountValidation.message ?? '')
      return
    }

    const servicio: Servicio = {
      descripcion: descripcion.trim(),
      observacion: observacion.trim(),
      fechaPrestacion,
      rentaCuarta,
      afectoRetencion,
      monto: calculated.amount,
      retencion: calculated.retencion,
      totalNeto: calculated.totalNeto,
    }

    setServicio(servicio)
    navigate('/emitir/confirmacion')
  }

  const selectDate = (iso: string) => {
    if (iso < minDate || iso > maxDate) {
      return
    }

    setPendingDate(iso)
  }

  const confirmDate = () => {
    setFechaPrestacion(pendingDate)
    setCalendarOpen(false)
  }

  return (
    <div className={styles.sunatPage}>
      <h1 className={styles.rheTitle}>Emisión de RHE</h1>
      <form onSubmit={handleSubmit}>
        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>
            Indique los datos del usuario al que le prestó el servicio:
          </div>
          <div className={styles.twoColRows}>
            <strong>Tipo de Documento</strong>
            <span>{draft.cliente.tipoDocumento}</span>
            <strong>Número Documento de Identidad</strong>
            <span>{draft.cliente.numero}</span>
            <strong>Nombre o Razón Social</strong>
            <span>{draft.cliente.razonSocial}</span>
          </div>
        </section>

        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>Indique los datos del servicio prestado:</div>
          <div className={styles.sunatFormRows}>
            <label className={styles.radioQuestion}>
              <strong>El servicio se prestó a título gratuito?</strong>
              <span>
                <input type="radio" checked={false} readOnly /> Si
              </span>
              <span>
                <input type="radio" checked readOnly /> No
              </span>
            </label>
            <label>
              <strong>Descripción o Tipo de Servicio Prestado</strong>
              <textarea
                value={descripcion}
                rows={4}
                onChange={(event) => setDescripcion(event.target.value)}
              />
            </label>
            <label>
              <strong>Observación (opcional)</strong>
              <textarea
                value={observacion}
                rows={3}
                onChange={(event) => setObservacion(event.target.value)}
              />
            </label>
            <label>
              <strong>Fecha de Emisión</strong>
              <button
                className={styles.dateField}
                type="button"
                onClick={() => {
                  setPendingDate(fechaPrestacion)
                  setCalendarOpen(true)
                }}
              >
                <span>{formatDate(fechaPrestacion)}</span>
                <span className={styles.calendarIcon}>▣</span>
              </button>
            </label>
          </div>
        </section>

        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>
            Indique el tipo de Renta de Cuarta Categoría, de acuerdo al inciso aplicable del
            artículo 33 LIR:
          </div>
          <div className={styles.radioList}>
            <label>
              <input
                type="radio"
                checked={rentaCuarta}
                onChange={() => setRentaCuarta(true)}
              />
              Inciso A: El ejercicio individual, de cualquier profesión, arte, ciencia, oficio o
              actividades no incluidas expresamente en la tercera categoría
            </label>
            <label>
              <input
                type="radio"
                checked={!rentaCuarta}
                onChange={() => setRentaCuarta(false)}
              />
              Inciso B: El desempeño de funciones de director de empresas, síndico, mandatario,
              gestor de negocios y actividades similares
            </label>
          </div>
        </section>

        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>Retención del Impuesto a la Renta:</div>
          <div className={styles.sunatBodyInline}>
            <label className={styles.radioInline}>
              <input
                type="radio"
                checked={afectoRetencion}
                onChange={() => setAfectoRetencion(true)}
              />
              Si
            </label>
            <label className={styles.radioInline}>
              <input
                type="radio"
                checked={!afectoRetencion}
                onChange={() => setAfectoRetencion(false)}
              />
              No
            </label>
          </div>
        </section>

        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>
            El pago total del servicio está siendo efectuado al momento de la emisión de este
            comprobante?
          </div>
          <div className={styles.sunatFormRows}>
            <div className={styles.radioLine}>
              <label>
                <input type="radio" checked={draft.formaPago === 'CONTADO'} readOnly /> Si
              </label>
              <label>
                <input type="radio" checked={draft.formaPago === 'CREDITO'} readOnly /> No
              </label>
            </div>
            <label>
              <strong>Medio de Pago</strong>
              <select value={medioPago} onChange={(event) => setMedioPago(event.target.value)}>
                {paymentMethods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>Indique el monto de los honorarios:</div>
          <div className={styles.sunatFormRows}>
            <label>
              <strong>Tipo de Moneda</strong>
              <select>
                <option>SOL</option>
              </select>
            </label>
            <label>
              <strong>Monto Total de los Honorarios</strong>
              <input
                inputMode="decimal"
                value={monto}
                onChange={(event) => setMonto(event.target.value)}
                placeholder="0.00"
              />
            </label>
            <label>
              <strong>Retención (8%) Impuesto a la Renta</strong>
              <input readOnly value={calculated.retencion.toFixed(2)} />
            </label>
            <label>
              <strong>Total Neto Recibido</strong>
              <input readOnly value={calculated.totalNeto.toFixed(2)} />
            </label>
          </div>
        </section>

        {error ? <div className={styles.alert}>{error}</div> : null}
        <div className={styles.sunatActions}>
          <button className={styles.blueButton} type="submit">
            Continuar
          </button>
          <button className={styles.redButton} type="button" onClick={() => navigate('/emitir/cliente')}>
            Volver
          </button>
        </div>
      </form>
      {calendarOpen ? (
        <div className={styles.dateModalOverlay}>
          <div className={styles.dateModal}>
            <div className={styles.dateModalTitle}>Seleccione Fecha</div>
            <div className={styles.dateCalendar}>
              <strong>
                {monthNames[calendarBaseDate.getMonth()]} {calendarBaseDate.getFullYear()}
              </strong>
              <div className={styles.weekHeader}>
                {weekDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className={styles.dayGrid}>
                {calendarDays.map((day) => {
                  const disabled = day.iso < minDate || day.iso > maxDate
                  const selected = pendingDate === day.iso
                  return (
                    <button
                      className={`${styles.dayButton} ${!day.inMonth ? styles.outMonth : ''} ${
                        disabled ? styles.disabledDay : ''
                      } ${selected ? styles.selectedDay : ''}`}
                      disabled={disabled}
                      key={day.iso}
                      type="button"
                      onClick={() => selectDate(day.iso)}
                    >
                      {day.date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className={styles.dateModalActions}>
              <button className={styles.redButton} type="button" onClick={confirmDate}>
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
