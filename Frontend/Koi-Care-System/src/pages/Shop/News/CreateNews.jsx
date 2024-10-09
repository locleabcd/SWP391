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

function CreateNews() {
  const { isDarkMode } = useDarkMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState([])

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

      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/tag`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTags(res.data.data)
      console.log(res.data.data)
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
      formData.append('blogContent', data.blogContent)
      formData.append('blogImage', data.blogImage)
      selectedTagIds.forEach(tagId => {
        formData.append('tagIds', tagId)
      });
      formData.append('file', data.file[0])

      console.log(data)
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(`https://koicaresystem.azurewebsites.net/api/blog/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
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

  const handleTagChange = (tagId) => {
    setSelectedTagIds((prevSelected) => {
      if (prevSelected.includes(tagId)) {
        // If already selected, remove it
        return prevSelected.filter(id => id !== tagId);
      } else {
        // Otherwise, add it
        return [...prevSelected, tagId];
      }
    });
  };
  
  return(
    <div className="h-screen flex">
      <LeftSideBar />
      <div className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
      } overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}>
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='News' textName='Create News' links='shop/shopNews' />
          <div className='p-6 rounded-md border'>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='mb-4'>
              <label htmlFor="blogTitle" className='block text-sm font-medium mb-2'>
                Blog Title
              </label>
              <input
                type='text'
                id="blogTitle"
                className={`w-full p-2 border rounded-md ${errors.blogTitle ? 'border-red-500' : 'border-gray-300'}`}
                {...register('blogTitle', { required: 'Blog Title is required' })}
                
              />
              {errors.blogTitle && <p className='text-red-500 text-xs mt-1'>{errors.blogTitle.message}</p>}
            </div>         

            <div className='mb-4'>
              <label htmlFor="blogContent" className='block text-sm font-medium mb-2'>
                Blog Content
              </label>
              <textarea
                  id="blogContent"
                  className={`w-full p-2 border rounded-md ${errors.blogContent ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('blogContent', { required: 'Blog Content is required' })}
                  rows={20}
              />
                {errors.blogContent && <p className='text-red-500 text-xs mt-1'>{errors.blogContent.message}</p>}
            </div>

            <div className='blog-image-hidden'>              
              <input
                type="hidden"
                id="blogImage"
                className={`w-full p-2 border rounded-md ${errors.blogImage ? 'border-red-500' : 'border-gray-300'}`}
                {...register('blogImage', { required: false })}
              />               
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>
                Select Tags
              </label>
              <div>
                {tags.length > 0 ? (
                  tags.map(tag => (
                    <div key={tag.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`tag-${tag.tagId}`}
                        value={tag.id}
                        checked={selectedTagIds.includes(tag.tagId)}
                        onChange={() => handleTagChange(tag.tagId)}
                        className='mr-2'
                      />
                      <label htmlFor={`tag-${tag.tagId}`} className='text-sm'>{tag.tagName}</label>
                    </div>
                  ))
                ) : (
                  <p>Loading tags...</p>
                )}
              </div>
              {selectedTagIds.length === 0 && <p className='text-red-500 text-xs mt-1'>At least one tag is required</p>}
            </div>


            <div className='mb-4'>
              <label htmlFor="file" className='block text-sm font-medium mb-2'>
                Upload Blog Image File
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                className={`w-full p-2 border rounded-md ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                {...register('file', { required: 'File is required' })}
              />
              {errors.file && <p className='text-red-500 text-xs mt-1'>{errors.file.message}</p>}
            </div>

            <button
              type="submit"
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