import TopLayout from '../../../layouts/TopLayout'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { AddToWishlist, RemoveFromWishlist } from '../../../redux/store/wishList'
import { useDispatch } from 'react-redux'
import { addToCartList } from '../../../redux/store/cartList'
import { toast } from 'react-toastify'

function MyPondIssue() {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const [issue, setIssue] = useState([])
  const [product, setProduct] = useState([])
  const [selectCategory, setSelectCategory] = useState('')
  const [wishlist, setWishlist] = useState([])
  const dispatch = useDispatch()

  const handleAddToCart = (product) => {
    dispatch(addToCartList(product))
  }

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

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

  const getIssue = async () => {
    try {
      const token = localStorage.getItem('token')
      const koipondId = id
      const res = await axios.get(`http://146.190.84.154:8080/api/issues/latest/${koipondId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setIssue(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const getProduct = async (issueTypeId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`http://146.190.84.154:8080/api/products/recommend/${issueTypeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProduct(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  const handleChange = (categoryId) => {
    setSelectCategory(categoryId)
  }

  useEffect(() => {
    getIssue()
  }, [])

  useEffect(() => {
    if (issue.length > 0) {
      setSelectCategory(issue[0].id)
      getProduct(issue[0].issueTypeId)
    }
  }, [issue])

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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <TopLayout text='My Pond' textName='My Pond Issue' links='member/myPond' />

            <div className='border flex border-gray-200 mt-10'>
              <div className='flex-none w-[250px] border-r border-gray-200'>
                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-2xl mt-2'>All Issues</div>
                  <div className='border-b-gray-200 mt-5'>
                    {issue.map((issues) => (
                      <div
                        className={`py-3 mt-2 px-6 custom rounded-xl ${
                          selectCategory === issues.id
                            ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                            : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        }  cursor-pointer`}
                        onClick={() => {
                          getProduct(issues.issueTypeId)
                          handleChange(issues.id)
                        }}
                        key={issues.id}
                      >
                        {issues.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex-none w-[850px] px-7 py-7 border-gray-200 border-r'>
                <div className='flex flex-col'>
                  <div className='font-semibold text-2xl'>Products</div>
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
                    className='grid grid-cols-2 gap-8 py-3 mt-4'
                  >
                    {product.length > 0 ? (
                      product.map((products, index) => (
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: 100 },
                            visible: { opacity: 1, x: 0, transition: { delay: index * 0.3 } }
                          }}
                          key={products.id}
                          whileHover={{ scale: 1.02 }}
                          className='border border-gray-200 rounded-xl hover:scale-[102%] duration-300'
                        >
                          <div>
                            <div className='border-b border-gray-200 max-h-[300px]'>
                              <Link
                                to={`/member/recommendations/${products.id}`}
                                key={products?.images[0]?.id}
                                className='min-h-[150px] cursor-pointer'
                              >
                                <img
                                  src={products?.images[0]?.downloadUrl}
                                  alt=''
                                  className='w-full h-[290px] rounded-t-lg'
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
                                    className={`size-11 relative rounded-full -top-[13px] text-red-500 cursor-pointer left-[50%] p-2 ${
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
                                    className={`size-11 relative rounded-full -top-[13px] cursor-pointer left-[50%] p-2 ${
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
                                className={`size-11 relative rounded-full -top-[60px] -right-[85%] p-2 cursor-pointer ${
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
                              <div className='mt-3'>
                                {' '}
                                {products.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                              </div>
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
                        </motion.div>
                      ))
                    ) : (
                      <div className=''>No product found</div>
                    )}
                  </motion.div>
                </div>
              </div>
              <div className='flex-auto px-7 py-7'>
                <div className='text-start font-semibold text-2xl'>Description</div>
                <div className='text-2xl mt-5 text-justify'>
                  {issue.length > 0 ? issue[0]?.description : 'No description available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPondIssue
