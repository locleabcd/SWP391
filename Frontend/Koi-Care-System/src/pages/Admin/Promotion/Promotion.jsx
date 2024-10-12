import { useEffect, useState } from 'react'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import TopLayout from '../../../layouts/TopLayoutAD'
import { useDarkMode } from '../../../hooks/DarkModeContext'

function Promotion() {
  const { isDarkMode } = useDarkMode()
  const [promotions, setPromotion] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const getPromotion = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/promotions/all`, {
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
  
      if (!data.id) {  // Thay đổi từ data.promotionId sang data.id
        throw new Error('Promotion ID not found')
      }
  
      const res = await axios.put(
        `https://koicaresystemv3.azurewebsites.net/api/promotions/promotion/confirm`,
        {
          promotionId: data.id,  // Sử dụng id thay cho promotionId
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
          </div>
          <div className='overflow-x-auto mt-6'>
            <table className='min-w-full border-spacing-x-1 border-gray-200'>
              <thead className='border-gray-200'>
                <tr className='border-b'>
                  <th className='py-3 text-center text-xs font-bold uppercase'>No</th>
                  <th className='py-3 text-center text-xs font-bold uppercase'>Name</th>
                  <th className='py-3 text-center text-xs font-bold uppercase'>Start Date</th>
                  <th className='py-3 text-center text-xs font-bold uppercase'>End Date</th>
                  <th className='py-3 text-center text-xs font-bold uppercase'>Discount Rate</th>
                  <th className='py-3 text-center text-xs font-bold uppercase'>Description</th>
                  <th className='py-3 text-center text-xs font-bold uppercase'>Status</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion, index) => (
                  <tr key={promotion.id}>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{index + 1}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{promotion.name}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{promotion.startDate.replace('T', ' ')}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{promotion.endDate.replace('T', ' ')}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{promotion.discountRate}%</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{promotion.description}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>
                      {promotion.status === 'PENDING' ? (
                        <select
                          className='bg-white border border-gray-300 rounded px-2 py-1'
                          value={promotion.status}
                          onChange={(e) => handleStatusChange(promotion, e.target.value)}
                        >
                          <option value='PENDING'>PENDING</option>
                          <option value='ACCEPTED'>ACCEPTED</option>
                          <option value='REJECTED'>REJECTED</option>
                        </select>
                      ) : (
                        <span>{promotion.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Promotion
