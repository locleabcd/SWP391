import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import '../../../index.css'
import TopLayout from '../../../layouts/TopLayout'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

function Recommendations() {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const [productId, setProductId] = useState([])
  const [productRelate, setProductRelate] = useState([])
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [count, setCount] = useState(1)

  const images = productId.images || []

  const increment = () => {
    setCount((prevCount) => prevCount + 1)
  }

  const decrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount))
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const getProductId = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/products/product/${id}/product`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setProductId(res.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - Token expired or invalid. Logging out...')
          localStorage.removeItem('token')
          localStorage.removeItem('id')
          toast.error('Token expired navigate to login')
          navigate('/login')
        } else {
          console.error('Error fetching ponds:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  const getProductRelate = async () => {
    try {
      const token = localStorage.getItem('token')
      const cate = productId.category?.name || ''
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/products/product/${cate}/all/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!cate) {
        console.log('No category available')
      }

      const filteredProducts = res.data.data.filter((products) => String(products.id) !== String(id))
      console.log('res..', filteredProducts)

      console.log(res.data.data)
      setProductRelate(filteredProducts)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProductId()
  }, [id])

  useEffect(() => {
    if (productId?.category) {
      getProductRelate()
    }
  }, [productId])

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />

          <div className='py-5 px-[30px] mx-auto '>
            <TopLayout text='Recommendations' textName='Recommendations Detail' links='member/recommendations' />

            <div className='flex border border-gray-200 px-7 py-5 min-h-[700px]'>
              <div className='flex-none w-[600px]'>
                <div id='controls-carousel' className='relative w-full' data-carousel='static'>
                  <div className='relative h-[650px] overflow-hidden rounded-xl border border-gray-200'>
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`duration-700 ease-in-out  ${index === currentIndex ? 'block' : 'hidden'}`}
                        data-carousel-item={index === currentIndex ? 'active' : ''}
                      >
                        <img
                          src={image.downloadUrl}
                          className='absolute block w-full h-full'
                          alt={`Image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className='flex mt-4 gap-2 justify-start'>
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-32 h-32 border rounded-md overflow-hidden focus:outline-none ${
                          currentIndex === index ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <img
                          src={image.downloadUrl}
                          className='w-full h-full object-cover'
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type='button'
                    className='absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                    onClick={prevImage}
                  >
                    <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-black'>
                      <svg
                        className='w-4 h-4 text-white rtl:rotate-180'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 6 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 1 1 5l4 4'
                        />
                      </svg>
                      <span className='sr-only'>Previous</span>
                    </span>
                  </button>
                  <button
                    type='button'
                    className='absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                    onClick={nextImage}
                  >
                    <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-black'>
                      <svg
                        className='w-4 h-4 text-white rtl:rotate-180'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 6 10'
                      >
                        <path
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='m1 9 4-4-4-4'
                        />
                      </svg>
                      <span className='sr-only'>Next</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className='flex-auto px-10 py-8'>
                <div className='border-b border-gray-200 pb-8'>
                  <div className='flex gap-5 items-center'>
                    <div className='px-2 py-2 rounded-2xl bg-custom-layout-light'>In Stock</div>
                    <div>{productId.category?.name || 'No category available'}</div>
                  </div>
                  <div className='text-3xl font-semibold mt-5'>{productId.name}</div>
                  <div className='text-xl text-justify mt-5'>{productId.description}</div>
                  <div className='text-3xl mt-5 font-semibold'>${productId.price}</div>
                </div>

                <div className='flex mt-5 gap-5 items-center border-b border-gray-200 pb-10 pt-5'>
                  <div className='text-3xl font-semibold'>Quantity:</div>
                  <div className='flex border border-blue-400 gap-5 rounded-lg'>
                    <button className='border-blue-400 border-r rounded-lg p-2' onClick={decrement}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-8 text-blue-400'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                      </svg>
                    </button>
                    <input
                      type='text'
                      value={count}
                      readOnly
                      className='outline-none w-10 text-center text-xl text-blue-400'
                    />
                    <button className='border-l border-blue-400 p-2' onClick={increment}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-8 text-blue-400'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className='flex mt-5 gap-5 items-center border-b border-gray-200 pb-10 pt-5'>
                  <button className='text-xl py-4 px-10 bg-blue-400 hover:bg-blue-500 text-white rounded-lg'>
                    Buy Now
                  </button>
                  <button className='text-xl py-4 px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg'>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>

            <div className='mt-20'>
              <div className='text-3xl font-semibold'>Related Products</div>
              <div>
                <div className='grid grid-cols-4 gap-8 py-3 mt-4'>
                  {productRelate.length > 0 ? (
                    productRelate.map((products) => (
                      <div key={products.id} className='border border-gray-200 rounded-xl hover:scale-105 duration-300'>
                        <div>
                          <div className='border-b border-gray-200 max-h-[300px]'>
                            <Link
                              to={`/member/recommendations/${products.id}`}
                              key={products.images[0].id}
                              className='min-h-[150px] cursor-pointer'
                            >
                              <img
                                src={products.images[0].downloadUrl}
                                alt=''
                                className='w-full h-[290px] rounded-t-lg'
                              />
                            </Link>
                          </div>
                        </div>
                        <div className='px-7 py-5 text-xl mt-5 font-medium'>
                          <div className='line-clamp-1'>{products.name}</div>
                          <div className='mt-3'>${products.price}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-lg'>No related products found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations
