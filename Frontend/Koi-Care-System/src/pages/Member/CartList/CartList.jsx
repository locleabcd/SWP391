/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useDarkMode } from '../../../components/DarkModeContext'
import TopLayout from '../../../layouts/TopLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { addToCartList, loadCart, removeToCartList } from '../../../redux/store/cartList'
import { Link } from 'react-router-dom'

const CartList = () => {
  const { isDarkMode } = useDarkMode()
  const [count, setCount] = useState(1)
  const [cart, setCart] = useState([])
  const dispatch = useDispatch()

  const subTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0)

  const increment = async (itemId) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + 1,
          totalPrice: (item.quantity + 1) * item.product.price
        }
      }
      return item
    })

    setCart(updatedCart)

    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) throw new Error('No token found')

      await axios.put(
        `https://koicaresystem.azurewebsites.net/api/cartItems/cart/${cartId}/product/${itemId}/update`,
        {
          quantity: updatedCart.find((item) => item.product.id === itemId).quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const decrement = async (itemId) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === itemId && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
          totalPrice: (item.quantity - 1) * item.product.price
        }
      }
      return item
    })

    setCart(updatedCart)

    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) throw new Error('No token found')

      await axios.put(
        `https://koicaresystem.azurewebsites.net/api/cartItems/cart/${cartId}/product/${itemId}/update`,
        {
          quantity: updatedCart.find((item) => item.product.id === itemId).quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getCartId = async () => {
    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystem.azurewebsites.net/api/carts/cart/${cartId}/my-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const updatedCart = response.data.data.items.map((item) => ({
        ...item,
        totalPrice: item.quantity * item.product.price
      }))

      setCart(updatedCart)
      console.log(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCartId()
  }, [])

  const handleRemoveToCart = async (productId) => {
    await dispatch(removeToCartList(productId))
    dispatch(loadCart())
    getCartId()
  }

  const handleAddToCart = (product) => {
    dispatch(addToCartList(product, count))
  }

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
            <TopLayout text='Recommendations' textName='Checkout' links='member/recommendations' />

            <div className='border border-gray-200 px-10 py-5 rounded-xl'>
              <ol className='items-center flex w-full px-52 pb-20 pt-14 justify-center text-center text-sm font-medium text-gray-700'>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400 dark:text-primary-500'>
                  <span className='flex flex-col'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white '>
                      1
                    </div>
                    <div className='mt-4'>Cart</div>
                  </span>
                </li>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400 dark:text-primary-500'>
                  <span className='flex flex-col'>
                    <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white '>
                      2
                    </div>
                    <div className='mt-4'>Address</div>
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='flex flex-col'>
                    <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white '>
                      3
                    </div>
                    <div className='mt-4'>Payment</div>
                  </span>
                </li>
              </ol>

              <table className='min-w-full'>
                <thead className=''>
                  <tr className=''>
                    <th
                      scope='col'
                      className='px-8 py-3 text-start text-gray-500 text-xs font-medium uppercase tracking-wider'
                    >
                      Product
                    </th>

                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Quantity
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {cart.map((item) => (
                    <tr key={item.itemId}>
                      <td className='px-6 py-4 text-center whitespace-nowrap flex gap-5'>
                        <div className=''>
                          <img
                            src={item.product?.images[0]?.downloadUrl}
                            alt=''
                            className='mx-auto w-[120px] h-[120px] rounded-lg border border-gray-200'
                          />
                        </div>
                        <div className='flex flex-col justify-start items-start'>
                          <div className='text-start font-semibold text-xl'>{item.product.name}</div>
                          <div className='mt-2'>{item.product.category.name}</div>
                          <svg
                            onClick={() => handleRemoveToCart(item.product.id)}
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5 text-red-500 mt-4 ml-2 cursor-pointer'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                            />
                          </svg>
                        </div>
                      </td>

                      <td className='px-6 py-4 text-center whitespace-nowrap'>
                        {' '}
                        <div className='flex gap-5 items-center justify-start w-full'>
                          <div className='flex border border-blue-400 gap-5 rounded-lg'>
                            <button
                              className='border-blue-400 border-r rounded-lg p-2'
                              onClick={() => decrement(item.product.id)}
                            >
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
                              value={item.quantity}
                              readOnly
                              className={`outline-none w-10 text-center text-xl text-blue-400 ${
                                isDarkMode ? 'bg-custom-dark' : ''
                              }`}
                            />

                            <button className='border-l border-blue-400 p-2' onClick={() => increment(item.product.id)}>
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
                      </td>

                      <td className='px-6 py-4 text-start whitespace-nowrap'>
                        {' '}
                        {item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='border border-gray-200 px-10 py-5 mt-10 rounded-xl'>
                <div className='text-2xl font-semibold'>Order Summary</div>
                <div className='flex mt-7 text-xl justify-between'>
                  <div className=''>Sub Total</div>
                  <div className=''> {subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                </div>

                <div className='flex mt-7 text-xl justify-between'>
                  <div className=''>Discount</div>
                  <div className=''> {(0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                </div>

                <div className='flex mt-7 text-xl justify-between'>
                  <div className=''>Shipping</div>
                  <div className=''>Free</div>
                </div>

                <div className='flex mt-7 text-xl justify-between'>
                  <div className='font-medium'>Total</div>
                  <div className=''> {subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                </div>
              </div>
              <div className='flex justify-between mt-8'>
                <button className='px-6 py-3 bg-gray-300 hover:bg-gray-400 text-white rounded-lg cursor-pointer'>
                  Back
                </button>
                <Link
                  to='/member/checkout'
                  className='px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg cursor-pointer'
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartList
