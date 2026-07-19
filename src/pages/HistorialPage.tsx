import { Panel } from '../components/Panel'
import { ReceiptTable } from '../components/ReceiptTable'
import { useReceipts } from '../hooks/useReceipts'
import styles from '../App.module.css'

export function HistorialPage() {
  const { recibos } = useReceipts()
  const sorted = [...recibos].sort((a, b) => b.id - a.id)

  return (
    <div className={styles.pageStack}>
      <Panel title="Historial" subtitle="Listado cronologico de operaciones practicadas.">
        <div className={styles.historyStrip}>
          <strong>{recibos.length}</strong>
          <span>recibos registrados en esta sesion local</span>
        </div>
        <ReceiptTable recibos={sorted} />
      </Panel>
    </div>
  )
}
