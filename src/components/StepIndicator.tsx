import styles from '../App.module.css'

const steps = ['Cliente', 'Servicio', 'Pago', 'Confirmacion', 'Vista previa', 'Emision']

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li className={index <= current ? styles.stepActive : styles.step} key={step}>
          <span>{index + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  )
}
