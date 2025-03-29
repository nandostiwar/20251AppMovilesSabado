import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('rol')

  if (!token || userRole !== role) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
