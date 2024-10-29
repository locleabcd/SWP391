import axios from 'axios'
import Header from '../../../../components/Member/Header'
import LeftSideBar from '../../../../components/Member/LeftSideBar'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDarkMode } from '../../../../hooks/DarkModeContext'

function Order() {
  const { isDarkMode } = useDarkMode()
  const [orders, setOrders] = useState([])
  const [paymentUrl, setPaymentUrl] = useState([])

  const getOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/orders/user/${userId}/order`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to get orders')
    }
  }

  const createPayment = async (orderId) => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')

      const selectedOrder = orders.find((order) => order.id === orderId)
      if (!selectedOrder) {
        toast.error('Order not found')
        return
      }

      const totalAmount = selectedOrder.totalAmount

      const res = await axios.post(
        'https://koicaresystemv2.azurewebsites.net/api/payment/vn-pay/order',
        {
          amount: totalAmount,
          userId: userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setPaymentUrl(res.data.data.paymentUrl)
    } catch (err) {
      console.error(err)
      toast.error('Failed to create payment')
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${
          isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
        } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='p-6 rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold mb-4 text-center'>Order Summary</h1>
          {orders?.length > 0 ? (
            <div className='space-y-4'>
              {orders.map((order) => (
                <div key={order.id} className='border rounded-lg p-4 shadow-md'>
                  <h2 className='text-xl font-semibold'>Order ID: {order.id}</h2>
                  <div className='my-2'>
                    <p className='text-gray-400'>
                      <strong>Recipient:</strong> {order.recipientName}
                    </p>
                    <p className='text-gray-400'>
                      <strong>Phone:</strong> {order.phone}
                    </p>
                    <p className='text-gray-400'>
                      <strong>Address:</strong> {order.address}
                    </p>
                    <p className='text-gray-400'>
                      <strong>Note:</strong> {order.note}
                    </p>
                    <p className='text-gray-400'>
                      <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
                    </p>
                    <p className='text-gray-400'>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>

                  <h3 className='text-lg font-bold mt-2'>Items:</h3>
                  <ul className='list-disc list-inside'>
                    {order.items.map((item, index) => (
                      <li key={index} className='flex justify-between py-1'>
                        <span>{item.productName}</span>
                        <span>{item.price.toLocaleString()}đ</span>
                      </li>
                    ))}
                  </ul>

                  <div className='flex justify-between font-bold mt-2 border-t pt-2'>
                    <span>Total Amount:</span>
                    <span>{order.totalAmount.toLocaleString()}đ</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500'>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Order
