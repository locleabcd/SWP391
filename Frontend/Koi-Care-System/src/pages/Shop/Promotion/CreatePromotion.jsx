/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useForm } from 'react-hook-form'
import { Descriptions } from 'antd'
function CreatePromotion() {
  const { isDarkMode } = useDarkMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    console.log('onSubmit:', data)
    setIsLoading(true)
    setIsSubmitting(true)

    // Kiểm tra ngày bắt đầu và ngày kết thúc
    const startDate = new Date(data.startDate)
const endDate = new Date(data.endDate)

  if (startDate > endDate) {
    toast.error('Start date cannot be after end date.')
    setIsSubmitting(false)
    setIsLoading(false)
    return
  }
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      // Chuẩn bị body của request với điều kiện status có sẵn
      const requestBody = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        discountRate: data.discountRate,
        description: data.description
      }
      // Chỉ thêm status nếu người dùng đã nhập
      if (data.status) {
        requestBody.status = data.status
      }

      const res = await axios.post(`https://koicaresystemv3.azurewebsites.net/api/promotions/create`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Promotion created successfully!')
      navigate('/shop/promotion')
    } catch (error) {
      console.log(error)
      toast.error('Failed to create Promotion.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
        } overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Promotion' textName='Create Promotion' links='shop/promotion' />
          <div className='bg-white p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Promotion Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`relative w-full p-2 border rounded-md ${errors.tagName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters long' },
                    maxLength: { value: 50, message: 'Name must not exceed 50 characters' }
                  })}
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='startDate' className='block text-sm font-medium mb-2'>
                  Start Date
                </label>
                <input
                  type='datetime-local'
                  id='startDate'
                  className={`relative w-full p-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('startDate', {
                    required: 'Start Date is required'
                  })}
                  min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                />
                {errors.startDate && <p className='text-red-500 text-xs mt-1'>{errors.startDate.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='endDate' className='block text-sm font-medium mb-2'>
                  End Date
                </label>
                <input
                  type='datetime-local'
                  id='endDate'
                  className={`relative w-full p-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('endDate', {
                    required: 'End Date is required'
                  })}
                  min={new Date().toISOString().split('T')[0]} // Ngăn không cho chọn ngày trong quá khứ
                />
                {errors.endDate && <p className='text-red-500 text-xs mt-1'>{errors.endDate.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='discountRate' className='block text-sm font-medium mb-2'>
                  Discount Rate
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    id='discountRate'
                    className={`relative w-full p-2 border rounded-md pr-10 ${errors.discountRate ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('discountRate', {
                      required: 'Discount Rate is required',
                      min: { value: 0, message: 'Discount Rate cannot be less than 0%' },
                      max: { value: 100, message: 'Discount Rate cannot exceed 100%' }
                    })}
                  />
                  <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>%</span>
                </div>
                {errors.discountRate && <p className='text-red-500 text-xs mt-1'>{errors.discountRate.message}</p>}
              </div>
              <div className='mb-4 '>
                <label htmlFor='description' className='block text-sm font-medium mb-2'>
                  Description
                </label>
                <textarea
                  rows='6'
                  id='description'
                  className={`relative w-full  border rounded-md ${errors.tagName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('description')}
                />
              </div>
              <button
                type='submit'
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Create Promotion'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreatePromotion
