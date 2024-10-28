/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useForm } from 'react-hook-form'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

function CreatePromotion() {
  const { isDarkMode } = useDarkMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState([]) // List of products
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    console.log('onSubmit:', data)
    setIsSubmitting(true)

    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (startDate > endDate) {
      toast.error('Start date cannot be after end date.')
      setIsSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      // Combine selected product IDs into a comma-separated string
      const requestBody = {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        discountRate: data.discountRate,
        description: data.description,
        productIds: selectedProductIds // Use selectedProductIds directly
      }
      const res = await axios.post(`https://koicaresystemv2.azurewebsites.net/api/promotions/create`, requestBody, {
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
    }
  }

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/products/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data.data)
    } catch (error) {
      console.log('Error fetching products:', error)
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  const handleProductSelection = (selectedOptions) => {
    setSelectedProductIds(selectedOptions.map((option) => option.value))
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Promotion' textName='Create Promotion' links='shop/promotion' />
          <div className={` p-6 rounded-md border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Promotion Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters long' },
                    maxLength: { value: 50, message: 'Name must not exceed 50 characters' }
                  })}
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
              </div>

              {/* Select for product selection */}
              <div className='mb-4'>
                <label htmlFor='productId' className='block text-sm font-medium mb-2'>
                  Select Products
                </label>
                <Select
                  isMulti
                  options={products.map((product) => ({ value: product.id, label: product.name }))}
                  value={products
                    .filter((product) => selectedProductIds.includes(product.id))
                    .map((product) => ({ value: product.id, label: product.name }))}
                  onChange={handleProductSelection}
                  className={` ${errors.products ? 'border-red-500' : 'border-gray-300'}`}
                  closeMenuOnSelect={false}
                  components={makeAnimated()}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                      borderColor: errors.products ? '#EF4444' : '#D1D5DB',
                      '&:hover': {
                        borderColor: errors.products ? '#EF4444' : '#9CA3AF'
                      }
                    }),
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF'
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused
                        ? isDarkMode
                          ? '#374151'
                          : '#E5E7EB'
                        : isDarkMode
                          ? '#1F2937'
                          : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#000000'
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                      color: isDarkMode ? '#FFFFFF' : '#000000'
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: isDarkMode ? '#FFFFFF' : '#000000'
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                      ':hover': {
                        backgroundColor: isDarkMode ? '#374151' : '#D1D5DB',
                        color: isDarkMode ? '#F87171' : '#EF4444'
                      }
                    })
                  }}
                />
                {selectedProductIds.length === 0 && (
                  <p className='text-red-500 text-xs mt-1'>At least one product is required</p>
                )}
              </div>

              <div className='mb-4'>
                <label htmlFor='startDate' className='block text-sm font-medium mb-2'>
                  Start Date
                </label>
                <input
                  type='datetime-local'
                  id='startDate'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('startDate', {
                    required: 'Start Date is required'
                  })}
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('endDate', {
                    required: 'End Date is required'
                  })}
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
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
                    className={`w-full p-2 border rounded-md ${
                      isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                    } ${errors.discountRate ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
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
