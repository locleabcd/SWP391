/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutAD'
import { FaUser } from 'react-icons/fa'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaRegAddressCard } from 'react-icons/fa'
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { FaCartArrowDown } from 'react-icons/fa'
import { FaMoneyBillWave } from 'react-icons/fa'
import { GrNotes } from 'react-icons/gr'
import { MdPendingActions } from 'react-icons/md'
import * as XLSX from 'xlsx'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(36 48 63 / var(--tw-bg-opacity))',
      paper: 'rgb(36 48 63 / var(--tw-bg-opacity))'
    }
  }
})

function ManageOrder() {
  const { isDarkMode } = useDarkMode()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDateTime = (inputDate) => {
    const date = new Date(inputDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
  }

  const handleShowDetails = (ord) => {
    setSelectedOrder(ord)
    setIsModalOpen(true)
  }

  const formatCurrency = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'

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

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/apiorders/all`, {
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

  const updateDelivery = async (id) => {
    const isConfirmed = window.confirm('Are you sure to update status delivery')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')

      const res = await axios.put(
        `https://koicaresystemv2.azurewebsites.net/apiorders/${id}/order/delivery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Updated Delivery Status Successfully!')
      getOrder()
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to update status.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (orderId) => {
    updateDelivery(orderId)
  }

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 100 },
    {
      field: 'orderDate',
      headerName: 'Order Date',
      width: 170,
      renderCell: (params) => formatDateTime(params.row.orderDate)
    },
    { field: 'recipientName', headerName: 'Recipient Name', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 150,
      renderCell: (params) => formatCurrency(params.row.totalAmount)
    },
    {
      field: 'status',
      headerName: 'Order Status',
      width: 150,
      renderCell: (params) => {
        const status = params.value
        let statusClasses = 'border-2 text-sm font-medium py-1 px-2 rounded text-center'

        switch (status) {
          case 'PENDING':
            statusClasses += ' border-yellow-500 text-yellow-500'
            break
          case 'PROCESSING':
            statusClasses += ' border-blue-500 text-blue-500'
            break
          case 'DELIVERED':
            statusClasses += ' border-green-500 text-green-500'
            break
          case 'CANCELLED':
            statusClasses += ' border-red-500 text-red-500'
            break
          default:
            statusClasses += ' border-gray-500 text-gray-500' // Default case for unexpected status
        }

        return (
          <div className='h-full flex justify-center items-center'>
            <div className={statusClasses}>{status}</div>
          </div>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <div className='flex h-full justify-center items-center'>
          <button
            className='p-1 hover:bg-green-500 text-green-500 hover:text-white  rounded-full'
            onClick={() => handleShowDetails(params.row)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
              <path
                fillRule='evenodd'
                d='M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z'
                clipRule='evenodd'
              />
              <path
                fillRule='evenodd'
                d='M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      )
    }
  ]

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        'Order ID': order.id,
        'Recipient Name': order.recipientName,
        'Order Date': formatDateTime(order.orderDate),
        'Total Amount': formatCurrency(order.totalAmount),
        Address: order.address,
        Note: order.note,
        Status: order.status
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')

    XLSX.writeFile(workbook, 'orders.xlsx')
  }

  return (
    <div className='h-screen flex flex-col md:flex-row'>
      <LeftSideBar className='w-full md:w-1/4' />
      <div
        className={`relative flex-1 ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 px-4 sm:px-6 md:px-8 mx-auto max-w-[1750px]'>
          <TopLayout text='Orders' />
          <div className='w-full flex justify-end items-center relative'>
            <button onClick={exportToExcel} className='mb-4 p-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md'>
              Download Excel
            </button>
          </div>
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Paper sx={{ height: 670 }}>
              <DataGrid
                rows={orders}
                columns={columns}
                pageSize={10}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                rowHeight={60}
                checkboxSelection
                disableExtendRowFullWidth
                getRowId={(row) => row.id}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: isDarkMode ? 'rgb(36 48 63 / var(--tw-bg-opacity))' : '#e0e0e0'
                  }
                }}
              />
            </Paper>
          </ThemeProvider>
          {isModalOpen && selectedOrder && (
            <div
              className={`fixed top-0 left-0 overflow-auto w-full h-full flex justify-center items-center z-50 bg-opacity-50 ${
                isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-800 text-gray-600'
              }`}
            >
              <div
                className={`p-4 border rounded-lg max-h-[80vh] max-w-[100vw] overflow-auto ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
                }`}
              >
                <h3 className='text-xl text-center font-bold mb-4'>ORDER DETAILS</h3>
                <div className=' p-4 border rounded-lg shadow-lg'>
                  <p className='mb-3 flex items-center gap-2'>
                    <FaCartArrowDown className='text-2xl text-blue-500' />
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <BsFillCalendarDateFill className='text-2xl text-purple-500' />
                    <strong>Order Date:</strong> {formatDateTime(selectedOrder.orderDate)}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <FaRegAddressCard className='text-2xl text-red-500' />
                    <strong>Address:</strong> {selectedOrder.address}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <FaPhoneAlt className='text-2xl text-green-500' />
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <GrNotes className='text-2xl text-yellow-500' />
                    <strong>Note:</strong> {selectedOrder.note}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <FaUser className='text-2xl text-blue-500' />
                    <strong>RecipientName:</strong> {selectedOrder.recipientName}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <MdPendingActions className='text-2xl text-red-500' />
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p className='mb-3 flex items-center gap-2'>
                    <FaMoneyBillWave className='text-2xl text-green-500' /> <strong>Total Amount:</strong>{' '}
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
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
                          <td className='py-2 px-1 text-center border-b border-gray-200'>
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className='mt-4 px-4 py-2 bg-red-500 text-white rounded' onClick={handleCloseModal}>
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

export default ManageOrder
