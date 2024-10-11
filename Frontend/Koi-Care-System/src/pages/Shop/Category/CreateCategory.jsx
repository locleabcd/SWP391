/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useForm } from 'react-hook-form'

function CreateCategory() {
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
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.post(
        `https://koicaresystemv3.azurewebsites.net/api/categories/add`,
        {
          name: data.name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success('Category created successfully!')
      navigate('/shop/category')
    } catch (error) {
      console.log(error)
      toast.error('Failed to create Category.')
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
        } overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Category' textName='Create Category' links='shop/category' />
          <div className='bg-white p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Category Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`relative w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters long' },
                    maxLength: { value: 50, message: 'Name must not exceed 50 characters' }
                  })}
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
              </div>
              <button
                type='submit'
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateCategory
