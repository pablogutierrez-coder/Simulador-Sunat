import {
  ArrowRightToLine,
  CircleDollarSign,
  FileSearch,
  FileText,
  LockKeyhole,
  Search,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useReceipts } from '../hooks/useReceipts'
import styles from '../App.module.css'

export function MenuPage() {
  const { recibos } = useReceipts()
  const tiles = [
    { label: 'EMISION RHE', icon: ArrowRightToLine, color: 'blue', to: '/emitir/cliente' },
    { label: 'NOTAS DE CREDITO', icon: CircleDollarSign, color: 'orange', to: '/consulta' },
    { label: 'REGISTRO DE PAGOS', icon: LockKeyhole, color: 'green', to: '/consulta' },
    { label: 'REVERSION RHE', icon: Trash2, color: 'red', to: '/consulta' },
    { label: 'CONSULTA DE EMISORES', icon: Search, color: 'cyan', to: '/consulta' },
    { label: 'CONSULTA RECEPTORES', icon: Search, color: 'cyan', to: '/consulta' },
    { label: 'REGISTRO DE RHF', icon: LockKeyhole, color: 'green', to: '/consulta' },
    { label: 'BAJA DE RHF', icon: Trash2, color: 'red', to: '/consulta' },
    { label: 'REGISTRO DE OTROS 4TA', icon: LockKeyhole, color: 'green', to: '/consulta' },
    { label: 'BAJA DE OTROS 4TA', icon: Trash2, color: 'red', to: '/consulta' },
    { label: 'REGISTRO DE NCF', icon: LockKeyhole, color: 'green', to: '/consulta' },
    { label: 'BAJA DE NCF', icon: Trash2, color: 'red', to: '/consulta' },
    { label: 'LIGE', icon: FileText, color: 'cyan', to: '/consulta' },
    { label: 'CONSULTA DE RV14', icon: Search, color: 'cyan', to: '/consulta' },
    { label: 'REPORTE DE INGRESOS', icon: FileSearch, color: 'cyan', to: '/historial' },
  ]

  return (
    <div className={styles.publicPage}>
      <div className={styles.menuPanel}>
        <div className={styles.menuHeader}>Opciones del menú</div>
        <div className={styles.tileGrid}>
          {tiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link className={`${styles.solTile} ${styles[tile.color]}`} key={tile.label} to={tile.to}>
                {tile.label.includes('BAJA') || tile.label.includes('REVERSION') ? (
                  <Trash2 size={30} strokeWidth={2.3} />
                ) : (
                  <Icon size={32} strokeWidth={2.3} />
                )}
                <span>{tile.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
      <div className={styles.menuFootnote}>
        SIMULADOR EDUCATIVO - {recibos.length} recibos ficticios guardados localmente
      </div>
    </div>
  )
}
