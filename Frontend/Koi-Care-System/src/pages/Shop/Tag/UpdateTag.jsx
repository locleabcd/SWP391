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

function UpdateTag() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tagData, setTagData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const fetchTag = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/tag/getID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTagData(res.data.data);
      reset(res.data.data); 
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTag();
  }, [id]);

  const updateTag = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.put(
        `https://koicaresystem.azurewebsites.net/api/tag/update/${id}`,
        {
          tagName: data.tagName, 
          tagDescription: data.tagDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Tag updated successfully!');
      navigate('/shop/tag');
    } catch (error) {
      console.log(error)
      toast.error('Failed to update tag.');
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateTag(data)
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
      } overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}>
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Tag' textName='Update Tag' links='shop/tag' />
          <div className='bg-white p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='mt-5 space-y-4'>
              <div>
                <label htmlFor="tagName" className="block text-sm font-bold">Tag Name</label>
                <input
                  type="text"
                  id="tagName"
                  {...register('tagName', { required: 'Tag Name is required' })}
                  className={`mt-1 p-2 border ${errors.tagName ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                />
                {errors.tagName && <p className="text-red-500 text-sm">{errors.tagName.message}</p>}
              </div>
              <div>
                <label htmlFor="tagDescription" className="block text-sm font-bold">Tag Description</label>
                <input
                  type="text"
                  id="tagDescription"
                  {...register('tagDescription', { required: 'Tag Description is required' })}
                  className={`mt-1 p-2 border ${errors.tagDescription ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                />
                {errors.tagDescription && <p className="text-red-500 text-sm">{errors.tagDescription.message}</p>}
              </div>
              <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 p-2 rounded ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {isSubmitting ? 'Updating...' : 'Update Tag'}
            </button>
            </form>
          </div>
        </div>
      </div>


    </div>
  )
}
export default UpdateTag