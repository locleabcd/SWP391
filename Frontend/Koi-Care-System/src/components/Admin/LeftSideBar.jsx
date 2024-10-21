import { NavLink } from 'react-router-dom'
import path from '../../constants/path'
import logo from '../../assets/logo.png'
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../hooks/DarkModeContext'
import { PiNewspaperClipping } from 'react-icons/pi'
import { FaTags } from 'react-icons/fa'
import { FaUserFriends } from "react-icons/fa"
import { FaBoxArchive } from 'react-icons/fa6'
import { FaBox } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { TbReportSearch } from 'react-icons/tb'
import { FaMoneyBill } from 'react-icons/fa'
import { AiFillShop } from 'react-icons/ai'
import { FaRegNewspaper } from 'react-icons/fa'
function LeftSideBar() {
  const { isDarkMode } = useDarkMode()
  const [isClosed, setClosed] = useState(() => {
    const savedState = localStorage.getItem('isSidebarClosed')
    return savedState ? JSON.parse(savedState) : false
  })
  const [isUsersOpen, setIsUsersOpen] = useState(()=>{
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
    localStorage.setItem('isSidebarClosed', JSON.stringify(isClosed))
  }, [isClosed])
  useEffect(() => {
    localStorage.setItem('isUsersOpen', JSON.stringify(isUsersOpen))
  }, [isUsersOpen])

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
          className={`absolute duration-200 ease-linear lg:inline-block hidden lg:left-20 top-5 p-1 z-30 ${
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
          className={`lg:absolute lg:left-[260px] lg:inline-block hidden lg:top-6 lg:p-1 lg:z-30 ${
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
      <div  className={`absolute top-0 left-0 z-50 flex h-screen flex-col no-scroll-bar overflow-y-auto border-r ${
          isDarkMode ? 'bg-custom-dark text-white border-gray-700' : 'bg-white text-black border-gray-200'
        } shadow-sm duration-200 ease-linear lg:static lg:translate-x-0 ${isClosed ? 'lg:w-[80px] w-0' : 'lg:w-[240px] w-[0px]'}`}
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
              to={path.dashboardAD}
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
                      to={path.newsAD}
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
                          < FaRegNewspaper className='w-full h-full' />
                        </div>
                        {!isClosed && <span className='font-semibold'>News</span>}
                      </div>
                    </NavLink>
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
                      to={path.supplierAD}
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
              to={path.promotionAD}
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
                {!isClosed && <span className='font-semibold'>Promotion</span>}
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
                onClick={() => setIsUsersOpen(!isUsersOpen)}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <FaUserFriends className='w-full h-full' />
                  </div>
                  {!isClosed && (
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
                  )}
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
                        return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                          isClosed ? 'flex-col' : ''
                        }`
                      }}
                    >
                     <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <PiNewspaperClipping className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>Shop</span>}
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
                      return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                        isClosed ? 'flex-col' : ''
                      }`
                    }}
                  >
                    <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <FaTags className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>Customer</span>}
                    </div>
                  </NavLink>
                </div>
                </div>
              )}
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
                <div>
                {/* Manage Order */}
                <div className='mb-2'>
                <NavLink
                  to={path.manageOrder}
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
                      return `${active} min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center ${
                        isClosed ? 'flex-col' : ''
                      }`
                    }}
                  >
                    <div className='flex items-center'>
                      <div className='w-7 h-7 mr-3'>
                        <FaMoneyBill className='w-full h-full' />
                      </div>
                      {!isClosed && <span className='font-semibold'>Manage Payment</span>}
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
        
      </div>
    
  )
}
export default LeftSideBar
