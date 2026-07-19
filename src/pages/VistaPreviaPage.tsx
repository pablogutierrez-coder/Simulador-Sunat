import { Navigate, useNavigate } from 'react-router-dom'
import { Panel } from '../components/Panel'
import { ReceiptSummary } from '../components/ReceiptSummary'
import { StepIndicator } from '../components/StepIndicator'
import { useAuth } from '../hooks/useAuth'
import { useReceipts } from '../hooks/useReceipts'
import styles from '../App.module.css'

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
    <div className={styles.pageStack}>
      <StepIndicator current={4} />
      <Panel title="Vista previa" subtitle="Presentacion previa del recibo simulado.">
        <ReceiptSummary data={draft} />
        <div className={styles.previewSeal}>SIMULADOR EDUCATIVO</div>
        <div className={styles.formActions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => navigate('/emitir/confirmacion')}
          >
            Modificar
          </button>
          <button className={styles.primaryButton} type="button" onClick={handleEmit}>
            Emitir recibo
          </button>
        </div>
      </Panel>
    </div>
  )
}
