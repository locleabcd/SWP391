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
  const [tags, setTags] = useState([]); // To hold available tags
  const [selectedTagIds, setSelectedTagIds] = useState([]); // To hold selected tag IDs

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
      selectedTagIds.forEach(tagId => {
        formData.append('tagIds', tagId)
      });      
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
