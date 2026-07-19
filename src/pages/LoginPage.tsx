import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Footer } from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'
import styles from '../App.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [ruc, setRuc] = useState('10456789123')
  const [usuario, setUsuario] = useState('ADMIN')
  const [clave, setClave] = useState('123456')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const ok = login(ruc, usuario, clave)
    if (!ok) {
      setError('Los datos ingresados no corresponden a un usuario de practica.')
      return
    }
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    navigate(from)
  }

  return (
    <div className={styles.loginPage}>
      <main className={styles.loginMain}>
        <div className={styles.loginBrand}>
          <div className={styles.brandMark}>SOL</div>
          <div>
            <strong>Operaciones en Linea</strong>
            <span>OFICINA VIRTUAL</span>
          </div>
        </div>
        <p className={styles.loginWelcome}>Bienvenido, ingrese con su Clave SOL</p>
        <section className={styles.loginCard}>
          <div className={styles.loginBar}>Ingreso a SUNAT en Línea</div>
          <span className={styles.cornerBadge}>SIMULADOR EDUCATIVO</span>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.lockArt}>
              <div className={styles.lockShackle}></div>
              <div className={styles.lockBody}>CLAVESOL</div>
            </div>
            <div className={styles.loginFields}>
              <div className={styles.loginTabs}>
                <button type="button">Ingresa por RUC</button>
                <button type="button">Ingresa por DNI</button>
              </div>
              <label>
                <span>RUC</span>
                <input
                  value={ruc}
                  maxLength={11}
                  placeholder="Ingrese RUC"
                  onChange={(event) => setRuc(event.target.value)}
                />
              </label>
              <label>
                <span>Usuario</span>
                <input
                  value={usuario}
                  placeholder="Ingrese usuario"
                  onChange={(event) => setUsuario(event.target.value)}
                />
              </label>
              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  value={clave}
                  placeholder="Contraseña"
                  onChange={(event) => setClave(event.target.value)}
                />
              </label>
              <a className={styles.forgotLink}>¿Te olvidaste tu usuario o clave?</a>
            </div>
            <div className={styles.captchaLabel}>Marque la casilla de seguridad:</div>
            <div className={styles.fakeCaptcha}>
              <span className={styles.captchaBox}></span>
              <strong>No soy un robot</strong>
              <small>reCAPTCHA simulado</small>
            </div>
            {error ? <div className={styles.alert}>{error}</div> : null}
            <button className={styles.primaryButton} type="submit">
              Iniciar Sesión
            </button>
          </form>
          <strong className={styles.loginHelp}>
            Si experimenta algún inconveniente actualice la página utilizando las teclas
            Control + F5.
          </strong>
        </section>
        <div className={styles.sessionTimer}>
          Falta 5 min para que expire la petición...haga clic aquí si necesita más tiempo.
        </div>
      </main>
      <Footer />
    </div>
  )
}
