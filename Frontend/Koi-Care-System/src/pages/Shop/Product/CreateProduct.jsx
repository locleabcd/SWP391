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

const animatedComponents = makeAnimated()

function CreateProduct() {
  const { isDarkMode } = useDarkMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [issues, setIssues] = useState([])
  const [selectedIssues, setSelectedIssues] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const getIssue = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/issues/issueType/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setIssues(
        res.data.data.map((issue) => ({
          value: issue.id,
          label: `${issue.parameterType} - ${issue.conditionType}`
        }))
      )
    } catch (error) {
      console.log('Error fetching issue type:', error)
    }
  }

  useEffect(() => {
    getIssue()
  }, [])

  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/categories/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCategories(res.data.data)
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

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/suppliers/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuppliers(res.data.data)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getSupplier()
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

      const issueTypeIds = selectedIssues.map((issue) => issue.value)

      const res = await axios.post(
        `https://koicaresystemv2.azurewebsites.net/api/products/add`,
        {
          name: data.name,
          brand: data.brand,
          price: data.price,
          inventory: data.inventory,
          description: data.description,
          description_detail: data.description_detail,
          category: data.category,
          supplierName: data.supplierName,
          issueTypeId: issueTypeIds
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const productId = res.data.data.id

      const files = data.files
      if (files && files.length > 0) {
        const formData = new FormData()
        for (const file of files) {
          formData.append('files', file)
        }
        formData.append('productId', productId)

        await axios.post(`https://koicaresystemv2.azurewebsites.net/api/images/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }
      toast.success('Product created successfully!')
      navigate('/shop/product')
    } catch (error) {
      console.log(error)
      toast.error('Failed to create Product.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const handleChange = (selectedIssues) => {
    setSelectedIssues(selectedIssues)
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} flex-1 overflow-y-auto`}
      >
        <Header />
        <div className='py-5 pb-0 px-[30px] mx-auto'>
          <TopLayout text='Product' textName='Create Product' links='shop/product' />
          <div className=' p-6 rounded-md border'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Product Name
                </label>
                <input
                  type='text'
                  id='name'
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.inventory ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.description_detail ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value=''>Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
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
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.supplierName ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('supplierName', { required: 'Supplier is required' })}
                >
                  <option value=''>Select Supplier</option>
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
                  Select Issue
                </label>
                <Select
                  isMulti
                  options={issues}
                  value={selectedIssues}
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
              </div>

              <div className='mb-4'>
                <label htmlFor='files' className='block text-sm font-medium mb-2'>
                  Upload Images
                </label>
                <input
                  type='file'
                  id='files'
                  multiple
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } ${errors.files ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('files')}
                />
                {errors.files && <p className='text-red-500 text-xs mt-1'>{errors.files.message}</p>}
              </div>
              <button
                type='submit'
                className={`mt-5 w-full bg-blue-600 text-white p-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateProduct
