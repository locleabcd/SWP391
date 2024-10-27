import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useForm } from 'react-hook-form'
function CreateImage() {
  const { isDarkMode } = useDarkMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`http://68.183.232.120:8080/api/products/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getProduct()
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
      const files = data.files
      if (files && files.length > 0) {
        const formData = new FormData()
        for (const file of files) {
          formData.append('files', file)
        }
        formData.append('productId', data.productId)

        const res = await axios.post(`http://68.183.232.120:8080/api/images/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success('Images created successfully!')
        navigate('/shop/productImage')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
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
                <label htmlFor='productId' className='block text-sm font-medium mb-2'>
                  Product
                </label>
                <select
                  id='productId'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.productId ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('productId', { required: 'Product is required' })}
                >
                  <option value=''>Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.productId && <p className='text-red-500 text-xs mt-1'>{errors.productId.message}</p>}
              </div>

              <div className='mb-4'>
                <label htmlFor='files' className='block text-sm font-medium mb-2'>
                  Upload Images
                </label>
                <input
                  type='file'
                  id='files'
                  multiple
                  className={`relative w-full p-2 border rounded-md ${errors.files ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('files')}
                />
                {errors.files && <p className='text-red-500 text-xs mt-1'>{errors.files.message}</p>}
              </div>
              <button
                type='submit'
                className={`mt-5 w-full bg-blue-600 text-white p-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Images'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateImage
