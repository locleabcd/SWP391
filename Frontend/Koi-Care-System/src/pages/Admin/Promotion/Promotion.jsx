/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import TopLayout from '../../../layouts/TopLayoutAD'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import { FaUser, FaMoneyBillWave, FaEdit, FaTrash, FaInfoCircle, FaEye } from 'react-icons/fa'
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { GrNotes } from 'react-icons/gr'
import { MdPendingActions } from 'react-icons/md'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import * as XLSX from 'xlsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
function Promotion() {
  const { isDarkMode } = useDarkMode()
  const [promotions, setPromotion] = useState([])
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productDetails, setProductDetails] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`http://68.183.232.120:8080/api/promotions/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPromotion(res.data.data)
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

      const res = await axios.get(`http://68.183.232.120:8080/api/promotions/${promotionId}/products/view`, {
        headers: { Authorization: `Bearer ${token}` }
      })
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
  // Hàm cập nhật promotion
  const updatePromotions = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('You need to log in first.')
        navigate('/login') // Điều hướng đến trang đăng nhập nếu không có token
        return
      }

      if (!data.id) {
        // Thay đổi từ data.promotionId sang data.id
        throw new Error('Promotion ID not found')
      }

      const res = await axios.put(
        `http://68.183.232.120:8080/api/promotions/promotion/confirm`,
        {
          promotionId: data.id, // Sử dụng id thay cho promotionId
          status: data.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Promotion updated successfully!')
      // Cập nhật lại danh sách promotions
      getPromotion()
      navigate('/admin/promotion')
    } catch (error) {
      console.error('Error updating promotion:', error)
      if (error.response && error.response.data) {
        toast.error(`Failed to update Promotion: ${error.response.data.message || 'Unknown error'}`)
      } else {
        toast.error('Failed to update Promotion. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  // Gọi khi submit form hoặc khi thay đổi status
  const onSubmit = (data) => {
    updatePromotions(data)
  }

  const handleStatusChange = (promotion, updatedStatus) => {
    const updatedPromotion = {
      ...promotion,
      status: updatedStatus
    }
    onSubmit(updatedPromotion)
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
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const promotion = params.row
        let statusClasses = 'border-2 text-sm font-medium py-1 px-2 rounded text-center'

        // Thêm màu sắc cho từng trạng thái
        switch (promotion.status) {
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
          <div className='flex justify-center items-center h-full'>
            {promotion.status === 'PENDING' ? (
              <select
                className={`${statusClasses} bg-white border border-gray-300 rounded px-2 py-1`}
                value={promotion.status}
                onChange={(e) => handleStatusChange(promotion, e.target.value)}
              >
                <option value='PENDING'>PENDING</option>
                <option value='ACCEPTED'>ACCEPTED</option>
                <option value='REJECTED'>REJECTED</option>
              </select>
            ) : (
              <div className={statusClasses}>{promotion.status}</div>
            )}
          </div>
        )
      }
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
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='Promotion' />
            <div className='w-full flex justify-between items-center relative mb-4'>
              <div className='cursor-pointer'>
                <button
                  onClick={exportPromotionsToExcel}
                  className='mb-4 ml-3 p-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md'
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
    </div>
  )
}

export default Promotion
