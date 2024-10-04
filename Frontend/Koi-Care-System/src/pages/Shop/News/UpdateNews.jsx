import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form';


function UpdateNews() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [blogData, setBlogData] = useState(null);

  // const [baseImage, setBaseImage] = useState('')

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setBaseImage(reader.result)
  //     }
  //     reader.readAsDataURL(file)
  //     setSelectedFile(file)
  //   }
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/blog/getID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogData(res.data.data);
      reset(res.data.data); 
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

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
      // formData.append('blogImage', data.blogImage)
      formData.append('blogDate', data.blogDate)
      formData.append('tagIds', data.tagIds)      
      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0]); 
      } 

      const res = await axios.put(
        `https://koicaresystem.azurewebsites.net/api/blog/update/${id}`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Blog updated successfully!');
      navigate('/shop/shopNews');
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to update blog.');
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
      <div className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
        } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}>
        <Header />
        <div className='py-5 pb-10 px-[30px] mx-auto'>
          <TopLayout text='News' textName='Update News' links='shop/shopNews' />
          <div className='bg-white p-6 rounded-md border'>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-5 space-y-4'>
            <div>
              <label htmlFor="blogTitle" className="block text-sm font-bold">Blog Title</label>
              <input
                type="text"
                id="blogTitle"
                {...register('blogTitle', { required: 'Blog title is required' })}
                className={`mt-1 p-2 border ${errors.blogTitle ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.blogTitle && <p className="text-red-500 text-sm">{errors.blogTitle.message}</p>}
            </div>

            <div>
              <label htmlFor="blogContent" className="block text-sm font-bold">Blog Content</label>
              <textarea
                id="blogContent"
                {...register('blogContent', { required: 'Blog content is required' })}
                className={`mt-1 p-2 border ${errors.blogContent ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                rows="5"
              />
              {errors.blogContent && <p className="text-red-500 text-sm">{errors.blogContent.message}</p>}
            </div>

            <div>
              <label htmlFor="blogDate" className="block text-sm font-bold">Blog Date</label>
              <input
                type="date"
                id="blogDate"
                {...register('blogDate', { required: 'Blog date is required' })}
                className={`mt-1 p-2 border ${errors.blogDate ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
              />
              {errors.blogDate && <p className="text-red-500 text-sm">{errors.blogDate.message}</p>}
            </div>

            <div>
              <label htmlFor="tagIds" className="block text-sm font-bold">Tag IDs</label>
              <input
                type="text"
                id="tagIds"
                {...register('tagIds', { required: 'Tag IDs are required' })}
                className={`mt-1 p-2 border ${errors.tagIds ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                placeholder="e.g., 1,2,3"
              />
              {errors.tagIds && <p className="text-red-500 text-sm">{errors.tagIds.message}</p>}
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-bold">Upload New Image</label>
              <input
                type="file"
                id="file"
                {...register('file')}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>           
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 p-2 rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
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
