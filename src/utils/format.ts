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

export const nextNumber = (lastNumber: string | undefined, initial: number): string => {
  const numeric = lastNumber ? Number(lastNumber) + 1 : initial
  return numeric.toString().padStart(8, '0')
}
