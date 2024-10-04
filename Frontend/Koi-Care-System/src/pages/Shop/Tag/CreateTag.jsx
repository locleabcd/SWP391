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

function CreateTag() {
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
      const res = await axios.post(`https://koicaresystem.azurewebsites.net/api/tag/create`, 
      {
        tagName: data.tagName, 
        tagDescription: data.tagDescription
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      toast.success('Tag created successfully!')
      navigate('/shop/tag')
      
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to create tag.');
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex">
      <LeftSideBar />
      <div className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
      } overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}>
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Tag' textName='Create Tag' links='shop/tag' />
          <div className='bg-white p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor="tagName" className='block text-sm font-medium mb-2'>
                Tag Name
                </label>
                <input
                  type='text'
                  id="tagName"
                  className={`relative w-full p-2 border rounded-md ${errors.tagName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('tagName', { required: 'Tag Name is required' })}
                />
                {errors.tagName && <p className='text-red-500 text-xs mt-1'>{errors.tagName.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor="tagDescription" className='block text-sm font-medium mb-2'>
                Tag Description
                </label>
                <input
                  type='text'
                  id="tagDescription"
                  className={`relative w-full p-2 border rounded-md ${errors.tagDescription ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('tagDescription', { required: 'Tag Description is required' })}
                  
                />
                {errors.tagDescription && <p className='text-red-500 text-xs mt-1'>{errors.tagDescription.message}</p>}
              </div>
              <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Create Tag'}
            </button>
            </form>
          </div>

        </div>
      </div>


      
    </div>
  )
}
export default CreateTag