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

function UpdateImage() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const updateImage = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const formData = new FormData()
      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0])
      }

      const res = await axios.put(`https://koicaresystemv2.azurewebsites.net/apiimages/image/${id}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      toast.success('Image updated successfully!')
      navigate('/shop/productImage')
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to update Image.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateImage(data)
  }
  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} flex-1 overflow-y-auto`}
      >
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Product Images' textName='Create Images' links='shop/productImage' />
          <div className=' p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='file' className='block text-sm font-medium mb-2'>
                  Upload Images
                </label>
                <input
                  type='file'
                  id='file'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('file')}
                />
                {errors.file && <p className='text-red-500 text-xs mt-1'>{errors.file.message}</p>}
              </div>
              <button
                type='submit'
                className={`mt-5 w-full bg-blue-600 text-white p-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Update...' : 'Update Images'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UpdateImage
