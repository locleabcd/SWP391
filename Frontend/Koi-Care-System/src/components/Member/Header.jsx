/* eslint-disable no-unused-vars */
import { useDarkMode } from '../../hooks/DarkModeContext'
import '../../App.css'
import path from '../../constants/path'
import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { loadCart } from '../../redux/store/cartList'

function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const wishlistCount = useSelector((state) => state.name.count)
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [cartId, setCartId] = useState([])
  const [user, setUser] = useState([])
  const dispatch = useDispatch()

  const getCartId = async () => {
    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/carts/cart/${cartId}/my-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCart(response.data.data.items)
      dispatch(loadCart())
      console.log(response.data.data.items)
    } catch (error) {
      console.log(error)
    }
  }

  const carts = useSelector((state) => state.cart.count)

  useEffect(() => {
    getCartId()
  }, [])

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const getCart = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/carts/user/${userId}/cartId`, {
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
    getCart()
  }, [])

  const toggleList = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.clear()
  }

  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')

  return (
    <div
      className={`${
        isDarkMode
          ? 'bg-custom-dark text-white border-b border-gray-700'
          : 'bg-white text-black border-b border-gray-200'
      } sticky top-0 p-3 justify-end z-20 flex w-full duration-200 ease-linear`}
    >
      <div className='flex items-center justify-end ml-4'>
        <div className='mr-4 flex justify-center items-center gap-2'>
          <button
            className={`${
              isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
            } p-[16px] rounded-full`}
          >
            <span className='cn8jz'>Search</span>
            <svg
              className='cp14x ch0mp cbm9w'
              width={16}
              height={16}
              viewBox='0 0 16 16'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z' />
              <path d='m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z' />
            </svg>
          </button>

          <Link
            to='/member/cartList'
            type='button'
            data-dropdown-toggle='notification-dropdown'
            className={`${
              isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
            } p-[12px] rounded-full relative`}
          >
            <span className='sr-only'>View notifications</span>
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
                d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
              />
            </svg>

            {carts > 0 && (
              <span className='absolute top-0 right-0 inline-flex items-center justify-center px-[8px] py-[4px] text-xs font-bold leading-none text-white bg-red-600 rounded-full'>
                {carts}
              </span>
            )}
          </Link>

          <Link
            to='/member/wishList'
            type='button'
            data-dropdown-toggle='notification-dropdown'
            className={`${
              isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
            } p-[12px] rounded-full relative`}
          >
            <span className='sr-only'>WishList</span>
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
                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
              />
            </svg>

            {wishlistCount > 0 && (
              <span className='absolute top-0 right-0 inline-flex items-center justify-center px-[6px] py-[2px] text-xs font-bold leading-none text-white bg-red-600 rounded-full'>
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            type='button'
            data-dropdown-toggle='notification-dropdown'
            className={`${
              isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
            } p-[12px] rounded-full`}
          >
            <span className='sr-only'>View notifications</span>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
              <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
            </svg>
          </button>

          <div>
            <input
              type='checkbox'
              name='light-switch'
              id='light-switch'
              className='light-switch cn8jz'
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <label
              className={`flex items-center justify-center cukve cvdqj cw5z1 c76um c5flv cue4z cmwfi rounded-full cursor-pointer py-[14px] px-[14px] ${
                isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
              }   `}
              htmlFor='light-switch'
            >
              {isDarkMode ? (
                <svg
                  className='cp14x ch0mp cbm9w c2e1r cursor-pointer'
                  width={20}
                  height={20}
                  viewBox='0 0 16 16'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M11.875 4.375a.625.625 0 1 0 1.25 0c.001-.69.56-1.249 1.25-1.25a.625.625 0 1 0 0-1.25 1.252 1.252 0 0 1-1.25-1.25.625.625 0 1 0-1.25 0 1.252 1.252 0 0 1-1.25 1.25.625.625 0 1 0 0 1.25c.69.001 1.249.56 1.25 1.25Z' />
                  <path d='M7.019 1.985a1.55 1.55 0 0 0-.483-1.36 1.44 1.44 0 0 0-1.53-.277C2.056 1.553 0 4.5 0 7.9 0 12.352 3.648 16 8.1 16c3.407 0 6.246-2.058 7.51-4.963a1.446 1.446 0 0 0-.25-1.55 1.554 1.554 0 0 0-1.372-.502c-4.01.552-7.539-2.987-6.97-7ZM2 7.9C2 5.64 3.193 3.664 4.961 2.6 4.82 7.245 8.72 11.158 13.36 11.04 12.265 12.822 10.341 14 8.1 14 4.752 14 2 11.248 2 7.9Z' />
                </svg>
              ) : (
                <svg
                  className='cp14x ch0mp cbm9w c1bco'
                  width={20}
                  height={20}
                  viewBox='0 0 16 16'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M8 0a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Z' />
                  <path d='M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' />
                  <path d='M13.657 3.757a1 1 0 0 0-1.414-1.414l-.354.354a1 1 0 0 0 1.414 1.414l.354-.354ZM13.5 8a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2h-.5a1 1 0 0 1-1-1ZM13.303 11.889a1 1 0 0 0-1.414 1.414l.354.354a1 1 0 0 0 1.414-1.414l-.354-.354ZM8 13.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0v-.5a1 1 0 0 1 1-1ZM4.111 13.303a1 1 0 1 0-1.414-1.414l-.354.354a1 1 0 1 0 1.414 1.414l.354-.354ZM0 8a1 1 0 0 1 1-1h.5a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1ZM3.757 2.343a1 1 0 1 0-1.414 1.414l.354.354A1 1 0 1 0 4.11 2.697l-.354-.354Z' />
                </svg>
              )}
              <span className='cn8jz'>Switch to light / dark version</span>
            </label>
          </div>
          <div className='my-account'>
            <button onClick={toggleList} className='flex items-center p-2 rounded-md space-x-2'>
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>{user.name}</p>
                <p className='text-xs text-gray-500'>{user.status}</p>
              </div>
              <div className='ml-auto flex items-center space-x-1'>
                <img src={user.avatar} className='w-12 h-12 rounded-full' />
              </div>
            </button>
            {isOpen && (
              <div
                className={`absolute right-10 z-10 w-44 border border-gray-300 shadow-lg ${
                  isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                }`}
              >
                <NavLink
                  to={path.profile}
                  end
                  className=' px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center '
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-8 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                    />
                  </svg>
                  <span>My Profile</span>
                </NavLink>
                <NavLink to={path.shopCart} className=' px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-8 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  <span>Shop Cart</span>
                </NavLink>
                <Link
                  onClick={handleLogout}
                  to={path.login}
                  className='px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-8 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
                    />
                  </svg>
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
