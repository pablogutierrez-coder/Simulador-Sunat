import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientes } from '../database/clientes'
import { useReceipts } from '../hooks/useReceipts'
import type { Cliente, FormaPago, TipoDocumento } from '../types'
import { validateDocument, validateRequired } from '../utils/validators'
import styles from '../App.module.css'

const documentTypes: TipoDocumento[] = [
  'SELECCIONE EL TIPO DE DOCUMENTO',
  'SIN DOCUMENTO',
  'DNI',
  'CARNET DE EXTRANJERIA',
  'RUC',
  'PASAPORTE',
  'CED. DIPLOMATICA DE IDENTIDAD',
]

export function ClientePage() {
  const navigate = useNavigate()
  const { draft, setCliente, setFormaPago } = useReceipts()
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>(
    draft.cliente?.tipoDocumento ?? 'SELECCIONE EL TIPO DE DOCUMENTO',
  )
  const [formaPago, setLocalFormaPago] = useState<FormaPago>(draft.formaPago ?? 'CONTADO')
  const [numero, setNumero] = useState(draft.cliente?.numero ?? '')
  const [razonSocial, setRazonSocial] = useState(draft.cliente?.razonSocial ?? '')
  const [direccion, setDireccion] = useState(draft.cliente?.direccion ?? '')
  const [error, setError] = useState('')

  const foundClient = useMemo(
    () =>
      clientes.find(
        (cliente) => cliente.tipoDocumento === tipoDocumento && cliente.numero === numero,
      ),
    [numero, tipoDocumento],
  )

  const resetClientData = () => {
    setNumero('')
    setRazonSocial('')
    setDireccion('')
    setError('')
  }

  const fillClient = () => {
    const documentValidation = validateDocument(tipoDocumento, numero)

    if (!documentValidation.valid) {
      setError(documentValidation.message ?? '')
      return
    }

    if (tipoDocumento === 'SIN DOCUMENTO') {
      setRazonSocial('USUARIO SIN DOCUMENTO')
      setDireccion('-')
      setError('')
      return
    }

    if (!foundClient) {
      setError('No existe un cliente ficticio con ese documento. Puede registrar uno nuevo.')
      return
    }

    setRazonSocial(foundClient.razonSocial)
    setDireccion(foundClient.direccion ?? '')
    setError('')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const documentValidation = validateDocument(tipoDocumento, numero)
    const nameValidation = validateRequired(razonSocial, 'Razón social / nombres')

    if (!documentValidation.valid || !nameValidation.valid) {
      setError(documentValidation.message ?? nameValidation.message ?? '')
      return
    }

    const cliente: Cliente = {
      id: foundClient?.id ?? Date.now(),
      tipoDocumento,
      numero: tipoDocumento === 'SIN DOCUMENTO' ? '-' : numero.trim(),
      razonSocial: razonSocial.trim(),
      direccion: direccion.trim(),
    }
    setCliente(cliente)
    setFormaPago(formaPago)
    navigate('/emitir/servicio')
  }

  return (
    <div className={styles.sunatPage}>
      <h1 className={styles.rheTitle}>Emisión de RHE</h1>
      <form onSubmit={handleSubmit}>
        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>Forma de Pago:</div>
          <div className={styles.sunatBodyInline}>
            <strong>Indicar la forma de pago:</strong>
            <label className={styles.radioInline}>
              <input
                type="radio"
                checked={formaPago === 'CONTADO'}
                onChange={() => setLocalFormaPago('CONTADO')}
              />
              Al Contado
            </label>
            <label className={styles.radioInline}>
              <input
                type="radio"
                checked={formaPago === 'CREDITO'}
                onChange={() => setLocalFormaPago('CREDITO')}
              />
              Al Crédito
            </label>
          </div>
        </section>

        <section className={styles.sunatBox}>
          <div className={styles.sunatBoxHeader}>
            Emisión del Recibo por Honorarios Electrónico indique los datos del usuario al que
            le prestó el servicio:
          </div>
          <div className={styles.sunatBody}>
            <select
              className={styles.fullControl}
              value={tipoDocumento}
              onChange={(event) => {
                setTipoDocumento(event.target.value as TipoDocumento)
                resetClientData()
              }}
            >
              {documentTypes.map((documentType) => (
                <option key={documentType} value={documentType}>
                  {documentType}
                </option>
              ))}
            </select>
            <input
              className={styles.fullControl}
              disabled={tipoDocumento === 'SIN DOCUMENTO'}
              maxLength={tipoDocumento === 'RUC' ? 11 : tipoDocumento === 'DNI' ? 8 : 15}
              placeholder="NÚMERO DOCUMENTO DE IDENTIDAD DEL USUARIO"
              value={numero}
              onChange={(event) =>
                setNumero(
                  ['RUC', 'DNI'].includes(tipoDocumento)
                    ? event.target.value.replace(/\D/g, '')
                    : event.target.value.toUpperCase(),
                )
              }
            />
            {razonSocial ? (
              <>
                <input
                  className={styles.fullControlMuted}
                  readOnly
                  value={tipoDocumento === 'SIN DOCUMENTO' ? '-' : numero}
                />
                <input className={styles.fullControlMuted} readOnly value={razonSocial} />
                <input className={styles.fullControlMuted} readOnly value={direccion} />
              </>
            ) : null}
            {error ? <div className={styles.alert}>{error}</div> : null}
            <div className={styles.sunatActions}>
              {!razonSocial ? (
                <button className={styles.greenButton} type="button" onClick={fillClient}>
                  Validar
                </button>
              ) : null}
              {razonSocial ? (
                <button className={styles.blueButton} type="submit">
                  Continuar
                </button>
              ) : null}
              <button className={styles.redButton} type="button" onClick={() => navigate('/')}>
                Volver
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}
