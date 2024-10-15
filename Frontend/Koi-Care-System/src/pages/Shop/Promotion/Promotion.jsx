import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaMoneyBillWave, FaEdit, FaTrash, FaInfoCircle, FaEye } from "react-icons/fa"
import { BsFillCalendarDateFill } from "react-icons/bs"
import { GrNotes } from "react-icons/gr"
import { MdPendingActions } from "react-icons/md"
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

function Promotion() {
  const { isDarkMode } = useDarkMode()
  const [promotions, setPromotions] = useState([])
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productDetails, setProductDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getPromotion()
  }, [])

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
    fetchProductDetails(promotion.id); 
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

  const fetchProductDetails = async (promotionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/promotions/${promotionId}/products/view`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data.data)
      console.log('Product details response:', res.data); // Kiểm tra phản hồi từ API
      if (res.data && res.data.data) {
        setProductDetails(res.data.data); // Cập nhật danh sách sản phẩm
      } else {
        setProductDetails([]); // Nếu không có sản phẩm, đặt thành mảng rỗng
      }
    } catch (error) {
      console.log('Error fetching product details:', error);
      setProductDetails([]); // Đặt thành mảng rỗng nếu có lỗi
    }
  };

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
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'startDate', headerName: 'Start Date', width: 170, renderCell: (params) => formatDateTime(params.row.startDate) },
    { field: 'endDate', headerName: 'End Date', width: 170, renderCell: (params) => formatDateTime(params.row.endDate) },
    { field: 'discountRate', headerName: 'Discount Rate', width: 120 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
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
          case 'ENDED':
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
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div className='flex h-full justify-start items-center'>
          {/* Nút Details */}
          <button className='p-1 text-green-500 hover:bg-green-500 hover:text-white rounded-full' onClick={() => handleShowDetails(params.row)}>
            <FaInfoCircle className='size-5' />
          </button>

          {/* Nút Update */}
          <Link to={`/shop/promotion/${params.row.id}`} className='p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full mx-2'>
            <FaEdit className='size-5' />
          </Link>

          {/* Nút Delete */}
          <button className='p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full' onClick={() => deletePromotion(params.row.id)}>
            <FaTrash className='size-5' />
          </button>
        </div>
      )
    },
    {
      field: 'products',
      headerName: 'Products',
      width: 150,
      renderCell: (params) => (
        <div className='flex h-full justify-start items-center'>
          <button className='p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full' onClick={() => handleShowDetails(params.row)}>
            <FaEye className='size-5' />
          </button>
        </div>
      )
    }
  ]

  const exportPromotionsToExcel = (promotions) => {
    const worksheet = XLSX.utils.json_to_sheet(promotions.map((promotion) => ({
      'Name': promotion.name,
      'Start Date': formatDateTime(promotion.startDate),
      'End Date': formatDateTime(promotion.endDate),
      'Discount Rate': promotion.discountRate,
      'Status': promotion.status,
      'Description': promotion.description,
    })))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Promotions')

    XLSX.writeFile(workbook, 'Promotions.xlsx')
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} flex-1 overflow-y-auto`}>
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
              <button onClick={exportPromotionsToExcel} className="mb-4 ml-3 p-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md">
                Download Excel
              </button>
            </div>
          </div>
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
                  backgroundColor: isDarkMode ? '#555' : '#e0e0e0'
                }
              }}
            />
          </Paper>

          {isModalOpen && selectedPromotion && (
            <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
              <div className='bg-white p-4 border rounded-lg'>
                <h3 className='text-xl font-bold'>PROMOTION DETAILS</h3>
                <div>
                  <p><FaUser /> Name: {selectedPromotion.name}</p>
                  <p><BsFillCalendarDateFill /> Start Date: {formatDateTime(selectedPromotion.startDate)}</p>
                  <p><BsFillCalendarDateFill /> End Date: {formatDateTime(selectedPromotion.endDate)}</p>
                  <p><FaMoneyBillWave /> Discount Rate: {selectedPromotion.discountRate}%</p>
                  <p><GrNotes /> Description: {selectedPromotion.description}</p>
                  <p><MdPendingActions /> Status: {selectedPromotion.status}</p>
                          <div className='mt-4'>
          <h4 className='text-lg font-bold text-center'>Product Details</h4>
          {productDetails.length > 0 ? ( // Kiểm tra xem có sản phẩm không
            <table className='min-w-full bg-white text-left'>
              <thead>
                <tr>
                  <th className='py-2'>Product Name</th>
                  
                </tr>
              </thead>
              <tbody>
                {productDetails.map((product, index) => (
                  <tr key={index} className='text-left'>
                    <td className='py-2'>{product.name}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available for this promotion.</p> // Thông báo nếu không có sản phẩm
          )}
        </div>

                </div>
                <button onClick={handleCloseModal} className='bg-red-500 text-white rounded p-2 mt-4'>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Promotion
