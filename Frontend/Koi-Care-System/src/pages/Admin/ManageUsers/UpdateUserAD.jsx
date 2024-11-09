import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import Switch from '@mui/material/Switch' // Import Switch từ MUI

function UpdateUserAD() {
  const { isDarkMode } = useDarkMode()
  const animatedComponents = makeAnimated()
  const { id } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState({})
  const [status, setStatus] = useState(true) // Thêm trạng thái cho switch
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  // Fetch user data
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUsers(res.data.data) // Set user data từ response
      setStatus(res.data.data.status) // Set trạng thái status
      reset({
        username: res.data.data.username,
        email: res.data.data.email,
        password: '' // Đặt password là chuỗi trống
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  // Update user function
  const updateUser = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)

    // Chuẩn bị dữ liệu để gửi
    const updatedData = {
      username: data.username,
      role: data.role,
      status: status,
      password: '' // Truyền giá trị status từ switch
    }

    // Chỉ thêm password nếu người dùng nhập
    if (data.password) {
      updatedData.password = data.password
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.put(`https://koicaresystemv2.azurewebsites.net/api/users/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success('User updated successfully!')
      navigate('/admin/shop')
    } catch (error) {
      console.log(error.response?.data) // Log lỗi chi tiết
      toast.error('Failed to update user.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  // Submit handler
  const onSubmit = (data) => {
    updateUser(data)
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
          <TopLayout text='Shop' textName='Update Shop' links='admin/shop' />
          <div className=' p-6 rounded-md border'>
            {/* Form để cập nhật user */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Username Input */}
              <div className='mb-4'>
                <label className='block  text-sm font-bold mb-2' htmlFor='username'>
                  Username
                </label>
                <input
                  id='username'
                  type='text'
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  }`}
                  {...register('username', { required: true })}
                />
                {errors.username && <p className='text-red-500 text-xs italic'>Please enter a username.</p>}
              </div>

              {/* Password Input (optional) */}
              <div className='mb-4'>
                <label className='block  text-sm font-bold mb-2' htmlFor='password'>
                  Password (Leave empty if not changing)
                </label>
                <input
                  id='password'
                  type='password'
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  }`}
                  {...register('password')}
                />
              </div>

              {/* Status Switch */}
              <div className='mb-4 flex items-center'>
                <label className='text-sm font-bold mr-4'>Status</label>
                <Switch
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)} // Thay đổi trạng thái
                  color='primary'
                />
                <span>{status ? 'Active' : 'Inactive'}</span>
              </div>

              {/* Hidden Field for Role */}
              <input type='hidden' value='SHOP' {...register('role')} />

              {/* Submit Button */}
              <div className='flex items-center justify-between'>
                <button
                  type='submit'
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateUserAD
