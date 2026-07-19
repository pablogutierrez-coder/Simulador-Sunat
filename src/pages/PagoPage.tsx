import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Panel } from '../components/Panel'
import { StepIndicator } from '../components/StepIndicator'
import { useReceipts } from '../hooks/useReceipts'
import type { FormaPago } from '../types'
import styles from '../App.module.css'

export function PagoPage() {
  const navigate = useNavigate()
  const { draft, setFormaPago } = useReceipts()
  const [formaPago, setLocalFormaPago] = useState<FormaPago>(draft.formaPago ?? 'CONTADO')

  if (!draft.cliente || !draft.servicio) {
    return <Navigate to="/emitir/cliente" replace />
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormaPago(formaPago)
    navigate('/emitir/confirmacion')
  }

  return (
    <div className={styles.pageStack}>
      <StepIndicator current={2} />
      <Panel title="Forma de pago" subtitle="Seleccione la modalidad para el recibo.">
        <form className={styles.paymentOptions} onSubmit={handleSubmit}>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="formaPago"
              value="CONTADO"
              checked={formaPago === 'CONTADO'}
              onChange={() => setLocalFormaPago('CONTADO')}
            />
            <strong>Contado</strong>
            <span>El pago se registra como cancelado al momento de emitir.</span>
          </label>
          <label className={styles.optionCard}>
            <input
              type="radio"
              name="formaPago"
              value="CREDITO"
              checked={formaPago === 'CREDITO'}
              onChange={() => setLocalFormaPago('CREDITO')}
            />
            <strong>Credito</strong>
            <span>El pago queda pendiente para fines de practica.</span>
          </label>
          <div className={styles.formActions}>
            <button className={styles.secondaryButton} type="button" onClick={() => navigate('/emitir/servicio')}>
              Anterior
            </button>
            <button className={styles.primaryButton} type="submit">
              Continuar
            </button>
          </div>
        </form>
      </Panel>
    </div>
  )
}
