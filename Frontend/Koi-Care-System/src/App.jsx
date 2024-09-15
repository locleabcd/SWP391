import { useRoutes } from 'react-router-dom'
import './App.css'
import path from './constants/path'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Member from './pages/Member/Member'

function App() {
  const routeElements = useRoutes([
    {
      path: path.home,
      element: <Home />
    },
    {
      path: path.login,
      element: <Login />
    },
    {
      path: path.register,
      element: <Register />
    },
    {
      path: path.member,
      element: <Member />
    }
  ])

  return (
    <>
      {routeElements}
      <ToastContainer />
    </>
  )
}

export default App
