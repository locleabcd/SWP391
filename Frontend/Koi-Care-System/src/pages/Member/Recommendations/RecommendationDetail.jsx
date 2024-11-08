import { Link, useParams } from 'react-router-dom'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import '../../../index.css'
import TopLayout from '../../../layouts/TopLayout'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { addToCartList } from '../../../redux/store/cartList'
import { useDispatch } from 'react-redux'
import '../../../index.css'

function Recommendations() {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const [productId, setProductId] = useState([])
  const [productRelate, setProductRelate] = useState([])
  const [bought, setBought] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [count, setCount] = useState(1)
  const [active, setActive] = useState('description')
  const [feedback, setFeedback] = useState([])
  const [feedbackUser, setFeedbackUser] = useState([])
  const [visibleId, setVisibleId] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [editableFeedback, setEditableFeedback] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useDispatch()

  const handleAddToCart = (product) => {
    if (productId.inventory < count) {
      toast.warn('This product is out of stock')
    } else {
      dispatch(addToCartList(product, count))
    }
  }

  const toggleHide = (id) => {
    setVisibleId(visibleId === id ? null : id)
  }

  const images = productId.images || []

  const decrement = () => {
    setCount((prevCount) => Math.max(prevCount - 1, 0))
  }

  const increment = () => {
    setCount((prevCount) => Math.min(prevCount + 1, productId.inventory))
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const getFeedbackUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      const productId = id

      const res = await axios.get(
        `https://koicaresystemv2.azurewebsites.net/api/feedbacks/user/${userId}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setFeedbackUser(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.error('An unexpected error occurred:', error)
    }
  }

  useEffect(() => {
    getFeedbackUser()
  }, [])

  const getProductId = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/products/product/${id}/product`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setProductId(res.data.data)
    } catch (error) {
      console.error('An unexpected error occurred:', error)
    }
  }

  const getProductBought = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      const productId = id

      const res = await axios.get(
        `https://koicaresystemv2.azurewebsites.net/api/orders/isBought/user/${userId}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const buy = res.data.data.split('T')
      setBought(buy)
      console.log(buy)
    } catch (error) {
      console.error('An unexpected error occurred:', error)
    }
  }

  useEffect(() => {
    getProductBought()
  }, [])

  const getProductRelate = async () => {
    try {
      const token = localStorage.getItem('token')
      const cate = productId.category?.name || ''
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(
        `https://koicaresystemv2.azurewebsites.net/api/products/product/${cate}/all/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const filteredProducts = res.data.data.filter((products) => String(products.id) !== String(id))
      setProductRelate(filteredProducts)
    } catch (error) {
      console.log(error)
    }
  }

  const getFeedback = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/feedbacks/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFeedback(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteFeedback = async (id) => {
    try {
      const token = localStorage.getItem('token')

      await axios.delete(`https://koicaresystemv2.azurewebsites.net/api/feedbacks/feedback/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      getFeedback()
      setFeedbackUser(false)
    } catch (err) {
      console.log(err)
    }
  }

  const createFeedback = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')

      await axios.post(
        'https://koicaresystemv2.azurewebsites.net/api/feedbacks',
        {
          star: rating,
          comment: comment,
          userId: userId,
          productId: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      getFeedback()
      setFeedbackUser(true)
      setRating(0)
      setComment('')
      setHoveredRating(0)
    } catch (error) {
      console.error('Error details:', error)
    }
  }

  const handleEdit = (feedbacks) => {
    setEditableFeedback(feedbacks)
    localStorage.setItem('id_feed', feedbacks.id)
    setRating(feedbacks.star)
    setComment(feedbacks.comment)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditableFeedback(null)
    setRating(0)
    setComment('')
    setHoveredRating(0)
    setIsEditing(false)
  }

  const updateFeedback = async () => {
    try {
      const token = localStorage.getItem('token')
      const id_feedback = localStorage.getItem('id_feed')

      await axios.put(
        'https://koicaresystemv2.azurewebsites.net/api/feedbacks',
        {
          id: id_feedback,
          star: rating,
          comment: comment,
          productId: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      getFeedback()
      setRating(0)
      setComment('')
      setHoveredRating(0)
      setEditableFeedback(null)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFeedback()
  }, [])

  useEffect(() => {
    getProductId()
  }, [id])

  useEffect(() => {
    if (productId?.category) {
      getProductRelate()
    }
  }, [productId])

  localStorage.setItem('totalPrice', productId?.price * count)
  if (productId?.promotions?.length > 0) {
    const promotionPrice =
      ((productId?.price * (100 - productId.promotions[productId.promotions.length - 1]?.discountRate)) / 100) * count
    localStorage.setItem('promotionTotal', promotionPrice)
  } else {
    const promotionPrice = productId?.price * count
    localStorage.setItem('promotionTotal', promotionPrice)
  }

  const userId = localStorage.getItem('id')

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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px] '>
            <TopLayout text='Recommendations' textName='Detail' links='member/recommendations' />

            <div className='grid lg:grid-cols-7 grid-cols-1 lg:border lg:border-gray-200 lg:px-7 lg:py-5 min-h-[700px] rounded-xl'>
              <div className='col-span-3'>
                <div id='controls-carousel' className='relative w-full' data-carousel='static'>
                  <div className='relative lg:h-[650px] md:h-[650px] h-[350px] duration-500 transition-all overflow-hidden rounded-xl border border-gray-200'>
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`duration-500 transition-all  ${index === currentIndex ? 'block' : 'hidden'}`}
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
                        className={`lg:size-32 md:size-32 size-20 border rounded-md overflow-hidden focus:outline-none ${
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
                    className='absolute lg:top-0 -top-10 lg:start-0 -start-3 z-10 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                    onClick={prevImage}
                  >
                    <span className='inline-flex items-center justify-center lg:size-8 size-6 rounded-full bg-black'>
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
                    className='absolute lg:top-0 -top-10 lg:end-0 -end-3 z-10 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                    onClick={nextImage}
                  >
                    <span className='inline-flex items-center justify-center lg:size-8 size-6 rounded-full bg-black'>
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
              <div className='col-span-4 lg:px-10 lg:py-8 py-5'>
                <div className='border-b border-gray-200 pb-8'>
                  <div className='flex gap-5 items-center'>
                    {productId.inventory > 0 ? (
                      <>
                        <div
                          className={`p-2 rounded-2xl ${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'} `}
                        >
                          In Stock
                        </div>
                        <div>{productId.category?.name || 'No category available'}</div>
                      </>
                    ) : (
                      <>
                        <div className={`p-2 rounded-2xl text-white ${isDarkMode ? 'bg-red-500' : 'bg-red-500'} `}>
                          Out of Stock
                        </div>
                        <div>{productId.category?.name || 'No category available'}</div>
                      </>
                    )}
                  </div>

                  <div className='lg:text-3xl md:text-2xl text-xl font-semibold mt-5'>{productId.name}</div>
                  <div className='lg:text-xl md:text-xl text-lg text-justify mt-5'>{productId.description}</div>
                  {productId?.promotions?.length > 0 ? (
                    <div className='flex gap-2'>
                      <div className='line-through opacity-50 lg:text-3xl md:text-2xl text-xl lg:mt-5 mt-2'>
                        {productId.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </div>
                      <div className='lg:text-3xl md:text-2xl text-xl lg:mt-5 mt-2 font-semibold'>
                        {(
                          ((productId?.price ?? 0) *
                            (100 - productId.promotions[productId.promotions.length - 1]?.discountRate)) /
                          100
                        ).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className='lg:text-3xl md:text-2xl text-xl lg:mt-5 mt-2 font-semibold'>
                      {' '}
                      {(productId?.price ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                  )}
                  <div className='flex lg:mt-5 mt-2 gap-3 items-center'>
                    <div className='flex'>
                      {[...Array(5)].map((_, index) => {
                        const fullStar = index < Math.floor(productId.rating)
                        const halfStar = index < productId.rating && index >= Math.floor(productId.rating)

                        return (
                          <svg
                            key={index}
                            xmlns='http://www.w3.org/2000/svg'
                            fill={fullStar ? 'gold' : halfStar ? 'url(#half-star)' : 'none'}
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='lg:size-6 md:size-6 size-5 text-yellow-500'
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
                    <div className='lg:text-xl md:text-xl text-lg text-blue-300'>({feedback.length} reviews)</div>
                  </div>
                </div>
                <div className='flex mt-5 gap-5 items-center border-b border-gray-200 pb-10 pt-5'>
                  <div className='lg:text-3xl md:text-3xl text-xl font-semibold'>Quantity:</div>
                  <div className='flex border border-blue-400 gap-1 rounded-lg'>
                    <button
                      className='border-blue-400 border-r rounded-l-lg p-2 hover:bg-blue-100'
                      onClick={decrement}
                      aria-label='Decrease quantity'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='lg:w-8 md:w-8 w-5 text-blue-400'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                      </svg>
                    </button>

                    <input
                      type='number'
                      value={count}
                      onChange={(e) => {
                        const inputValue = Number(e.target.value)
                        setCount(inputValue > productId.inventory ? productId.inventory : inputValue)
                      }}
                      className={`outline-none no-arrows lg:w-20 md:w-16 w-12 text-center text-xl text-blue-400 ${
                        isDarkMode ? 'bg-custom-dark' : ''
                      }`}
                      min='0'
                      aria-label='Quantity input'
                    />

                    <button
                      className='border-l border-blue-400 p-2 rounded-r-lg hover:bg-blue-100'
                      onClick={increment}
                      aria-label='Increase quantity'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='lg:w-8 md:w-8 w-5 text-blue-400'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                      </svg>
                    </button>
                  </div>
                  <div className={`p-2 text-xl text-gray-500`}>
                    {productId.inventory || 'No inventory'} items remaining
                  </div>
                </div>

                <div className='flex lg:flex-row flex-col mt-5 gap-5 items-center border-b border-gray-200 pb-10 pt-5'>
                  <Link
                    to='/member/checkout'
                    onClick={() => {
                      handleAddToCart(productId)
                    }}
                    className='lg:text-xl lg:py-4 lg:px-10 text-lg w-full text-center py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg'
                  >
                    Buy Now
                  </Link>
                  <button
                    onClick={() => handleAddToCart(productId)}
                    className='lg:text-xl lg:py-4 lg:px-10 text-lg w-full text-center py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg'
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>

            {bought[0] !== '0001-01-01' && feedbackUser === false ? (
              <div className='lg:mt-20 mt-10 lg:border lg:border-gray-200 rounded-xl lg:px-10 lg:py-5'>
                <div className='lg:text-3xl text-xl'>Post Reviews</div>
                <div className='flex items-center lg:mt-6 mt-3'>
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      xmlns='http://www.w3.org/2000/svg'
                      fill={index < (hoveredRating || rating) ? 'gold' : 'none'}
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='lg:size-8 size-6 cursor-pointer hover:scale-110 text-yellow-400 transition-transform duration-200'
                      onMouseEnter={() => setHoveredRating(index + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(index + 1)}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 3.5l2.715 5.451 6.027.488-4.373 3.751 1.331 5.551L12 15.902l-5.7 3.839 1.331-5.551-4.373-3.751 6.027-.488L12 3.5z'
                      />
                    </svg>
                  ))}
                </div>
                <textarea
                  type='text'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`mt-5 rounded-xl w-full lg:h-32 h-20 text-black px-5 py-2 focus:border ${
                    isDarkMode ? 'bg-custom-dark text-white' : ''
                  } focus:border-blue-400 text-start flex outline-none border border-gray-200`}
                />
                <button
                  type='submit'
                  className='mt-5 lg:px-5 lg:py-3 py-2 px-3 lg:text-base text-sm bg-blue-400 hover:bg-blue-500 rounded-lg text-white'
                  onClick={editableFeedback ? updateFeedback : createFeedback}
                >
                  Post Review
                </button>

                {isEditing && (
                  <button
                    type='button'
                    className='lg:px-5 lg:py-3 py-2 px-3 lg:text-base text-sm bg-red-400 hover:bg-red-500 rounded-lg ml-5 text-white'
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              ''
            )}

            {editableFeedback ? (
              <div className='lg:mt-20 mt-10 lg:border lg:border-gray-200 rounded-xl lg:px-10 lg:py-5'>
                <div className='lg:text-3xl text-xl'>Edit Reviews</div>
                <div className='flex items-center lg:mt-6 mt-3'>
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      xmlns='http://www.w3.org/2000/svg'
                      fill={index < (hoveredRating || rating) ? 'gold' : 'none'}
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='lg:size-8 size-6 cursor-pointer hover:scale-110 text-yellow-400 transition-transform duration-200'
                      onMouseEnter={() => setHoveredRating(index + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(index + 1)}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 3.5l2.715 5.451 6.027.488-4.373 3.751 1.331 5.551L12 15.902l-5.7 3.839 1.331-5.551-4.373-3.751 6.027-.488L12 3.5z'
                      />
                    </svg>
                  ))}
                </div>
                <textarea
                  type='text'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`mt-5 rounded-xl w-full lg:h-32 h-20 text-black px-5 py-2 focus:border ${
                    isDarkMode ? 'bg-custom-dark text-white' : ''
                  } focus:border-blue-400 text-start flex outline-none border border-gray-200`}
                />
                <button
                  type='submit'
                  className='mt-5 lg:px-5 lg:py-3 py-2 px-3 lg:text-base text-sm bg-blue-400 hover:bg-blue-500 rounded-lg text-white'
                  onClick={editableFeedback ? updateFeedback : ''}
                >
                  Edit Review
                </button>

                {isEditing && (
                  <button
                    type='button'
                    className='lg:px-5 lg:py-3 py-2 px-3 lg:text-base text-sm bg-red-400 hover:bg-red-500 rounded-lg ml-5 text-white'
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              ''
            )}

            <div className='lg:mt-20 mt-10 lg:border rounded-xl lg:border-gray-200 lg:px-10 lg:py-5'>
              <div className='flex gap-2'>
                <div
                  className={`lg:text-xl text-lg py-3 px-4 border-b cursor-pointer ease-in duration-200 ${
                    active === 'description' ? ' border-blue-400' : 'border-transparent'
                  }`}
                  onClick={() => setActive('description')}
                >
                  Description
                </div>
                <div
                  className={`lg:text-xl text-lg py-3 px-4 border-b cursor-pointer ${
                    active === 'reviews' ? 'border-blue-400' : 'border-transparent'
                  }`}
                  onClick={() => setActive('reviews')}
                >
                  Reviews
                </div>
              </div>

              <div className='py-3'>
                {active === 'description' && (
                  <div className=''>
                    <div className='lg:text-2xl text-xl font-semibold text-justify py-5'>{productId.description}</div>
                    <div className='text-lg text-justify indent-7 py-2'>{productId.description_detail}</div>
                  </div>
                )}
                {active === 'reviews' && (
                  <div className='flex lg:flex-row flex-col gap-10'>
                    <div className='flex-none lg:w-[400px] max-h-[280px] border border-gray-200 flex flex-col items-center justify-center lg:py-20 py-10'>
                      <div className='lg:text-2xl text-xl font-semibold'>Average Rating</div>
                      <div className='mt-3 lg:text-3xl text-2xl text-blue-400'>{productId.rating.toFixed(1)}/5</div>
                      <div className='flex mt-3'>
                        {[...Array(5)].map((_, index) => {
                          const fullStar = index < Math.floor(productId.rating)
                          const halfStar = index < productId.rating && index >= Math.floor(productId.rating)

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

                    <div className='flex-auto flex flex-col lg:border max-h-[280px] gap-10 overflow-y-auto lg:border-gray-200 lg:px-8 lg:py-10'>
                      <div className='lg:text-2xl text-xl font-semibold'>Comment</div>
                      {feedback.map((feedbacks) => (
                        <div
                          className={`flex justify-between items-center ${
                            isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'
                          }  lg:p-5 p-2 ml-2 rounded-xl`}
                          key={feedbacks.id}
                        >
                          <div className=''>
                            <div className='flex gap-5 items-center'>
                              <img
                                src={feedbacks.imageUrl}
                                className='lg:size-12 size-8 rounded-full border border-gray-300'
                              />
                              <div className=''>
                                <div className='lg:text-base text-base'>{feedbacks.username}</div>
                                <div className='flex'>
                                  {[...Array(5)].map((_, index) => {
                                    const fullStar = index < Math.floor(feedbacks.star)
                                    const halfStar = index < feedbacks.star && index >= Math.floor(feedbacks.star)

                                    return (
                                      <svg
                                        key={index}
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill={fullStar ? 'gold' : halfStar ? 'url(#half-star)' : 'none'}
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='lg:size-6 size-4 text-yellow-500'
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
                                <div className='lg:text-base text-base'>{bought[0]}</div>
                              </div>
                            </div>
                            <div className='mt-5 lg:text-lg text-base'>{feedbacks.comment}</div>
                          </div>
                          {feedbacks.userId == userId ? (
                            <div
                              className='flex flex-col justify-center items-center'
                              onClick={() => toggleHide(feedbacks.id)}
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='lg:size-6 size-5 cursor-pointer relative top-12 lg:-right-4 -right-0'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
                                />
                              </svg>

                              <div
                                className={`flex flex-col border relative top-12 -right-4  border-gray-300 transition-all duration-300 overflow-hidden${
                                  visibleId === feedbacks.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                              >
                                <button className='py-2 px-4 hover:bg-gray-200' onClick={() => handleEdit(feedbacks)}>
                                  Edit
                                </button>
                                <button
                                  className='py-2 px-4 hover:bg-gray-200'
                                  onClick={() => deleteFeedback(feedbacks.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='lg:mt-20 mt-10'>
              <div className='lg:text-3xl text-2xl font-semibold'>Related Products</div>
              <div>
                <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 py-3 mt-4'>
                  {productRelate.length > 0 ? (
                    productRelate.map((products) => (
                      <div key={products.id} className='border border-gray-200 rounded-xl hover:scale-105 duration-300'>
                        <div>
                          <div className='border-b border-gray-200 lg:max-h-[300px]'>
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
                        <div className='px-7 py-5 text-xl lg:mt-5 font-medium'>
                          <div className='line-clamp-1'>{products.name}</div>
                          {(products?.price ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
