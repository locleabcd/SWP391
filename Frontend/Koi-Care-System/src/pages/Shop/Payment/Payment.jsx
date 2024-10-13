import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'

function Payment() {
  const { isDarkMode } = useDarkMode()
  const [payments, setPayments] = useState([])
  // const [showButtons, setShowButtons] = useState(false)

  const getPayment = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/payment/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPayments(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching Payments:', error)
    }
  }
  useEffect(() => {
    getPayment()
  }, [])

  return (
    <div>Payment</div>
  )
}
export default Payment