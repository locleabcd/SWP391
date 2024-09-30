import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import '../../../index.css'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate } from 'react-router-dom'

function Recommendations() {
  const { isDarkMode } = useDarkMode()
  const [category, setCategory] = useState([])
  const [product, setProduct] = useState([])
  const [selectCategory, setSelectCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [pricing, setPricing] = useState('all')
  const [rating, setRating] = useState()

  const navigate = useNavigate()

  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get('https://koicaresystem.azurewebsites.net/api/categories/all', {
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

      const response = await axios.get('https://koicaresystem.azurewebsites.net/api/products/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data.data)
      setProduct(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

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
            <TopLayout text='Recommendations' links='member/recommendations' />

            <div className='mt-5 flex border-gray-200 border'>
              <div className='flex-none w-[250px] border-r border-gray-200'>
                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-xl'>Filter by Category</div>
                  <div className='flex flex-col border-b-gray-200 mt-2'>
                    <div
                      onClick={() => handleChange('all')}
                      className={`py-3 mt-2 px-6 custom rounded-xl cursor-pointer ${
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
                          className={`py-3 mt-2 px-6 custom rounded-xl ${
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
                      } py-3 mt-2 px-6 custom rounded-xl cursor-pointer flex gap-2`}
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
                      } py-3 mt-2 px-6 custom rounded-xl cursor-pointer flex gap-2`}
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
                      } py-3 mt-2 px-6 custom rounded-xl cursor-pointer flex gap-2`}
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
                        className={`py-3 mt-2 px-6 custom rounded-xl cursor-pointer flex gap-4 ${
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
                        className={`py-3 mt-2 px-6 custom rounded-xl cursor-pointer flex gap-4 ${
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

              <div className='flex-auto px-7 py-7'>
                <div className='flex justify-between items-center'>
                  <div className='font-semibold text-2xl'>Products</div>
                  <div className='flex relative justify-center items-center border border-gray-300 px-6 py-3  rounded-xl'>
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
                        d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                      />
                    </svg>
                    <input
                      type='text'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder='Search Product...'
                      className={`pl-7 font-light ${isDarkMode ? 'bg-custom-dark' : ''}  outline-none text-lg`}
                    />
                  </div>
                </div>

                {searchProduct.length > 0 ? (
                  <div className='grid grid-cols-3 gap-8 py-3 mt-4'>
                    {searchProduct.map((products) => (
                      <div
                        key={products.id}
                        className='border border-gray-200 rounded-xl hover:scale-[102%] duration-300'
                      >
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
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className={`size-11 relative rounded-full -top-[13px] cursor-pointer left-[5%] p-2 ${
                                isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'
                              }`}
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                              />
                            </svg>

                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className={`size-11 relative rounded-full -top-[55px] -right-[85%] p-2 cursor-pointer ${
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
                        <div className='px-7 py-5 text-xl mt-5 font-medium'>
                          <div className='line-clamp-1'>{products.name}</div>
                          <div className='flex justify-between'>
                            <div className='mt-3'>${products.price}</div>
                            <div className='mt-3 flex'>
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
                                    className='size-6 text-yellow-500'
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center text-gray-500 text-lg mt-10'>No products found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations
