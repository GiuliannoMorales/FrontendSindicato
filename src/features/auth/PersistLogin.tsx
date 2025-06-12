import { Outlet } from 'react-router-dom'
import usePersistLogin from '../../hooks/usePersistLogin'

const PersistLogin = () => {
  const isLoading = usePersistLogin()

  if (isLoading) return <p>Loading session...</p>

  return <Outlet />
}

export default PersistLogin
