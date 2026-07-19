import { useState } from 'react'
import { Panel } from '../components/Panel'
import { ReceiptTable } from '../components/ReceiptTable'
import { useReceipts } from '../hooks/useReceipts'
import { useReceiptSearch } from '../hooks/useReceiptSearch'
import styles from '../App.module.css'

export function ConsultaPage() {
  const { recibos } = useReceipts()
  const [query, setQuery] = useState('')
  const results = useReceiptSearch(recibos, query)

  return (
    <div className={styles.pageStack}>
      <div className={styles.breadcrumb}>Inicio &gt; Consultas &gt; Recibos emitidos</div>
      <Panel title="Consulta de recibos emitidos" subtitle="Busqueda por RUC, DNI, razon social, serie o numero.">
        <div className={styles.searchBar}>
          <label>
            Criterio de busqueda
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. 20111111111, Empresa ABC, E001 o 00000001"
            />
          </label>
          <span>{results.length} resultado(s)</span>
        </div>
        <ReceiptTable recibos={results} />
      </Panel>
    </div>
  )
}
