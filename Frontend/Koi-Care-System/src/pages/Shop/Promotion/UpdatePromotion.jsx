/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDarkMode } from '../../../hooks/DarkModeContext'

function UpdatePromotion() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [promotions, setPromotions] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const fetchPromotion = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/promotions/promotion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setPromotions(res.data.data)
    } catch (error) {
      console.error('Error fetching Promotion:', error)
      toast.error('Failed to fetch Promotion details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotion()
  }, [id])

  useEffect(() => {
    if (promotions) {
      reset({
        name: promotions.name,
        startDate: promotions.startDate,
        endDate: promotions.endDate,
        discountRate: promotions.discountRate,
        description: promotions.description,
        status: promotions.status
      })
    }
  }, [promotions, reset])

  const updatePromotions = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.put(
        `https://koicaresystemv3.azurewebsites.net/api/promotions/promotion/${id}/update`,
        {
          id: id,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          discountRate: data.discountRate,
          description: data.description,
          status: data.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Promotion updated successfully!')
      navigate('/shop/promotion')
    } catch (error) {
      console.log(data.id)
      console.log(error)
      toast.error('Failed to update Promotion.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updatePromotions(data)
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
          <TopLayout text='Promotion' textName='Update Promotion' links='shop/promotion' />
          <div className='bg-white p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Promotion Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`relative w-full p-2 border rounded-md ${
                    errors.tagName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className={`relative w-full p-2 border rounded-md ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className={`relative w-full p-2 border rounded-md ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                    className={`relative w-full p-2 border rounded-md pr-10 ${
                      errors.discountRate ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                  className={`relative w-full  border rounded-md ${
                    errors.tagName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('description')}
                />
              </div>
              <div className='mb-4 '>
                <input
                  type='hidden'
                  id='status'
                  className={`relative w-full  border rounded-md ${
                    errors.tagName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('status')}
                />
              </div>
              <button
                type='submit'
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Update Promotion'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePromotion