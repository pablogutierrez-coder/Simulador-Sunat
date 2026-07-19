import { Navigate, useNavigate } from 'react-router-dom'
import { Panel } from '../components/Panel'
import { ReceiptSummary } from '../components/ReceiptSummary'
import { StepIndicator } from '../components/StepIndicator'
import { useReceipts } from '../hooks/useReceipts'
import styles from '../App.module.css'

export function ConfirmacionPage() {
  const navigate = useNavigate()
  const { draft } = useReceipts()

  if (!draft.cliente || !draft.servicio || !draft.formaPago) {
    return <Navigate to="/emitir/cliente" replace />
  }

  return (
    <div className={styles.pageStack}>
      <StepIndicator current={3} />
      <Panel title="Confirmacion" subtitle="Revise cuidadosamente los datos antes de continuar.">
        <ReceiptSummary data={draft} />
        <div className={styles.confirmNotice}>
          Al continuar se mostrara una vista previa. La emision final seguira siendo ficticia y
          local.
        </div>
        <div className={styles.formActions}>
          <button className={styles.secondaryButton} type="button" onClick={() => navigate('/emitir/pago')}>
            Anterior
          </button>
          <button className={styles.primaryButton} type="button" onClick={() => navigate('/emitir/vista-previa')}>
            Vista previa
          </button>
        </div>
      </Panel>
    </div>
  )
}
