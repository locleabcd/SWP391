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
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const animatedComponents = makeAnimated()

function CreateNews() {
  const { isDarkMode } = useDarkMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [blogContent, setBlogContent] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const getTag = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/tag`, {
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
      console.log(tags)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getTag()
  }, [])

  const onSubmit = async (data) => {
    console.log('onSubmit:', data)
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const formData = new FormData()

      // Append all fields to formData
      formData.append('blogTitle', data.blogTitle)
      formData.append('blogContent', blogContent)
      formData.append('blogImage', data.blogImage)
      selectedTags.forEach((tag) => {
        formData.append('tagIds', tag.value) // Use tag.value for selected tag ID
      })
      formData.append('file', data.file[0])

      console.log(data)
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(`https://koicaresystemv2.azurewebsites.net/api/blog/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Blog created successfully!')
      navigate('/shop/shopNews')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const handleChange = (selectedTag) => {
    setSelectedTags(selectedTag)
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
          <TopLayout text='News' textName='Create News' links='shop/shopNews' />
          <div className='p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='blogTitle' className='block text-sm font-medium mb-2'>
                  Blog Title
                </label>
                <input
                  type='text'
                  id='blogTitle'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.blogTitle ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('blogTitle', { required: 'Blog Title is required' })}
                />
                {errors.blogTitle && <p className='text-red-500 text-xs mt-1'>{errors.blogTitle.message}</p>}
              </div>

              <div className='mb-4'>
                <label htmlFor='tagId' className='block text-sm font-medium mb-2'>
                  Select Tags
                </label>
                <Select
                  isMulti
                  options={tags}
                  value={selectedTags}
                  onChange={handleChange}
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

              <div className='mb-4'>
                <label htmlFor='blogContent' className='block text-sm font-medium mb-2'>
                  Blog Content
                </label>
                <ReactQuill
                  theme='snow'
                  value={blogContent}
                  onChange={setBlogContent}
                  className={`mb-20 ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'}`}
                  modules={{
                    toolbar: [
                      [{ header: '1' }, { header: '2' }, { font: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['bold', 'italic', 'underline'],
                      [{ align: [] }],
                      ['link']
                    ]
                  }}
                  style={{ height: '200px' }}
                />
              </div>

              <div className='blog-image-hidden'>
                <input
                  type='hidden'
                  id='blogImage'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.blogImage ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('blogImage', { required: false })}
                />
              </div>

              <div className='mb-4'>
                <label htmlFor='file' className='block text-sm font-medium mb-2'>
                  Upload Blog Image File
                </label>
                <input
                  type='file'
                  id='file'
                  accept='image/*'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('file', { required: 'File is required' })}
                />
                {errors.file && <p className='text-red-500 text-xs mt-1'>{errors.file.message}</p>}
              </div>

              <button
                type='submit'
                className={`px-4 py-2 bg-blue-600 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Create Blog'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNews
