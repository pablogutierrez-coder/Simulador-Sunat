import { createContext } from 'react'
import type { ReceiptContextValue } from './ReceiptContext'

export const ReceiptContext = createContext<ReceiptContextValue | undefined>(undefined)
