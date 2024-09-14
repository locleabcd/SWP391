import { useRoutes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import path from './constants/path'
import { ToastContainer } from 'react-toastify'
import HomePage from './pages/HomePage'

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
      path: path.homepage,
      element: <HomePage />
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
