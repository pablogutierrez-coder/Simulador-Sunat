import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import styles from '../App.module.css'

export function AppLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topMiniBar}>
        <div className={styles.virtualBrand}>
          <span className={styles.solAvatar}>SOL</span>
          <strong>Operaciones en Linea</strong>
          <em>Oficina Virtual</em>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.simBadge}>SIMULADOR EDUCATIVO</span>
          <span className={styles.userPill}>RUC {currentUser?.ruc}</span>
          <button className={styles.iconButton} type="button" onClick={handleLogout} title="Cerrar sesion">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <strong>Plataforma de Aprendizaje</strong>
      <span>
        Este sistema es un simulador desarrollado unicamente con fines educativos y de
        capacitacion. No pertenece a SUNAT. No genera comprobantes electronicos
        validos. Toda la informacion mostrada es ficticia.
      </span>
    </footer>
  )
}
