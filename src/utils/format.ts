export const formatMoney = (value: number): string =>
  new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const formatDate = (value: string): string => {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export const todayIso = (): string => new Date().toISOString().slice(0, 10)

export const dateToIso = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export const nextNumber = (lastNumber: string | undefined, initial: number): string => {
  const numeric = lastNumber ? Number(lastNumber) + 1 : initial
  return numeric.toString().padStart(8, '0')
}
