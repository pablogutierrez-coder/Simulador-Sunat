import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ReceiptProvider } from './context/ReceiptContext'
import { ClientePage } from './pages/ClientePage'
import { ConfirmacionPage } from './pages/ConfirmacionPage'
import { ConsultaPage } from './pages/ConsultaPage'
import { EmisionPage } from './pages/EmisionPage'
import { HistorialPage } from './pages/HistorialPage'
import { LoginPage } from './pages/LoginPage'
import { MenuPage } from './pages/MenuPage'
import { PagoPage } from './pages/PagoPage'
import { ServicioPage } from './pages/ServicioPage'
import { VistaPreviaPage } from './pages/VistaPreviaPage'

function App() {
  return (
    <AuthProvider>
      <ReceiptProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route index element={<MenuPage />} />
              <Route element={<AppLayout />}>
                <Route path="/emitir/cliente" element={<ClientePage />} />
                <Route path="/emitir/servicio" element={<ServicioPage />} />
                <Route path="/emitir/pago" element={<PagoPage />} />
                <Route path="/emitir/confirmacion" element={<ConfirmacionPage />} />
                <Route path="/emitir/vista-previa" element={<VistaPreviaPage />} />
                <Route path="/emitir/emision" element={<EmisionPage />} />
                <Route path="/consulta" element={<ConsultaPage />} />
                <Route path="/historial" element={<HistorialPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ReceiptProvider>
    </AuthProvider>
  )
}

export default App
