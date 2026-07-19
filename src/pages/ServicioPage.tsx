import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { configuracion } from '../database/configuracion'
import { useReceipts } from '../hooks/useReceipts'
import type { Servicio } from '../types'
import { todayIso } from '../utils/format'
import { validateAmount, validateDate, validateRequired } from '../utils/validators'
import styles from '../App.module.css'

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
    draft.servicio?.afectoRetencion ?? true,
  )
  const [monto, setMonto] = useState(String(draft.servicio?.monto ?? ''))
  const [error, setError] = useState('')

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
    const required = validateRequired(descripcion, 'Descripcion del servicio')
    const dateValidation = validateDate(fechaPrestacion)
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

  return (
    <div className={styles.sunatPage}>
      <h1 className={styles.rheTitle}>Emisión de RHE</h1>
      <form onSubmit={handleSubmit}>
        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>Indique los datos del usuario al que le prestó el servicio:</div>
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
              <input
                type="date"
                value={fechaPrestacion}
                onChange={(event) => setFechaPrestacion(event.target.value)}
              />
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
              <label><input type="radio" checked={draft.formaPago === 'CONTADO'} readOnly /> Si</label>
              <label><input type="radio" checked={draft.formaPago === 'CREDITO'} readOnly /> No</label>
            </div>
            <label>
              <strong>Medio de Pago</strong>
              <select>
                <option>-- Seleccione Medio de Pago --</option>
                <option>Depósito en cuenta</option>
                <option>Transferencia de fondos</option>
                <option>Pago en efectivo</option>
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
            <div className={styles.amountSummary}>
              <span>Retención: S/ {calculated.retencion.toFixed(2)}</span>
              <strong>Total Neto Recibido: S/ {calculated.totalNeto.toFixed(2)}</strong>
            </div>
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
    </div>
  )
}
