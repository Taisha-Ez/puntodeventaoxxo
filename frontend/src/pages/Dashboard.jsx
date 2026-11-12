import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { usuario } = useAuth()
  return (
    <div>
      <h1>Bienvenido, {usuario.nombre}</h1>
      <p>Tu rol es: {usuario.rol}</p>
    </div>
  )
}