import { Outlet } from 'react-router-dom'
import usePersistLogin from '../../hooks/usePersistLogin'
import { PuffLoader } from 'react-spinners'

const PersistLogin = () => {
  const isLoading = usePersistLogin()

  if (isLoading) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
    <PuffLoader size={150}/>
  </div>

  return <Outlet />
}

export default PersistLogin
