/* eslint-disable no-unused-vars */
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
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

function UpdateNews() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [blogData, setBlogData] = useState(null)
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/blog/getID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setBlogData(res.data.data)
      reset(res.data.data)
      setSelectedTags(res.data.data.tags.map((tag) => ({ value: tag.tagId, label: tag.tagName })))
    } catch (error) {
      console.error('Error fetching blog:', error)
      toast.error('Failed to fetch blog details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlog()
  }, [id])

  const getTag = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/tag`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTags(
        res.data.data.map((tag) => ({
          value: tag.tagId,
          label: tag.tagName
        }))
      )
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getTag()
  }, [])

  const updateBlog = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const formData = new FormData()
      formData.append('blogTitle', data.blogTitle)
      formData.append('blogContent', data.blogContent)
      formData.append('blogDate', data.blogDate)
      selectedTags.forEach((tag) => {
        formData.append('tagIds', tag.value)
      })
      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0])
      }

      const res = await axios.put(`https://koicaresystemv3.azurewebsites.net/api/blog/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      toast.success('Blog updated successfully!')
      navigate('/shop/shopNews')
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to update blog.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateBlog(data)
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} flex-1 flex-col overflow-y-auto overflow-x-hidden`}
      >
        <Header />
        <div className='py-5 pb-10 px-[30px] mx-auto'>
          <TopLayout text='News' textName='Update News' links='shop/shopNews' />
          <div className=' p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-5 space-y-4'>
              <div>
                <label htmlFor='blogTitle' className='block text-sm font-bold mb-2'>
                  Blog Title
                </label>
                <input
                  type='text'
                  id='blogTitle'
                  {...register('blogTitle', { required: 'Blog title is required' })}
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.blogTitle ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.blogTitle && <p className='text-red-500 text-sm'>{errors.blogTitle.message}</p>}
              </div>

              <div>
                <label className='block text-sm font-bold mb-2'>Select Tags</label>
                <Select
                  isMulti
                  options={tags}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                      borderColor: errors.tags ? '#EF4444' : '#D1D5DB',
                      '&:hover': {
                        borderColor: errors.tags ? '#EF4444' : '#9CA3AF'
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
                {selectedTags.length === 0 && <p className='text-red-500 text-xs mt-1'>At least one tag is required</p>}
              </div>

              <div>
                <label htmlFor='blogContent' className='block text-sm font-bold mb-2'>
                  Blog Content
                </label>
                <textarea
                  id='blogContent'
                  {...register('blogContent', { required: 'Blog content is required' })}
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.blogContent ? 'border-red-500' : 'border-gray-300'}`}
                  rows='5'
                />
                {errors.blogContent && <p className='text-red-500 text-sm'>{errors.blogContent.message}</p>}
              </div>

              <div>
                <label htmlFor='blogDate' className='block text-sm font-bold'>
                  Blog Date
                </label>
                <input
                  type='date'
                  id='blogDate'
                  {...register('blogDate', { required: 'Blog date is required' })}
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.blogDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.blogDate && <p className='text-red-500 text-sm'>{errors.blogDate.message}</p>}
              </div>

              <div>
                <label htmlFor='file' className='block text-sm font-bold mb-2'>
                  Upload Blog Image File
                </label>
                <input
                  type='file'
                  id='file'
                  accept='image/*'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('file')}
                />
                {errors.file && <p className='text-red-500 text-xs mt-1'>{errors.file.message}</p>}
              </div>

              <button
                type='submit'
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Blog'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateNews
