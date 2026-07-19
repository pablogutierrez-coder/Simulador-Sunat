import type { TipoDocumento } from '../types'

export interface ValidationResult {
  valid: boolean
  message?: string
}

export const validateRequired = (value: string, label: string): ValidationResult => {
  if (!value.trim()) {
    return { valid: false, message: `${label} es obligatorio.` }
  }
  return { valid: true }
}

export const validateDocument = (
  tipoDocumento: TipoDocumento,
  numero: string,
): ValidationResult => {
  const clean = numero.trim()

  if (tipoDocumento === 'DNI' && !/^\d{8}$/.test(clean)) {
    return { valid: false, message: 'El DNI debe tener 8 digitos numericos.' }
  }

  if (tipoDocumento === 'RUC' && !/^\d{11}$/.test(clean)) {
    return { valid: false, message: 'El RUC debe tener 11 digitos numericos.' }
  }

  return { valid: true }
}

export const validateAmount = (value: number): ValidationResult => {
  if (!Number.isFinite(value) || value <= 0) {
    return { valid: false, message: 'El importe debe ser mayor a cero.' }
  }
  return { valid: true }
}

export const validateDate = (value: string): ValidationResult => {
  if (!value) {
    return { valid: false, message: 'La fecha es obligatoria.' }
  }

  if (Number.isNaN(Date.parse(value))) {
    return { valid: false, message: 'La fecha ingresada no es valida.' }
  }

  return { valid: true }
}
