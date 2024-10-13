/* eslint-disable no-unused-vars */
import { PiNewspaperClipping } from 'react-icons/pi'
import { FaTags } from 'react-icons/fa'
import { FaRegNewspaper } from 'react-icons/fa'
import { Link, NavLink } from 'react-router-dom'
import path from '../../constants/path'
import { useDarkMode } from '../../hooks/DarkModeContext'
import logo from '../../assets/logo.png'
import { useEffect, useState } from 'react'
import { AiFillShop } from 'react-icons/ai'
import { FaBoxArchive } from 'react-icons/fa6'
import { RiCoupon2Fill } from 'react-icons/ri'
import { FaBox } from 'react-icons/fa'
import { BiSolidCategory } from 'react-icons/bi'
import { FaImage } from 'react-icons/fa'
import { FaCartShopping } from "react-icons/fa6"
import { TbReportSearch } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa";


function LeftSideBar() {
  const { isDarkMode } = useDarkMode()
  const [isClosed, setClosed] = useState(() => {
    const savedState = localStorage.getItem('isSidebarClosed')
    return savedState ? JSON.parse(savedState) : false
  })

  const [isNewsOpen, setIsNewsOpen] = useState(() => {
    const savedState = localStorage.getItem('isNewsOpen')
    return savedState ? JSON.parse(savedState) : false
  })

  const [isShopOpen, setIsShopOpen] = useState(() => {
    const savedState = localStorage.getItem('isShopOpen')
    return savedState ? JSON.parse(savedState) : false
  })

  const [isReportOpen, setIsReportOpen] = useState(() => {
    const savedState = localStorage.getItem('isReportOpen')
    return savedState ? JSON.parse(savedState) : false
  })

  useEffect(() => {
    localStorage.setItem('isSidebarClosed', JSON.stringify(isClosed))
  }, [isClosed])
  const handleLogout = () => {
    localStorage.clear()
  }

  useEffect(() => {
    localStorage.setItem('isNewsOpen', JSON.stringify(isNewsOpen))
  }, [isNewsOpen])

  useEffect(() => {
    localStorage.setItem('isReportOpen', JSON.stringify(isReportOpen))
  }, [isReportOpen])

  useEffect(() => {
    localStorage.setItem('isShopOpen', JSON.stringify(isShopOpen))
  }, [isShopOpen])

  return (
    <div>
      {/* open close button  */}
      <div className='relative '>
        {isClosed ? (
          <button
            className={`absolute duration-200 ease-linear left-20 top-8 p-1 z-30 ${
              isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
            } `}
            onClick={() => setClosed(false)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-7'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5' />
            </svg>
          </button>
        ) : (
          <button
            className={`absolute left-[260px] top-6 p-1 z-30 ${
              isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
            } `}
            onClick={() => setClosed(true)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-7'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
            </svg>
          </button>
        )}
      </div>
      {/* sidebar */}
      <div
        className={`absolute top-0 left-0 z-999 flex h-screen flex-col no-scroll-bar overflow-y-auto border-r ${
          isDarkMode ? 'bg-custom-dark text-white border-gray-700' : 'bg-white text-black border-gray-200'
        } shadow-sm duration-200 ease-linear lg:static lg:translate-x-0 ${isClosed ? 'w-[80px]' : 'w-[240px]'}`}
      >
        <div className='flex justify-center items-center'>
          <button className='mt-4 rounded-md'>
            <img className='w-14 animate-slow-spin' src={logo} alt='Logo' />
          </button>
          {!isClosed && (
            <a href='#' className='mt-3 text-xl font-bold'>
              Koi Care System
            </a>
          )}
        </div>

        <div className='flex flex-col justify-center items-center mt-6 duration-200'>
          <div className=''>
            <NavLink
              to={path.dashboard}
              end
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                }`
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

                {!isClosed && <span className='font-semibold'>Dashboard</span>}
              </div>
            </NavLink>

            <NavLink
              to={path.viewUser}
              end
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                }`
              }}
            >
              <div className='flex items-center'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-7 mr-3'>
                  <path d='M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z' />
                </svg>
                {!isClosed && <span className='font-semibold'>Manage User</span>}
              </div>
            </NavLink>
            {/* sidebar items  */}
            {/* News and Blogs */}
            <div>
              <button
                className={`min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                } ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
                onClick={() => setIsNewsOpen(!isNewsOpen)}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <FaRegNewspaper className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <span className='flex items-center'>
                      <p className='font-semibold'>Manage News</p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='size-5 ml-2 mt-1'
                      >
                        <path
                          fillRule='evenodd'
                          d='M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </button>

              {isNewsOpen && (
                <div className=''>
                  <NavLink
                    to={path.shopNews}
                    className={({ isActive }) => {
                      const active = isActive
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                        isClosed ? 'flex-col' : ''
                      }`
                    }}
                  >
                    <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <PiNewspaperClipping className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>News</span>}
                    </div>
                  </NavLink>

                  <NavLink
                    to={path.tag}
                    className={({ isActive }) => {
                      const active = isActive
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                        isClosed ? 'flex-col' : ''
                      }`
                    }}
                  >
                    <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <FaTags className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>Tag</span>}
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
            {/* Manage Shop  */}
            <div>
              <button
                className={`min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                } ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
                onClick={() => setIsShopOpen(!isShopOpen)}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <AiFillShop className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <span className='flex items-center'>
                      <p className='font-semibold'>Manage Shop</p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='size-5 ml-2 mt-1'
                      >
                        <path
                          fillRule='evenodd'
                          d='M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </button>

              {isShopOpen && (
                <div>
                  <div className=''>
                    <NavLink
                      to={path.supplier}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                          isClosed ? 'flex-col' : ''
                        }`
                      }}
                    >
                      <div className='flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <FaBoxArchive className='w-full h-full' />
                        </div>
                        {!isClosed && <span className='font-semibold'>Supplier</span>}
                      </div>
                    </NavLink>
                  </div>

                  <div className=''>
                    <NavLink
                      to={path.promotion}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                          isClosed ? 'flex-col' : ''
                        }`
                      }}
                    >
                      <div className='flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <RiCoupon2Fill className='w-full h-full' />
                        </div>
                        {!isClosed && <span className='font-semibold'>Promotion</span>}
                      </div>
                    </NavLink>
                  </div>

                  <div className=''>
                    <NavLink
                      to={path.category}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                          isClosed ? 'flex-col' : ''
                        }`
                      }}
                    >
                      <div className='flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <BiSolidCategory className='w-full h-full' />
                        </div>
                        {!isClosed && <span className='font-semibold'>Category</span>}
                      </div>
                    </NavLink>
                  </div>

                  <div className=''>
                    <NavLink
                      to={path.productImage}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                          isClosed ? 'flex-col' : ''
                        }`
                      }}
                    >
                      <div className='flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <FaImage className='w-full h-full' />
                        </div>
                        {!isClosed && <span className='font-semibold'>Images</span>}
                      </div>
                    </NavLink>
                  </div>

                  <div className=''>
                    <NavLink
                      to={path.product}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                          isClosed ? 'flex-col' : ''
                        }`
                      }}
                    >
                      <div className='flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <FaBox className='w-full h-full' />
                        </div>
                        {!isClosed && <span className='font-semibold'>Product</span>}
                      </div>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            <div>
              <button
                className={`min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                } ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
                onClick={() => setIsReportOpen(!isReportOpen)}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <TbReportSearch className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <span className='flex items-center'>
                      <p className='font-semibold'>Manage Report</p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='size-5 ml-2 mt-1'
                      >
                        <path
                          fillRule='evenodd'
                          d='M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </button>

              {isReportOpen && (
                <div className=''>
                  <NavLink
                    to={path.orderShop}
                    className={({ isActive }) => {
                      const active = isActive
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                        isClosed ? 'flex-col' : ''
                      }`
                    }}
                  >
                    <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <FaCartShopping className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>Manage Order</span>}
                    </div>
                  </NavLink>

                  <NavLink
                    to={path.paymentShop}
                    className={({ isActive }) => {
                      const active = isActive
                        ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                        : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                      return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                        isClosed ? 'flex-col' : ''
                      }`
                    }}
                  >
                    <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <FaMoneyBill  className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>Manage Payment</span>}
                    </div>
                  </NavLink>
                </div>
              )}
            </div>
            <Link
              onClick={handleLogout}
              to={path.login}
              className='px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center border-t absolute inset-x-0 bottom-0 w-full'
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
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
