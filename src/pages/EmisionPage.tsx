import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Download, FileSearch, Plus } from 'lucide-react'
import { Panel } from '../components/Panel'
import { ReceiptSummary } from '../components/ReceiptSummary'
import { StepIndicator } from '../components/StepIndicator'
import { useReceipts } from '../hooks/useReceipts'
import { generateReceiptPdf } from '../services/pdf'
import styles from '../App.module.css'

interface LocationState {
  reciboId?: number
}

export function EmisionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearDraft, recibos } = useReceipts()
  const state = location.state as LocationState | null
  const recibo = recibos.find((item) => item.id === state?.reciboId) ?? recibos.at(-1)

  useEffect(() => {
    clearDraft()
  }, [clearDraft])

  return (
    <div className={styles.pageStack}>
      <StepIndicator current={5} />
      <Panel title="Emision" subtitle="El recibo simulado fue registrado localmente.">
        {recibo ? (
          <>
            <div className={styles.successBox}>
              <strong>Operacion realizada</strong>
              <span>
                Se genero el recibo {recibo.serie}-{recibo.numero} en la base de datos
                ficticia del proyecto.
              </span>
            </div>
            <ReceiptSummary data={recibo} serie={recibo.serie} numero={recibo.numero} />
            <div className={styles.formActions}>
              <button className={styles.secondaryButton} type="button" onClick={() => navigate('/consulta')}>
                <FileSearch size={16} /> Consultar
              </button>
              <button className={styles.secondaryButton} type="button" onClick={() => generateReceiptPdf(recibo)}>
                <Download size={16} /> PDF
              </button>
              <button className={styles.primaryButton} type="button" onClick={() => navigate('/emitir/cliente')}>
                <Plus size={16} /> Nuevo recibo
              </button>
            </div>
          </>
        ) : (
          <div className={styles.empty}>No hay un recibo emitido para mostrar.</div>
        )}
      </Panel>
    </div>
  )
}
