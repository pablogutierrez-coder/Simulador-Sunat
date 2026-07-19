import { useContext } from 'react'
import { ReceiptContext } from '../context/ReceiptStore'

export const useReceipts = () => {
  const value = useContext(ReceiptContext)
  if (!value) {
    throw new Error('useReceipts debe usarse dentro de ReceiptProvider')
  }
  return value
}
