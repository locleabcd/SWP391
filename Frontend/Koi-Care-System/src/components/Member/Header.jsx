import { useDarkMode } from '../../hooks/DarkModeContext'
import '../../App.css'
import path from '../../constants/path'
import { Link, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { loadCart } from '../../redux/store/cartList'
import { IoFishOutline, IoPowerOutline, IoStatsChartSharp } from 'react-icons/io5'
import { FaCrown, FaHandPointRight, FaRegNewspaper } from 'react-icons/fa'
import { CgCalculator } from 'react-icons/cg'
import { LuAlarmClock } from 'react-icons/lu'
import { IoIosWater } from 'react-icons/io'
import { GiAquarium } from 'react-icons/gi'
import logo from '../../assets/logo.png'
import memberPathInfor from '../../constants/memberPathInfor'
import ReminderMB from '../../pages/Member/Reminders/ReminderMB'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'

function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const wishlistCount = useSelector((state) => state.name.count)
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [cartId, setCartId] = useState([])
  const [user, setUser] = useState([])
  const [notificationRead, setNotificationRead] = useState([])
  const [notificationUnRead, setNotificationUnRead] = useState([])
  const dispatch = useDispatch()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const getCartId = async () => {
    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/carts/cart/${cartId}/my-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCart(response.data.data.items)
      dispatch(loadCart())
    } catch (error) {
      console.log(error)
    }
  }

  const carts = useSelector((state) => state.cart.count)

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
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(res.data.data)
      localStorage.setItem('avt', res.data.data.avatar)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const getNotificationRead = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/notifications/list/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const notificationSort = res.data.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      setNotificationRead(notificationSort)
      console.log('abc', notificationSort)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    getNotificationRead()
  }, [])

  const getNotificationUnRead = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/notifications/list-unread/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const notificationSort = res.data.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      setNotificationUnRead(notificationSort)
      console.log('abcd', notificationSort)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    getNotificationUnRead()
  }, [])

  const getCart = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/carts/user/${userId}/cartId`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCartId(res.data.data)
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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  function getRelativeTime(dateTime) {
    const now = new Date()
    const past = new Date(dateTime)
    const diffInSeconds = Math.floor((now - past) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  const filteredPaths = memberPathInfor.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const avt = localStorage.getItem('avt')
  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')
  const isMember = user?.status === 'NORMAL'

  return (
    <div
      className={`${
        isDarkMode
          ? 'bg-custom-dark text-white border-b border-gray-700'
          : 'bg-white text-black border-b border-gray-200'
      } sticky top-0 lg:p-3 py-3 lg:justify-end justify-between z-20 flex w-full duration-200 ease-linear`}
    >
      <button className='ml-2 lg:hidden inline-block cursor-pointer'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-7 '
          onClick={() => setSidebarOpen(true)}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
      </button>
      <ReminderMB />
      <div className='flex items-center justify-end ml-4'>
        <div className='mr-4 flex justify-center items-center gap-2'>
          <button
            onClick={toggleSearch}
            className={`${
              isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
            } lg:p-[16px] p-[12px] rounded-full`}
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
            } lg:p-[12px] p-[10px] rounded-full relative`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='lg:size-6 size-5'
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
            } lg:p-[12px] p-[10px] rounded-full relative`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='lg:size-6 size-5'
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
            className={`${isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'} lg:p-[12px] p-[10px] rounded-full`}
          >
            <PopupState popupId='demo-popup-popover'>
              {(popupState) => (
                <div
                  className={`${isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'}  rounded-full`}
                >
                  <svg
                    className='lg:size-6 size-5 text-black'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                    {...bindTrigger(popupState)}
                  >
                    <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
                  </svg>{' '}
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center'
                    }}
                  >
                    <Typography sx={{ p: 2 }}>
                      <div className='max-h-[500px] max-w-96'>
                        <div className='text-3xl font-semibold border-b border-gray-200 py-3 p-2'>Notifications</div>
                        {notificationRead.map((notificationReads) => (
                          <div className='p-2 hover:bg-gray-200' key={notificationReads.id}>
                            <div className='lg:text-lg text-base'>
                              <span className='font-bold'>{notificationReads.title}</span> mentioned you in a comment in{' '}
                              <span className='font-semibold'>{notificationReads.title}</span> ·{' '}
                              <span className='italic'>{notificationReads.title}</span>. Please remember the reminder
                              above.
                            </div>
                            <div className='lg:text-base text-sm text-gray-500'>
                              {getRelativeTime(notificationReads.dateTime)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Typography>
                  </Popover>
                </div>
              )}
            </PopupState>{' '}
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
              className={`flex items-center justify-center cukve cvdqj cw5z1 c76um c5flv cue4z cmwfi rounded-full cursor-pointer lg:p-[14px] p-[12px] ${
                isDarkMode ? 'bg-gray-500 bg-opacity-50' : 'bg-gray-100 bg-opacity-50'
              }   `}
              htmlFor='light-switch'
            >
              {isDarkMode ? (
                <svg
                  className='cp14x ch0mp cbm9w c2e1r cursor-pointer size-4 lg:size-5'
                  viewBox='0 0 16 16'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M11.875 4.375a.625.625 0 1 0 1.25 0c.001-.69.56-1.249 1.25-1.25a.625.625 0 1 0 0-1.25 1.252 1.252 0 0 1-1.25-1.25.625.625 0 1 0-1.25 0 1.252 1.252 0 0 1-1.25 1.25.625.625 0 1 0 0 1.25c.69.001 1.249.56 1.25 1.25Z' />
                  <path d='M7.019 1.985a1.55 1.55 0 0 0-.483-1.36 1.44 1.44 0 0 0-1.53-.277C2.056 1.553 0 4.5 0 7.9 0 12.352 3.648 16 8.1 16c3.407 0 6.246-2.058 7.51-4.963a1.446 1.446 0 0 0-.25-1.55 1.554 1.554 0 0 0-1.372-.502c-4.01.552-7.539-2.987-6.97-7ZM2 7.9C2 5.64 3.193 3.664 4.961 2.6 4.82 7.245 8.72 11.158 13.36 11.04 12.265 12.822 10.341 14 8.1 14 4.752 14 2 11.248 2 7.9Z' />
                </svg>
              ) : (
                <svg
                  className='cp14x ch0mp cbm9w c1bco size-4 lg:size-5'
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
            <button onClick={toggleList} className='lg:flex lg:items-center lg:p-2 lg:rounded-md lg:space-x-2 hidden'>
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>{user.name}</p>
                <p className='text-xs text-gray-500'>{user.role}</p>
              </div>
              <div className='ml-auto flex items-center space-x-1'>
                <img src={user.avatar} className='w-12 h-12 rounded-full object-cover' />
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
                  className={`px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
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
                <NavLink
                  to={path.orderMember}
                  className={`px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
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
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  <span>My Orders</span>
                </NavLink>
                <Link
                  onClick={handleLogout}
                  to={path.login}
                  className={`px-4 py-2 flex items-center ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
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

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full md:w-1/3 w-2/3 lg:w-0 transform  ${
          isSidebarOpen ? `translate-x-0 ${isDarkMode ? 'bg-custom-dark' : 'bg-white'}` : '-translate-x-full'
        } transition-transform duration-300 z-50 overflow-y-auto no-scroll-bar`}
      >
        <div className='flex justify-center items-center'>
          <button className='mt-4 rounded-md'>
            <img className='w-14 animate-slow-spin' src={logo} alt='Logo' />
          </button>
          <a href='#' className='mt-3 text-xl font-bold'>
            Koi Care System
          </a>
        </div>

        <div className='flex flex-col justify-center items-center lg:mt-6 mt-3 duration-200'>
          <div className=''>
            <NavLink
              to={path.dashboard}
              end
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-7 mr-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z'
                  />
                </svg>

                <span className='font-semibold'>Dashboard</span>
              </div>
            </NavLink>

            <NavLink
              to={path.myKoi}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full mt-2 p-4  cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <IoFishOutline className='w-full h-full' />
                </div>
                <span className='font-semibold'>My Koi</span>
              </div>
            </NavLink>

            <NavLink
              to={path.myPond}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <GiAquarium className='w-full h-full' />
                </div>
                <span className='font-semibold'>My Pond</span>
              </div>
            </NavLink>

            <NavLink
              to={isMember ? path.pricing : path.waterParameters}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                return `${active} ${memberStyles} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex-wrap flex justify-between items-center 
                    `
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <IoIosWater className='w-full h-full' />
                </div>
                <div className='flex items-center'>
                  <span className='font-semibold'>Water Parameters</span>
                  {isMember ? (
                    <div className='text-yellow-500'>
                      <FaCrown className='ml-3 w-6 h-6' />
                    </div>
                  ) : null}
                </div>
              </div>
            </NavLink>

            <NavLink
              to={isMember ? path.pricing : path.reminders}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                return `${active} ${memberStyles} min-w-full p-4 mt-2 flex-wrap cursor-pointer rounded-lg flex justify-between items-center
                    `
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <LuAlarmClock className='w-full h-full' />
                </div>
                <div className='flex items-center'>
                  <span className='font-semibold'>Reminders</span>
                  {isMember ? (
                    <div className='text-yellow-500'>
                      <FaCrown className='ml-3 w-6 h-6' />
                    </div>
                  ) : null}
                </div>
              </div>
            </NavLink>

            <NavLink
              to={path.recommendations}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <FaHandPointRight className='w-full h-full' />
                </div>
                <span className='font-semibold'>Recommendations</span>
              </div>
            </NavLink>

            <NavLink
              to={isMember ? path.pricing : path.foodCalculator}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                return `${active} ${memberStyles} min-w-full p-4 flex-wrap mt-2 cursor-pointer rounded-lg flex justify-between items-center `
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <CgCalculator className='w-full h-full' />
                </div>
                <div className='flex items-center'>
                  <span className='font-semibold'>Food Calculator</span>
                  {isMember ? (
                    <div className='text-yellow-500'>
                      <FaCrown className='ml-3 w-6 h-6' />
                    </div>
                  ) : null}
                </div>
              </div>
            </NavLink>

            <NavLink
              to={isMember ? path.pricing : path.saltCalculator}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                return `${active} ${memberStyles} min-w-full flex-wrap p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center 
                  `
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <CgCalculator className='w-full h-full' />
                </div>
                <div className='flex items-center'>
                  <span className='font-semibold'>Salt Calculator</span>
                  {isMember ? (
                    <div className='text-yellow-500'>
                      <FaCrown className='ml-3 w-6 h-6' />
                    </div>
                  ) : null}
                </div>
              </div>
            </NavLink>

            <NavLink
              to={path.statistics}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <IoStatsChartSharp className='w-full h-full' />
                </div>
                <span className='font-semibold'>Statistics</span>
              </div>
            </NavLink>

            {/* sidebar items  */}
            <NavLink
              to={path.news}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <FaRegNewspaper className='w-full h-full' />
                </div>
                <span className='font-semibold'>News and Blogs</span>
              </div>
            </NavLink>

            <NavLink
              to={path.aboutMember}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-full h-full'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z'
                    />
                  </svg>
                </div>
                <span className='font-semibold'>About</span>
              </div>
            </NavLink>
          </div>
        </div>

        <div
          className={`mt-auto sticky bottom-0 z-50 w-full p-2 flex justify-between items-center 
            ${isDarkMode ? 'bg-custom-dark' : 'bg-white'} neon-border`}
        >
          <div
            className={`flex p-4 rounded-lg items-center justify-between w-full ${isDarkMode ? 'bg-custom-dark ' : 'bg-white'}`}
          >
            <div className='card-content flex items-center '>
              <img
                src={avt || 'default-avatar.png'}
                alt='User Avatar'
                className='w-12 h-12 rounded-full object-cover border-2 border-gray-300'
              />
              <div className='ml-3'>
                <p className={`font-semibold text-lg ${isDarkMode ? 'text-white ' : 'text-black'}`}>
                  {user.name || 'User Name'}
                </p>
                <p className='text-sm text-gray-500'>{user.role || 'User Role'}</p>
              </div>
            </div>
            <Link onClick={handleLogout} to='/login'>
              <IoPowerOutline
                className='text-2xl text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer'
                title='Logout'
              />
            </Link>
          </div>
        </div>
      </div>
      {isSearchOpen && (
        <div
          className={`absolute top-16 left-[8vh] md:top-[2vh] md:left-[118vh] z-50 mt-2 ${
            isDarkMode ? ' text-gray-200' : ' text-gray-800'
          }`}
        >
          <input
            type='text'
            placeholder='Search Here'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`p-2 rounded-lg border ${isDarkMode ? ' bg-gray-800 text-gray-200' : ' bg-white text-gray-800'}`}
          />
          {filteredPaths.length > 0 && (
            <ul
              className={`absolute z-50 border border-gray-300 rounded mt-1 w-full max-h-40 overflow-x-auto no-scroll-bar ${
                isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
              }`}
            >
              {filteredPaths.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.link}
                    className={`block px-4 py-2 rounded ${
                      isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Header
