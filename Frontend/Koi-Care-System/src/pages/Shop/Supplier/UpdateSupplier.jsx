import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

function UpdateSupplier() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [suppliers, setSuppliers] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const fetchSupplier = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/apisuppliers/supplier/${id}/by_id`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSuppliers(res.data.data)
      reset(res.data.data)
    } catch (error) {
      console.error('Error fetching supplier:', error)
      toast.error('Failed to fetch supplier details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSupplier()
  }, [id])

  const updateSupplier = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.put(
        `https://koicaresystemv2.azurewebsites.net/apisuppliers/supplier/${id}/update`,
        {
          name: data.name,
          phone: data.phone,
          address: data.address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Supplier updated successfully!')
      navigate('/shop/supplier')
    } catch (error) {
      console.log(error)
      toast.error('Failed to update Supplier.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateSupplier(data)
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
          <TopLayout text='Supplier' textName='Update Supplier' links='shop/supplier' />
          <div className='p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Supllier Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters long' },
                    maxLength: { value: 50, message: 'Name must not exceed 50 characters' }
                  })}
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='phone' className='block text-sm font-medium mb-2'>
                  Supplier Phone
                </label>
                <input
                  type='number'
                  id='phone'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: {
                      value: /^0[0-9]{8,9}$/,
                      message: 'Phone number must start with 0 and between 9 and 10 numbers'
                    }
                  })}
                />
                {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='address' className='block text-sm font-medium mb-2'>
                  Supllier Address
                </label>
                <input
                  type='text'
                  id='address'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('address', {
                    required: 'Address is required',
                    minLength: { value: 5, message: 'Address must be at least 5 characters long' },
                    maxLength: { value: 100, message: 'Address must not exceed 200 characters' }
                  })}
                />
                {errors.address && <p className='text-red-500 text-xs mt-1'>{errors.address.message}</p>}
              </div>
              <button
                type='submit'
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Update Supplier'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UpdateSupplier
