import '../../App.css'
import path from '../../constants/path'
import { Link, NavLink } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useDarkMode } from '../../hooks/DarkModeContext'
import logo from '../../assets/logo.png'
import { PiNewspaperClipping } from 'react-icons/pi'
import { FaTags } from 'react-icons/fa'
import { FaUserFriends } from 'react-icons/fa'
import { FaBoxArchive } from 'react-icons/fa6'
import { FaBox } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { TbReportSearch } from 'react-icons/tb'
import { FaMoneyBill } from 'react-icons/fa'
import { AiFillShop } from 'react-icons/ai'
import adminPathInfor from '../../constants/adminPathInfor'
import { FaRegNewspaper } from 'react-icons/fa'
import { RiCoupon2Fill } from 'react-icons/ri'
function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [isUsersOpen, setIsUsersOpen] = useState(() => {
    const savedState = localStorage.getItem('isUsersOpen')
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
    localStorage.setItem('isUsersOpen', JSON.stringify(isUsersOpen))
  }, [isUsersOpen])

  useEffect(() => {
    localStorage.setItem('isReportOpen', JSON.stringify(isReportOpen))
  }, [isReportOpen])

  useEffect(() => {
    localStorage.setItem('isShopOpen', JSON.stringify(isShopOpen))
  }, [isShopOpen])
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

  const toggleList = () => {
    setIsOpen(!isOpen)
  }
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleLogout = () => {
    localStorage.clear()
  }
  const filteredPaths = adminPathInfor.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')

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
      <div className='flex items-center justify-end ml-4'>
        <div className='mr-4 flex justify-center items-center gap-2'>
          <button
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
              onClick={toggleSearch}
            >
              <path d='M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z' />
              <path d='m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z' />
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
                  width={16}
                  height={16}
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
                <p className='text-sm font-medium'>{name}</p>
                <p className='text-xs text-gray-500'>{role}</p>
              </div>
              <div className='ml-auto flex items-center space-x-1'>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='size-12'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                    />
                  </svg>
                </div>
              </div>
            </button>
            {isOpen && (
              <div
                className={`absolute right-10 z-10 w-44 border border-gray-300 shadow-lg ${
                  isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                }`}
              >
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
        className={`fixed top-0 left-0 h-full md:w-1/3 w-7/12 lg:w-0 transform  ${
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
        <div className='flex flex-col justify-center items-center mt-6 duration-200'>
          <div className=''>
            <NavLink
              to={path.dashboardAD}
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
                  className='w-7 h-7 mr-3'
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
              to={path.newsAD}
              end
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                return `${active} min-w-full  p-4 cursor-pointer rounded-lg flex justify-between items-center`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <FaRegNewspaper className='w-full h-full' />
                </div>
                <span className='font-semibold'>News</span>
              </div>
            </NavLink>
            <div>
              <button
                className={`min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
                onClick={() => setIsShopOpen(!isShopOpen)}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <AiFillShop className='w-full h-full' />
                  </div>

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
                </div>
              </button>
              {isShopOpen && (
                <div>
                  <div className=''>
                    <NavLink
                      to={path.supplierAD}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center`
                      }}
                    >
                      <div className='pl-2 flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <FaBoxArchive className='w-full h-full' />
                        </div>
                        <span className='font-semibold'>Supplier</span>
                      </div>
                    </NavLink>
                  </div>
                  <div className=''>
                    <NavLink
                      to={path.promotionAD}
                      end
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full mt-2 p-4 cursor-pointer rounded-lg flex justify-between items-center `
                      }}
                    >
                      <div className='pl-2 flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <RiCoupon2Fill className='w-full h-full' />
                        </div>
                        <span className='font-semibold'>Promotion</span>
                      </div>
                    </NavLink>
                  </div>
                  <div className=''>
                    <NavLink
                      to={path.productAD}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full mt-2 p-4 cursor-pointer rounded-lg flex justify-between items-center `
                      }}
                    >
                      <div className='pl-2 flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <FaBox className='w-full h-full' />
                        </div>
                        <span className='font-semibold'>Product</span>
                      </div>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            <div>
              <button
                className={`min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center 
                   ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
                onClick={() => setIsUsersOpen(!isUsersOpen)}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <FaUserFriends className='w-full h-full' />
                  </div>

                  <span className='flex items-center'>
                    <p className='font-semibold'>Manage Users</p>
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
                </div>
              </button>
              {isUsersOpen && (
                <div>
                  <div className=''>
                    <NavLink
                      to={path.shopAD}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full mt-2 p-4 cursor-pointer rounded-lg flex justify-between items-center $`
                      }}
                    >
                      <div className='pl-2 flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <PiNewspaperClipping className='w-full h-full' />
                        </div>
                        <span className='font-semibold'>Shop</span>
                      </div>
                    </NavLink>
                  </div>
                  <div className=''>
                    <NavLink
                      to={path.customerAD}
                      className={({ isActive }) => {
                        const active = isActive
                          ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                          : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        return `${active} min-w-full mt-2 p-4 cursor-pointer rounded-lg flex justify-between items-center `
                      }}
                    >
                      <div className='pl-2 flex items-center'>
                        <div className='w-6 h-6 mr-3'>
                          <FaTags className='w-full h-full' />
                        </div>
                        <span className='font-semibold'>Customer</span>
                      </div>
                    </NavLink>
                  </div>
                </div>
              )}
              <div>
                <button
                  className={`min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`}
                  onClick={() => setIsReportOpen(!isReportOpen)}
                >
                  <div className='flex items-center'>
                    <div className='w-7 h-7 mr-3'>
                      <TbReportSearch className='w-full h-full' />
                    </div>

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
                  </div>
                </button>

                {isReportOpen && (
                  <div>
                    {/* Manage Order */}
                    <div className='mb-2'>
                      <NavLink
                        to={path.manageOrder}
                        className={({ isActive }) => {
                          const active = isActive
                            ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                            : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                          return `${active} min-w-full mt-2 p-4 cursor-pointer rounded-lg flex justify-between items-center `
                        }}
                      >
                        <div className='pl-2 flex items-center'>
                          <div className='w-6 h-6 mr-3'>
                            <FaCartShopping className='w-full h-full' />
                          </div>
                          <span className='font-semibold'>Manage Order</span>
                        </div>
                      </NavLink>
                    </div>
                    {/* Manage Payment */}
                    <div className='mb-2'>
                      <NavLink
                        to={path.managePay}
                        end
                        className={({ isActive }) => {
                          const active = isActive
                            ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                            : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                          return `${active} min-w-full mt-2 p-4 cursor-pointer rounded-lg flex justify-between items-center `
                        }}
                      >
                        <div className='pl-2 flex items-center'>
                          <div className='w-6 h-6 mr-3'>
                            <FaMoneyBill className='w-full h-full' />
                          </div>
                          <span className='font-semibold'>Manage Payment</span>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSearchOpen && (
        <div
          className={`absolute top-16 left-[8vh] md:top-[2vh] md:left-[134vh] z-50 mt-2 ${
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
