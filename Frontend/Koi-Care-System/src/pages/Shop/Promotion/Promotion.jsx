/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaMoneyBillWave, FaEdit, FaTrash, FaInfoCircle, FaEye } from 'react-icons/fa'
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { GrNotes } from 'react-icons/gr'
import { MdPendingActions } from 'react-icons/md'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
function Promotion() {
  const { isDarkMode } = useDarkMode()
  const [promotions, setPromotions] = useState([])
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productDetails, setProductDetails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
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

  const handleShowDetails = (promotion) => {
    setSelectedPromotion(promotion)
    setIsModalOpen(true)
    fetchProductDetails(promotion.id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPromotion(null)
    setProductDetails([])
  }

  const getPromotion = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/promotions/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPromotions(res.data.data)
    } catch (error) {
      console.log('Error fetching promotions:', error)
    }
  }
  useEffect(() => {
    getPromotion()
  }, [])
  const fetchProductDetails = async (promotionId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const res = await axios.get(
        `https://koicaresystemv3.azurewebsites.net/api/promotions/${promotionId}/products/view`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      console.log(res.data.data)
      console.log('Product details response:', res.data) // Kiểm tra phản hồi từ API
      if (res.data && res.data.data) {
        setProductDetails(res.data.data) // Cập nhật danh sách sản phẩm
      } else {
        setProductDetails([]) // Nếu không có sản phẩm, đặt thành mảng rỗng
      }
    } catch (error) {
      console.log('Error fetching product details:', error)
      setProductDetails([]) // Đặt thành mảng rỗng nếu có lỗi
    }
  }

  const deletePromotion = async (id) => {
    const isConfirmed = window.confirm('Are you sure to delete promotion?')
    if (!isConfirmed) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/promotions/promotion/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Promotion deleted successfully')
      getPromotion()
    } catch (error) {
      toast.error('Error deleting promotion')
      console.error('Error deleting promotion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 170,
      renderCell: (params) => formatDateTime(params.row.startDate)
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 170,
      renderCell: (params) => formatDateTime(params.row.endDate)
    },
    { field: 'discountRate', headerName: 'Discount Rate', width: 120 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
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
          case 'ACCEPTED':
            statusClasses += ' border-green-500 text-green-500'
            break
          case 'REJECTED':
            statusClasses += ' border-red-500 text-red-500'
            break
          default:
            statusClasses += ' border-gray-500 text-gray-500'
        }
        return (
          <div className='h-full flex justify-start items-center'>
            <div className={statusClasses}>{status}</div>
          </div>
        )
      }
    },
    {
      field: 'products',
      headerName: 'Products',
      width: 100,
      renderCell: (params) => (
        <div className='flex h-full justify-start items-center'>
          <button
            className='p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full'
            onClick={() => handleShowDetails(params.row)}
          >
            <FaEye className='size-5' />
          </button>
        </div>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => (
        <div className='flex h-full justify-start items-center'>
          {/* Nút Details */}
          <button
            className='p-1 text-green-500 hover:bg-green-500 hover:text-white rounded-full'
            onClick={() => handleShowDetails(params.row)}
          >
            <FaInfoCircle className='size-5' />
          </button>

          {/* Nút Update - luôn hiển thị nhưng kiểm tra trạng thái trước khi cho phép chỉnh sửa */}
          <button
            className='p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full mx-2'
            onClick={() => {
              if (params.row.status === 'PENDING') {
                navigate(`/shop/promotion/${params.row.id}`)
              } else {
                toast.warning('You can only edit promotions in PENDING status')
              }
            }}
          >
            <FaEdit className='size-5' />
          </button>

          {/* Nút Delete */}
          <button
            className='p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full'
            onClick={() => deletePromotion(params.row.id)}
          >
            <FaTrash className='size-5' />
          </button>
        </div>
      )
    }
  ]

  const exportPromotionsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      promotions.map((promotion) => ({
        Name: promotion.name,
        'Start Date': formatDateTime(promotion.startDate),
        'End Date': formatDateTime(promotion.endDate),
        'Discount Rate': promotion.discountRate,
        Status: promotion.status,
        Description: promotion.description
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Promotions')

    XLSX.writeFile(workbook, 'Promotions.xlsx')
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} flex-1 overflow-y-auto`}
      >
        <Header />
        <div className='py-5 px-[30px] mx-auto'>
          <TopLayout text='Promotions' />
          <div className='w-full flex justify-between items-center relative mb-4'>
            <div className='cursor-pointer'>
              <button
                className='py-2 px-3 bg-custom-left-bar text-white hover:bg-blue-600 rounded-md'
                onClick={() => navigate('/shop/createPromotion')}
              >
                New Promotion
              </button>
            </div>
            <div className='cursor-pointer'>
              <button
                onClick={exportPromotionsToExcel}
                className='py-2 px-3 bg-blue-500 text-white hover:bg-blue-700 rounded-md'
              >
                Download Excel
              </button>
            </div>
          </div>
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Paper sx={{ height: 670 }}>
              <DataGrid
                rows={promotions}
                columns={columns}
                checkboxSelection
                disableExtendRowFullWidth
                pageSizeOptions={[5, 10, 20, 50, 100]}
                pageSize={10}
                rowHeight={80}
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
          {isModalOpen && selectedPromotion && (
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
                <h3 className='text-xl text-center font-bold mb-4'>PROMOTION DETAILS</h3>
                <div>
                  <div className=' p-4 border rounded-lg shadow-lg'>
                    <p className='mb-3 flex items-center gap-2'>
                      <FaUser /> Name: {selectedPromotion.name}
                    </p>
                    <p className='mb-3 flex items-center gap-2'>
                      <BsFillCalendarDateFill /> Start Date: {formatDateTime(selectedPromotion.startDate)}
                    </p>
                    <p className='mb-3 flex items-center gap-2'>
                      <BsFillCalendarDateFill /> End Date: {formatDateTime(selectedPromotion.endDate)}
                    </p>
                    <p className='mb-3 flex items-center gap-2'>
                      <FaMoneyBillWave /> Discount Rate: {selectedPromotion.discountRate}%
                    </p>
                    <p className='mb-3 flex items-center gap-2'>
                      <GrNotes /> Description: {selectedPromotion.description}
                    </p>
                    <p className='mb-3 flex items-center gap-2'>
                      <MdPendingActions /> Status: {selectedPromotion.status}
                    </p>
                  </div>

                  <div
                    className='Order-Table overflow-auto p-4 mt-4 shadow-lg border rounded-lg'
                    style={{ maxHeight: '300px' }}
                  >
                    <h4 className='text-lg font-bold text-left '>Product Details</h4>
                    {productDetails.length > 0 ? (
                      <table className='min-w-full border-spacing-x-1 border-gray-200'>
                        <thead>
                          <tr className='border-b'>
                            <th className='py-3 px-4 text-center text-xs font-bold uppercase'>No</th>{' '}
                            {/* Thêm cột index */}
                            <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Product Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productDetails.map((product, index) => (
                            <tr key={index}>
                              <td className='py-2 px-1 text-center border-b border-gray-200'>{index + 1}</td>{' '}
                              {/* Hiển thị chỉ số (index) bắt đầu từ 1 */}
                              <td className='py-2 px-1 text-center border-b border-gray-200'>{product.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No products available for this promotion.</p>
                    )}
                  </div>
                </div>
                <button onClick={handleCloseModal} className='bg-red-500 text-white rounded p-2 mt-4'>
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

export default Promotion
