import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NuevaCartilla from './pages/NuevaCartilla'
import EditarCartilla from './pages/EditarCartilla'
import VerCartilla from './pages/VerCartilla'
import AdminPanel from './pages/AdminPanel'

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="nueva-cartilla" element={<NuevaCartilla />} />
            <Route path="editar-cartilla/:id" element={<EditarCartilla />} />
            <Route path="ver-cartilla/:id" element={<VerCartilla />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
