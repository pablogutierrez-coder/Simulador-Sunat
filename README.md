# Simulador SUNAT RHE

Simulador educativo frontend del flujo de emision de Recibos por Honorarios Electronicos (RHE). La aplicacion replica el proceso para capacitacion y practica local, sin conectarse a SUNAT ni a servicios externos.

## Aviso

Este proyecto es una plataforma de aprendizaje. No pertenece a SUNAT, no consume APIs oficiales, no genera comprobantes electronicos validos y toda la informacion mostrada es ficticia.

## Tecnologias

- React
- Vite
- TypeScript
- React Router
- Context API
- LocalStorage
- jsPDF

## Credenciales de prueba

- RUC: `10700932066`
- Usuario: `ADMIN`
- Clave: `123456`

## Instalacion local

```bash
npm install
npm run dev
```

Para revisar una compilacion de produccion:

```bash
npm run build
npm run preview
```

## Estructura principal

- `src/database`: datos ficticios embebidos como arreglos TypeScript.
- `src/pages`: pantallas del flujo RHE.
- `src/components`: componentes reutilizables.
- `src/context`: estado global de autenticacion y recibos.
- `src/services`: persistencia local y generacion de PDF.
- `src/utils`: validaciones y formato.
