import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { FaUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { MdPendingActions } from "react-icons/md";

function Order() {
  const { isDarkMode } = useDarkMode()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [showButtons, setShowButtons] = useState(false)
  const formatDateTime = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
  }

  const handleShowDetails = (ord) => {
    setSelectedOrder(ord)
    setIsModalOpen(true)
  }

  const formatCurrency = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const getOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching Orders:', error)
    }
  }

  useEffect(() => {
    getOrder()
  }, [])



  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 px-[30px] mx-auto'>
          <TopLayout text='Orders' />
          <div className='w-full flex justify-end items-center relative'>
            <input type='text' className='p-2 border rounded-md mr-4' placeholder='Search' />
            <div className='cursor-pointer'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-8 h-8 text-red-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
                />
              </svg>
            </div>
          </div>
          <div className='overflow-x-auto mt-6'>
            <table className='min-w-full border-spacing-x-1 border-gray-200'>
              <thead>
                <tr className='border-b'>
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>No</th>
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Order ID</th>
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Order Date</th>
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Recipient Name</th>
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Phone</th>
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Total Amount</th>               
                  <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>{index + 1}</td>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>{order.id}</td>                 
                    <td className='py-2 px-2 text-center border-b border-gray-200'>{formatDateTime(order.orderDate)}</td>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>{order.recipientName}</td>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>{order.phone}</td>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>{formatCurrency(order.totalAmount)}</td>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>                     
                      <div className='flex justify-center items-center'>
                        <button className='p-1 hover:bg-green-500 text-green-500 hover:text-white  rounded-full' onClick={() => handleShowDetails(order)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6" >
                            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && selectedOrder && (
                <div className='fixed top-0 left-0 overflow-auto  w-full h-full text-gray-600 flex justify-center items-center bg-gray-800 z-50 bg-opacity-50'>
                  <div className='bg-white p-4 border rounded-lg'>
                    <h3 className='text-xl text-center font-bold mb-4'>ORDER DETAILS</h3>
                    <div className='bg-white p-4 border rounded-lg shadow-lg'>                      
                      <p className='mb-3 flex items-center gap-2'><FaCartArrowDown className='text-2xl text-blue-500'/><strong>Order ID:</strong> {selectedOrder.id}</p>
                      <p className='mb-3 flex items-center gap-2'><BsFillCalendarDateFill className='text-2xl text-purple-500'/><strong>Order Date:</strong> {formatDateTime(selectedOrder.orderDate)}</p>                     
                      <p className='mb-3 flex items-center gap-2'><FaRegAddressCard className='text-2xl text-red-500'/><strong>Address:</strong> {selectedOrder.address}</p> 
                      <p className='mb-3 flex items-center gap-2'><FaPhoneAlt className='text-2xl text-green-500'/><strong>Phone:</strong> {selectedOrder.phone}</p>
                      <p className='mb-3 flex items-center gap-2'><GrNotes className='text-2xl '/><strong>Note:</strong> {selectedOrder.note}</p>                     
                      <p className='mb-3 flex items-center gap-2'><FaUser  className='text-2xl '/><strong>RecipientName:</strong> {selectedOrder.recipientName}</p>             
                      <p className='mb-3 flex items-center gap-2'><MdPendingActions className='text-2xl text-red-500'/><strong>Status:</strong> {selectedOrder.status}</p> 
                      <p className='mb-3 flex items-center gap-2'><FaMoneyBillWave className='text-2xl text-green-500'/> <strong>Total Amount:</strong> {selectedOrder.totalAmount}₫</p>
                    </div>   
                    
                    <div className='Order-Table overflow-auto p-4 mt-4 shadow-lg border rounded-lg'>
                      <h2 className='text-xl font-bold mb-2'>Item Details</h2>
                      <table className='min-w-full border-spacing-x-1 border-gray-200'>
                        <thead>
                          <tr className='border-b'>
                            <th className='py-3 px-4 text-center text-xs font-bold uppercase'>No</th>
                            <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Product Name</th>
                            <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Quantity</th>                         
                            <th className='py-3 px-2 text-center text-xs font-bold uppercase'>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={item.id}>
                              <td className='py-2 px-1 text-center border-b border-gray-200'>{index + 1}</td>
                              <td className='py-2 px-1 text-center border-b border-gray-200'>{item.productName}</td>
                              <td className='py-2 px-1 text-center border-b border-gray-200'>{item.quantity}</td>                             
                              <td className='py-2 px-1 text-center border-b border-gray-200'>{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                  <button
                      className='mt-4 px-4 py-2 bg-red-500 text-white rounded'
                      onClick={handleCloseModal}
                    >
                      Close
                  </button>
                  </div>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
export default Order