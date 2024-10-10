import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'

function Product() {
  const { isDarkMode } = useDarkMode()
  const [products,setProducts] = useState([])
  // const [showButtons, setShowButtons] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const fallbackImage = 'https://5sfashion.vn/storage/upload/images/posts/Z5FgdGRa5ycTaCqcMZnHfZTkb7FyHATji17rlS4q.jpg'

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/products/all`, {
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

  const deleteProduct = async (id) => {
    const isConfirmed = window.confirm('Are you sure to delete product ?')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/products/product/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Product deleted successfully')
      getProduct()
    } catch (error) {
      console.error('Error deleting Product:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}>
          <Header />
          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='Products' />
            <div className='w-full flex justify-between items-center relative'>
              <div className='cursor-pointer'>
                <button 
                  className='py-2 px-3 bg-custom-left-bar text-white hover:bg-blue-600 rounded-md'
                  onClick={() => navigate('/shop/createProduct')}
                >
                  New Product
                </button>
              </div>
              <div className='flex items-center'>          
                <input type='text' className='p-1 border rounded-md mr-4' placeholder='Search' />
                <div className='cursor-pointer'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8 text-red-500'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className='overflow-x-auto mt-6'>
              <table className='min-w-full border-spacing-x-1 border-gray-200'>
                <thead className=''>
                  <tr className='border-b'>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>No</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Image</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Name</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Brand</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Price</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Inventory</th>
                    <th className='py-3 px-4  text-center text-xs font-bold uppercase'>Description</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Category</th>
                    <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Supplier</th>
                    <th className='py-3  px-4 text-center text-xs font-bold uppercase'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className=''>
                      <td className='py-2 px-1 text-center border-b border-gray-200'>{index+1}</td>
                      <td className='py-2 pl-4 text-center border-b border-gray-200'>
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0].downloadUrl : fallbackImage}
                          alt='Product'
                          className='w-40 h-20 object-cover rounded-md'
                        />
                      </td>
                      <td className='py-2 pl-4 text-center border-b border-gray-200'>{product.name}</td>
                      <td className='py-2 px-1 text-center border-b border-gray-200'>{product.brand}</td>
                      <td className='py-2 px-1 text-center border-b border-gray-200'>{`$${product.price.toFixed(2)}`}</td>
                      <td className='py-2 px-1 text-center border-b border-gray-200'>{product.inventory}</td>
                      <td className='py-2 text-start border-b border-gray-200'>
                        <span title={product.description}>{product.description.length > 120 ? `${product.description.slice(0, 120)} ...` : product.description}</span>
                      </td>
                      <td className='py-2 px-1 text-center border-b border-gray-200'>{product.category && product.category.name}</td>
                      <td className='py-2 text-center border-b border-gray-200'>{product.supplier && product.supplier.name }</td>
                      <td className='py-2 px-1 text-center border-b border-gray-200'>
                        <div className='flex justify-center items-center'>
                          <Link to={`/shop/product/${product.id}`} className='p-1 hover:bg-green-500 text-green-500 hover:text-white rounded-full'>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="currentColor" 
                              className="size-5">
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                          </Link>
                          <Link to={`/shop/product/view/${product.id} `} className=' p-1 hover:bg-blue-500 text-blue-500 hover:text-white  rounded-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 ">
                                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                </svg>
                          </Link>
                          <button className='p-1 hover:bg-red-500 text-red-600 hover:text-white rounded-full' onClick={() => deleteProduct(product.id)}>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className="size-5">
                                <path 
                                fillRule="evenodd" 
                                d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005
                                  13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0
                                  1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 
                                  52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0
                                  1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428
                                  1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75
                                  0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" 
                                clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>   
  )
}
export default Product