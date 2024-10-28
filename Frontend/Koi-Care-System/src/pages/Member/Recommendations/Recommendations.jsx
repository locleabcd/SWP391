/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import '../../../index.css'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AddToWishlist, RemoveFromWishlist } from '../../../redux/store/wishList'
import { addToCartList } from '../../../redux/store/cartList'
import { motion } from 'framer-motion'
import Chat from '../../../components/Chat/Chat'

function Recommendations() {
  const { isDarkMode } = useDarkMode()
  const [category, setCategory] = useState([])
  const [product, setProduct] = useState([])
  const [selectCategory, setSelectCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [pricing, setPricing] = useState('all')
  const [rating, setRating] = useState()
  const [wishlist, setWishlist] = useState([])
  const [cartId, setCartId] = useState([])
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)
  const pageSize = 9

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  useEffect(() => {
    if (!isSidebarOpen) return

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSidebarOpen])

  const handleAddToWishlist = (product) => {
    let updatedWishlist

    const isProductInWishlist = wishlist.some((item) => item.id === product.id)

    if (isProductInWishlist) {
      updatedWishlist = wishlist.filter((item) => item.id !== product.id)
      dispatch(RemoveFromWishlist(product))
      toast.success('Remove to wishlist success!!', {
        autoClose: 1000
      })
    } else {
      updatedWishlist = [...wishlist, product]
      dispatch(AddToWishlist(product))
      toast.success('Add to wishlist success!!', {
        autoClose: 1000
      })
    }

    setWishlist(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const handleAddToCart = (product) => {
    dispatch(addToCartList(product))
  }

  const navigate = useNavigate()

  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get('https://koicaresystemv2.azurewebsites.net/apicategories/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(res.data.data)
      setCategory(res.data.data)
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

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get('https://koicaresystemv2.azurewebsites.net/apiproducts/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProduct(response.data.data)
      console.log(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCartId = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystemv2.azurewebsites.net/apicarts/user/${userId}/cartId`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCartId(response.data.data)
      localStorage.setItem('cartId', response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCartId()
  }, [])

  useEffect(() => {
    getProduct()
  }, [])

  useEffect(() => {
    getCategory()
  }, [])

  const handleChange = (categoryId) => {
    setSelectCategory(categoryId)
  }
  const handleSort = (option) => {
    setSort(option)
  }

  const handlePricingChange = (priceRange) => {
    setPricing(priceRange)
  }

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating)
  }

  const searchProduct = product
    .filter((products) => {
      const matchesCategory = selectCategory === 'all' || products.category.id === selectCategory
      const matchesSearch = products.name.toLowerCase().includes(search.toLowerCase())

      let matchesPricing = false
      switch (pricing) {
        case 'all':
          matchesPricing = true
          break
        case '0 - 50':
          matchesPricing = products.price >= 0 && products.price <= 50
          break
        case '50 - 100':
          matchesPricing = products.price > 50 && products.price <= 100
          break
        default:
          matchesPricing = true
      }

      let matchesRating = false
      switch (rating) {
        case 'all':
          matchesRating = true
          break
        case '1':
          matchesRating = products.rating >= 1
          break
        case '2':
          matchesRating = products.rating >= 2
          break
        case '3':
          matchesRating = products.rating >= 3
          break
        case '4':
          matchesRating = products.rating >= 4
          break
        case '5':
          matchesRating = products.rating === 5
          break
        default:
          matchesRating = true
      }

      return matchesCategory && matchesSearch && matchesPricing && matchesRating
    })
    .sort((a, b) => {
      if (sort === 'price-low-high') {
        return a.price - b.price
      } else if (sort === 'price-high-low') {
        return b.price - a.price
      }
      return 0
    })

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  const paginatedProducts = searchProduct.slice(startIndex, endIndex)
  const totalPage = Math.ceil(searchProduct.length / pageSize)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div>
      <div className='h-screen flex'>
        {isSidebarOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={() => setSidebarOpen(false)}></div>
        )}

        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />

          <Chat />

          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <TopLayout text='Recommendations' links='member/recommendations' />

            <div className='mt-5 flex lg:border-gray-200 lg:border'>
              <div className='lg:flex flex-col hidden flex-none w-[250px] border-r border-gray-200'>
                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-xl'>Filter by Category</div>
                  <div className='flex flex-col border-b-gray-200 mt-2'>
                    <div
                      onClick={() => handleChange('all')}
                      className={`py-3 mt-2 px-6 custom rounded-lg cursor-pointer ${
                        selectCategory === 'all'
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      }`}
                    >
                      All
                    </div>

                    {category.map((categories) => (
                      <div key={categories.id}>
                        <div
                          onClick={() => handleChange(categories.id)}
                          className={`py-3 mt-2 px-6 custom rounded-lg ${
                            selectCategory === categories.id
                              ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                              : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                          }  cursor-pointer`}
                        >
                          {categories.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-xl'>Sort By</div>
                  <div className='flex flex-col border-b-gray-200 mt-2'>
                    <div
                      className={`${
                        sort === 'newest'
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      } py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-2`}
                      onClick={() => handleSort('newest')}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z'
                        />
                      </svg>
                      <div>Newest</div>
                    </div>

                    <div
                      className={`${
                        sort === 'price-high-low'
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      } py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-2`}
                      onClick={() => handleSort('price-high-low')}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25'
                        />
                      </svg>

                      <div>Price: High-Low</div>
                    </div>

                    <div
                      className={`${
                        sort === 'price-low-high' ? 'bg-custom-layout-light' : 'hover:bg-custom-layout-light'
                      } py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-2`}
                      onClick={() => handleSort('price-low-high')}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12'
                        />
                      </svg>

                      <div>Price: Low-High</div>
                    </div>
                  </div>
                </div>

                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-xl'>By Pricing</div>
                  <div className='flex flex-col border-b-gray-200 mt-2'>
                    {['all', '0 - 50', '50 - 100'].map((range) => (
                      <div
                        key={range}
                        onClick={() => handlePricingChange(range)}
                        className={`py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-4 ${
                          pricing === range
                            ? isDarkMode
                              ? 'bg-custom-layout-dark'
                              : 'bg-custom-layout-light'
                            : isDarkMode
                              ? 'hover:bg-custom-layout-dark'
                              : 'hover:bg-custom-layout-light'
                        }`}
                      >
                        <input type='radio' className='scale-150' checked={pricing === range} readOnly />
                        <div>{range === 'all' ? 'All' : range}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-xl'>By Star</div>
                  <div className='flex flex-col border-b-gray-200 mt-2'>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <div
                        key={stars}
                        onClick={() => handleRatingChange(stars)}
                        className={`py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-4 ${
                          rating === stars
                            ? isDarkMode
                              ? 'bg-custom-layout-dark'
                              : 'bg-custom-layout-light'
                            : isDarkMode
                              ? 'hover:bg-custom-layout-dark'
                              : 'hover:bg-custom-layout-light'
                        }`}
                      >
                        <div className='flex items-center gap-1'>
                          {Array.from({ length: stars }).map((_, i) => (
                            <svg
                              key={i}
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='size-6 text-yellow-400'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='flex-auto lg:px-7 lg:py-7'>
                <div className='flex justify-between items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-7 lg:hidden inline-block cursor-pointer'
                    onClick={() => setSidebarOpen(true)}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                    />
                  </svg>
                  <div className='lg:inline-block hidden font-semibold text-2xl'>Products</div>
                  <div className='flex relative justify-center items-center border border-gray-300 lg:px-6 lg:py-3 py-2 px-3  rounded-lg'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='lg:size-6 size-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                      />
                    </svg>
                    <input
                      type='text'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder='Search Product...'
                      className={`lg:pl-7 pl-2 font-light ${isDarkMode ? 'bg-custom-dark' : ''}  outline-none lg:text-lg text-sm`}
                    />
                  </div>
                </div>

                {paginatedProducts.length > 0 ? (
                  <>
                    <motion.div
                      initial='hidden'
                      animate='visible'
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.3
                          }
                        }
                      }}
                      className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 py-3 mt-4'
                    >
                      {paginatedProducts.map((products, index) => (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: 100 },
                            visible: { opacity: 1, x: 0, transition: { delay: index * 0.3 } }
                          }}
                          whileHover={{ scale: 1.02 }}
                          key={products.id}
                          className='border border-gray-200 rounded-lg hover:scale-[102%] duration-300'
                        >
                          <div>
                            <div className='border-b border-gray-200 lg:max-h-[300px] md:max-h-[300px] max-h-[230px]'>
                              <Link
                                to={`/member/recommendations/${products.id}`}
                                key={products?.images[0]?.id}
                                className='cursor-pointer'
                              >
                                <img
                                  src={products?.images[0]?.downloadUrl}
                                  alt=''
                                  className='w-full lg:h-[290px] md:h-[295px] h-[230px] rounded-t-lg'
                                />
                              </Link>
                              <button aria-label='wishlist' onClick={() => handleAddToWishlist(products)}>
                                {wishlist.some((item) => item.id === products.id) ? (
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className={`size-11 relative rounded-full -top-[20px] lg:-top-[13px] text-red-500 cursor-pointer left-[50%] p-2 ${
                                      isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'
                                    }`}
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className={`size-11 relative rounded-full -top-[20px] lg:-top-[13px] cursor-pointer left-[50%] p-2 ${
                                      isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'
                                    }`}
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                                    />
                                  </svg>
                                )}
                              </button>

                              <svg
                                onClick={() => handleAddToCart(products)}
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className={`size-11 relative rounded-full lg:-top-[60px] -top-[70px] lg:-right-[85%] -right-[73%] p-2 cursor-pointer ${
                                  isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'
                                }`}
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                                />
                              </svg>
                            </div>
                          </div>
                          <div className='px-7 py-5 lg:text-xl text-lg mt-5 font-medium'>
                            <div className='line-clamp-1'>{products.name}</div>
                            <div className='flex justify-between items-center lg:mt-3 mt-1'>
                              <div className=''>
                                {' '}
                                {products.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                              </div>
                              <div className='flex'>
                                {[...Array(5)].map((_, index) => {
                                  const fullStar = index < Math.floor(products.rating)
                                  const halfStar = index < products.rating && index >= Math.floor(products.rating)

                                  return (
                                    <svg
                                      key={index}
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill={fullStar ? 'gold' : halfStar ? 'url(#half-star)' : 'none'}
                                      viewBox='0 0 24 24'
                                      strokeWidth={1.5}
                                      stroke='currentColor'
                                      className='lg:size-6 size-5 text-yellow-500'
                                    >
                                      <defs>
                                        <linearGradient id='half-star'>
                                          <stop offset='50%' stopColor='gold' />
                                          <stop offset='50%' stopColor='none' />
                                        </linearGradient>
                                      </defs>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M12 3.5l2.715 5.451 6.027.488-4.373 3.751 1.331 5.551L12 15.902l-5.7 3.839 1.331-5.551-4.373-3.751 6.027-.488L12 3.5z'
                                      />
                                    </svg>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                    <div className='flex justify-center items-center mt-6'>
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className={`px-4 py-2 text-lg border border-gray-300 rounded-md mx-1 ${
                          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                        }`}
                      >
                        Prev
                      </button>

                      {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 mx-1 border border-gray-300 rounded-md ${
                            currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        disabled={endIndex >= searchProduct.length}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className={`px-4 py-2 border border-gray-300 rounded-md mx-1 ${
                          endIndex >= searchProduct.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='text-center text-gray-500 text-lg mt-10'>No products found</div>
                )}
              </div>
            </div>

            <div
              ref={sidebarRef}
              className={`fixed top-0 left-0 h-full md:w-1/3 w-2/3 overflow-y-auto no-scroll-bar bg-white border-r border-gray-200 transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 z-50`}
            >
              <div className='px-4 py-5 border-b border-gray-200'>
                <div className='font-semibold text-xl'>Filter by Category</div>
                <div className='flex flex-col border-b-gray-200 mt-2'>
                  <div
                    onClick={() => handleChange('all')}
                    className={`py-3 mt-2 px-6 custom rounded-lg cursor-pointer ${
                      selectCategory === 'all'
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                    }`}
                  >
                    All
                  </div>

                  {category.map((categories) => (
                    <div key={categories.id}>
                      <div
                        onClick={() => handleChange(categories.id)}
                        className={`py-3 mt-2 px-6 custom rounded-lg ${
                          selectCategory === categories.id
                            ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                            : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        }  cursor-pointer`}
                      >
                        {categories.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='px-4 py-5 border-b border-gray-200'>
                <div className='font-semibold text-xl'>Sort By</div>
                <div className='flex flex-col border-b-gray-200 mt-2'>
                  <div
                    className={`${
                      sort === 'newest'
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                    } py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-2`}
                    onClick={() => handleSort('newest')}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z'
                      />
                    </svg>
                    <div>Newest</div>
                  </div>

                  <div
                    className={`${
                      sort === 'price-high-low'
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                    } py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-2`}
                    onClick={() => handleSort('price-high-low')}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25'
                      />
                    </svg>

                    <div>Price: High-Low</div>
                  </div>

                  <div
                    className={`${
                      sort === 'price-low-high' ? 'bg-custom-layout-light' : 'hover:bg-custom-layout-light'
                    } py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-2`}
                    onClick={() => handleSort('price-low-high')}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12'
                      />
                    </svg>

                    <div>Price: Low-High</div>
                  </div>
                </div>
              </div>

              <div className='px-4 py-5 border-b border-gray-200'>
                <div className='font-semibold text-xl'>By Pricing</div>
                <div className='flex flex-col border-b-gray-200 mt-2'>
                  {['all', '0 - 50', '50 - 100'].map((range) => (
                    <div
                      key={range}
                      onClick={() => handlePricingChange(range)}
                      className={`py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-4 ${
                        pricing === range
                          ? isDarkMode
                            ? 'bg-custom-layout-dark'
                            : 'bg-custom-layout-light'
                          : isDarkMode
                            ? 'hover:bg-custom-layout-dark'
                            : 'hover:bg-custom-layout-light'
                      }`}
                    >
                      <input type='radio' className='scale-150' checked={pricing === range} readOnly />
                      <div>{range === 'all' ? 'All' : range}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='px-4 py-5 border-b border-gray-200'>
                <div className='font-semibold text-xl'>By Star</div>
                <div className='flex flex-col border-b-gray-200 mt-2'>
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <div
                      key={stars}
                      onClick={() => handleRatingChange(stars)}
                      className={`py-3 mt-2 px-6 custom rounded-lg cursor-pointer flex gap-4 ${
                        rating === stars
                          ? isDarkMode
                            ? 'bg-custom-layout-dark'
                            : 'bg-custom-layout-light'
                          : isDarkMode
                            ? 'hover:bg-custom-layout-dark'
                            : 'hover:bg-custom-layout-light'
                      }`}
                    >
                      <div className='flex items-center gap-1'>
                        {Array.from({ length: stars }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-6 text-yellow-400'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                  ))}
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
