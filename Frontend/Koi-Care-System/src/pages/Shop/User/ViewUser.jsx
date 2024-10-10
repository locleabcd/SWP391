import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'

function ViewUser() {
  const { isDarkMode } = useDarkMode()
  const [users, setUsers] = useState([])
  const [showButtons, setShowButtons] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }
  useEffect(() => {
    getUser()
  }, [])
  return (
    <div>ViewUser</div>
  )
}
export default ViewUser