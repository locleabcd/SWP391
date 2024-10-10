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

function UpdateProduct() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/categories/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCategories(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching category:', error)
    }
  }

  useEffect(() => {
    getCategory()
  }, [])

  const getSupplier = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/suppliers/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuppliers(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getSupplier()
  }, [])

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/products/product/${id}/product`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setProducts(res.data.data)
      reset(res.data.data)
    } catch (error) {
      console.error('Error fetching Product:', error)
      toast.error('Failed to fetch Product details.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const updateProduct = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.put(
        `https://koicaresystemv3.azurewebsites.net/api/products/product/${id}/update`,
        {
          name: data.name,
          brand: data.brand,
          price: data.price,
          inventory: data.inventory,
          description: data.description,
          description_detail: data.description_detail,
          category: {
            id: products.category.id,
            name: products.category.name
          },
          supplierName: data.supplierName,
          issueTypeId: data.issueTypeId
            .split(',')
            .map((id) => parseInt(id.trim()))
            .filter((id) => !isNaN(id))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success('Product updated successfully!')
      navigate('/shop/product')
    } catch (error) {
      console.log(data.id)
      console.log(error)
      toast.error('Failed to update Product.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateProduct(data)
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Product' textName='Update Product' links='shop/product' />
          <div className='bg-white p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Product Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`relative w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('name', { required: 'Name is required', minLength: 2, maxLength: 50 })}
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='brand' className='block text-sm font-medium mb-2'>
                  Brand
                </label>
                <input
                  type='text'
                  id='brand'
                  className={`relative w-full p-2 border rounded-md ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('brand', { required: 'Brand is required' })}
                />
                {errors.brand && <p className='text-red-500 text-xs mt-1'>{errors.brand.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='price' className='block text-sm font-medium mb-2'>
                  Price
                </label>
                <input
                  type='number'
                  id='price'
                  className={`relative w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('price', { required: 'Price is required' })}
                />
                {errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='inventory' className='block text-sm font-medium mb-2'>
                  Inventory
                </label>
                <input
                  type='number'
                  id='inventory'
                  className={`relative w-full p-2 border rounded-md ${errors.inventory ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('inventory', { required: 'Inventory is required' })}
                />
                {errors.inventory && <p className='text-red-500 text-xs mt-1'>{errors.inventory.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='description' className='block text-sm font-medium mb-2'>
                  Description
                </label>
                <textarea
                  id='description'
                  className={`relative w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description.message}</p>}
              </div>
              <div className='mb-4'>
                <label htmlFor='description_detail' className='block text-sm font-medium mb-2'>
                  Detailed Description
                </label>
                <textarea
                  id='description_detail'
                  className={`relative w-full p-2 border rounded-md ${errors.description_detail ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('description_detail', { required: 'Detailed description is required' })}
                />
                {errors.description_detail && (
                  <p className='text-red-500 text-xs mt-1'>{errors.description_detail.message}</p>
                )}
              </div>

              <div className='mb-4'>
                <label htmlFor='category' className='block text-sm font-medium mb-2'>
                  Category
                </label>
                <select
                  id='category'
                  className={`relative w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('category')}
                  defaultValue={products.category ? products.category.id : 'null'}
                  onChange={(e) => {
                    const selectedCategory = categories.find((category) => category.id == e.target.value)
                    setProducts({ ...products, category: selectedCategory })
                  }}
                >
                  {products.category && <option value={products.category.id}>{products.category.name}</option>}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className='text-red-500 text-xs mt-1'>{errors.category.message}</p>}
              </div>

              <div className='mb-4'>
                <label htmlFor='supplierName' className='block text-sm font-medium mb-2'>
                  Supplier
                </label>
                <select
                  id='supplierName'
                  className={`relative w-full p-2 border rounded-md ${errors.supplierName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('supplierName')}
                >
                  <option value={products.supplier ? products.supplier.name : ''}>
                    {products.supplier ? products.supplier.name : ''}
                  </option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplierName && <p className='text-red-500 text-xs mt-1'>{errors.supplierName.message}</p>}
              </div>

              <div className='mb-4'>
                <label htmlFor='issueTypeId' className='block text-sm font-medium mb-2'>
                  Issue Type
                </label>
                <input
                  type='text'
                  id='issueTypeId'
                  className={`relative w-full p-2 border rounded-md ${errors.issueTypeId ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('issueTypeId', { required: 'Issue Type ID is required' })}
                />
                {errors.issueTypeId && <p className='text-red-500 text-xs mt-1'>{errors.issueTypeId.message}</p>}
              </div>
              <button
                type='submit'
                className={`mt-5 w-full bg-blue-600 text-white p-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Update...' : 'Update Product'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UpdateProduct
