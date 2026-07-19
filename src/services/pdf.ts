import { jsPDF } from 'jspdf'
import type { Recibo } from '../types'
import { formatDate, formatMoney } from '../utils/format'

export const generateReceiptPdf = (recibo: Recibo): void => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  doc.setTextColor(220, 220, 220)
  doc.setFontSize(38)
  doc.text('SIMULADOR EDUCATIVO', 38, 160, { angle: 35 })

  doc.setTextColor(20, 38, 66)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('RECIBO POR HONORARIOS ELECTRONICO', 20, 22)
  doc.setFontSize(9)
  doc.setTextColor(174, 45, 47)
  doc.text('SIMULADOR EDUCATIVO - SIN VALIDEZ LEGAL', 20, 29)

  doc.setDrawColor(35, 93, 143)
  doc.setLineWidth(0.5)
  doc.rect(142, 16, 48, 28)
  doc.setTextColor(20, 38, 66)
  doc.setFontSize(11)
  doc.text(`RUC ${recibo.usuarioRuc}`, 166, 25, { align: 'center' })
  doc.text(`${recibo.serie}-${recibo.numero}`, 166, 34, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Este documento pertenece a una plataforma de aprendizaje.', 20, 42)
  doc.text('No fue emitido por SUNAT ni genera comprobantes validos.', 20, 47)

  doc.setFillColor(238, 244, 250)
  doc.rect(20, 56, 170, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 73, 125)
  doc.text('DATOS DEL USUARIO', 22, 63)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)
  doc.text(`Fecha de emision: ${formatDate(recibo.fechaEmision)}`, 22, 74)
  doc.text(`Serie: ${recibo.serie}`, 22, 81)
  doc.text(`Numero: ${recibo.numero}`, 70, 81)

  doc.setFillColor(238, 244, 250)
  doc.rect(20, 92, 170, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 73, 125)
  doc.text('DATOS DEL RECEPTOR', 22, 99)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)
  doc.text(`${recibo.cliente.tipoDocumento}: ${recibo.cliente.numero}`, 22, 110)
  doc.text(`Razon social / nombres: ${recibo.cliente.razonSocial}`, 22, 117)
  doc.text(`Direccion: ${recibo.cliente.direccion || '-'}`, 22, 124)

  doc.setFillColor(238, 244, 250)
  doc.rect(20, 136, 170, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(31, 73, 125)
  doc.text('DETALLE DEL SERVICIO', 22, 143)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)
  doc.text(`Descripcion: ${recibo.servicio.descripcion}`, 22, 154, { maxWidth: 156 })
  doc.text(`Fecha de prestacion: ${formatDate(recibo.servicio.fechaPrestacion)}`, 22, 168)
  doc.text(`Forma de pago: ${recibo.formaPago}`, 22, 175)

  doc.setDrawColor(180, 190, 205)
  doc.line(20, 190, 190, 190)
  doc.text('Importe total', 125, 202)
  doc.text(`S/ ${formatMoney(recibo.servicio.monto)}`, 188, 202, { align: 'right' })
  doc.text('Retencion cuarta categoria', 125, 211)
  doc.text(`S/ ${formatMoney(recibo.servicio.retencion)}`, 188, 211, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.text('Total neto recibido', 125, 222)
  doc.text(`S/ ${formatMoney(recibo.servicio.totalNeto)}`, 188, 222, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(90, 90, 90)
  doc.text('Plataforma de Aprendizaje. Informacion ficticia para capacitacion.', 20, 276)
  doc.text('No pertenece a SUNAT. No genera comprobantes electronicos validos.', 20, 282)

  doc.save(`RHE-SIMULADOR-${recibo.serie}-${recibo.numero}.pdf`)
}
