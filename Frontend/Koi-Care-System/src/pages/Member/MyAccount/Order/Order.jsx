import axios from 'axios'
import Header from '../../../../components/Member/Header'
import LeftSideBar from '../../../../components/Member/LeftSideBar'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDarkMode } from '../../../../hooks/DarkModeContext'

function Order() {
  const { isDarkMode } = useDarkMode()
  const [orders, setOrders] = useState([])
  const [payment, setPayment] = useState([])

  const getOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const response = await axios.get(`/orders/user/${userId}/order`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(response.data.data)
      console.log(response.data.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch orders')
    }
  }

  const createPayment = async (orderId, totalAmount) => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const res = await axios.get('/payment/vn-pay/order', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          amount: totalAmount,
          userId,
          orderId
        }
      })

      setPayment(res.data.data)
      toast.success('Payment created successfully')
    } catch (err) {
      console.error(err)
      toast.error('Payment failed')
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='p-4'>
            <h1 className='text-2xl font-bold'>Your Orders</h1>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order.id} className='border-b py-2'>
                    <p>Order ID: {order.id}</p>
                    <p>Total Amount: ${order.totalAmount}</p>
                    <button
                      onClick={() => createPayment(order.id, order.totalAmount)}
                      className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                      Pay Now
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
