import type { Cliente } from '../types'

export const clientes: Cliente[] = [
  {
    id: 1,
    tipoDocumento: 'RUC',
    numero: '20111111111',
    razonSocial: 'Empresa ABC SAC',
    direccion: 'Av. Los Procesos 123, Lima',
  },
  {
    id: 2,
    tipoDocumento: 'DNI',
    numero: '45678912',
    razonSocial: 'Juan Perez',
    direccion: 'Jr. Capacitacion 456, Lima',
  },
  {
    id: 3,
    tipoDocumento: 'RUC',
    numero: '20604567891',
    razonSocial: 'Servicios Integrales del Sur SAC',
    direccion: 'Calle Talleres 890, Arequipa',
  },
  {
    id: 4,
    tipoDocumento: 'RUC',
    numero: '20601260779',
    razonSocial: 'AESUR S.A.C.',
    direccion: 'LIMA',
  },
]
