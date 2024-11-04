/* eslint-disable no-unused-vars */
import { IoFishOutline } from 'react-icons/io5'
import { GiAquarium } from 'react-icons/gi'
import { IoIosWater } from 'react-icons/io'
import { LuAlarmClock } from 'react-icons/lu'
import { FaCrown, FaHandPointRight } from 'react-icons/fa'
import { CgCalculator } from 'react-icons/cg'
import { IoStatsChartSharp } from 'react-icons/io5'
import { FaRegNewspaper } from 'react-icons/fa'
import { Link, NavLink } from 'react-router-dom'
import path from '../../constants/path'
import { useDarkMode } from '../../hooks/DarkModeContext'
import logo from '../../assets/logo.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IoPowerOutline } from 'react-icons/io5'
import '../../components/Member/animation.css'
function LeftSideBar() {
  const { isDarkMode } = useDarkMode()
  const [isClosed, setClosed] = useState(() => {
    const savedState = localStorage.getItem('isSidebarClosed')
    return savedState ? JSON.parse(savedState) : false
  })
  const [user, setUser] = useState([])

  useEffect(() => {
    localStorage.setItem('isSidebarClosed', JSON.stringify(isClosed))
  }, [isClosed])

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
      console.log(res.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
  }

  const isMember = user?.status === 'NORMAL'
  const avt = localStorage.getItem('avt')
  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')

  return (
    <div className=''>
      <div className='relative'>
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

      <div className=''>
        <div
          className={`absolute top-0 left-0 z-999 flex h-screen flex-col no-scroll-bar overflow-y-auto border-r ${
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
                to={path.myKoi}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                  return `${active} min-w-full mt-2 p-4  cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <IoFishOutline className='w-full h-full' />
                  </div>

                  {!isClosed && <span className='font-semibold'>My Koi</span>}
                </div>
              </NavLink>

              <NavLink
                to={path.myPond}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                  return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <GiAquarium className='w-full h-full' />
                  </div>
                  {!isClosed && <span className='font-semibold'>My Pond</span>}
                </div>
              </NavLink>

              <NavLink
                to={isMember ? path.pricing : path.waterParameters}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                  const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                  return `${active} ${memberStyles} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex-wrap flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <IoIosWater className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <div className='flex items-center'>
                      <span className='font-semibold'>Water Parameters</span>
                      {isMember ? (
                        <div className='text-yellow-500'>
                          <FaCrown className='ml-3 w-6 h-6' />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </NavLink>

              <NavLink
                to={isMember ? path.pricing : path.reminders}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                  const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                  return `${active} ${memberStyles} min-w-full p-4 mt-2 flex-wrap cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <LuAlarmClock className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <div className='flex items-center'>
                      <span className='font-semibold'>Reminders</span>
                      {isMember ? (
                        <div className='text-yellow-500'>
                          <FaCrown className='ml-3 w-6 h-6' />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </NavLink>

              <NavLink
                to={path.recommendations}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                  return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <FaHandPointRight className='w-full h-full' />
                  </div>
                  {!isClosed && <span className='font-semibold'>Recommendations</span>}
                </div>
              </NavLink>

              <NavLink
                to={isMember ? path.pricing : path.foodCalculator}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                  const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                  return `${active} ${memberStyles} min-w-full p-4 flex-wrap mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <CgCalculator className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <div className='flex items-center'>
                      <span className='font-semibold'>Food Calculator</span>
                      {isMember ? (
                        <div className='text-yellow-500'>
                          <FaCrown className='ml-3 w-6 h-6' />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </NavLink>

              <NavLink
                to={isMember ? path.pricing : path.saltCalculator}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                  const memberStyles = isMember ? 'opacity-80 cursor-not-allowed ' : ''

                  return `${active} ${memberStyles} min-w-full flex-wrap p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <CgCalculator className='w-full h-full' />
                  </div>
                  {!isClosed && (
                    <div className='flex items-center'>
                      <span className='font-semibold'>Salt Calculator</span>
                      {isMember ? (
                        <div className='text-yellow-500'>
                          <FaCrown className='ml-3 w-6 h-6' />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </NavLink>

              <NavLink
                to={path.statistics}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                  return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <IoStatsChartSharp className='w-full h-full' />
                  </div>
                  {!isClosed && <span className='font-semibold'>Statistics</span>}
                </div>
              </NavLink>

              {/* sidebar items  */}
              <NavLink
                to={path.news}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                  return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
                }}
              >
                <div className='flex items-center'>
                  <div className='w-7 h-7 mr-3'>
                    <FaRegNewspaper className='w-full h-full' />
                  </div>
                  {!isClosed && <span className='font-semibold'>News and Blogs</span>}
                </div>
              </NavLink>

              <NavLink
                to={path.aboutMember}
                className={({ isActive }) => {
                  const active = isActive
                    ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                    : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                  return `${active} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                    isClosed ? 'flex-col' : ''
                  }`
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
                  {!isClosed && <span className='font-semibold'>About</span>}
                </div>
              </NavLink>
            </div>
          </div>

          {!isClosed && (
            <div
              className={`mt-auto sticky bottom-0 z-50 w-full p-2 flex justify-between items-center 
            ${isDarkMode ? 'bg-custom-dark' : 'bg-white'} neon-border`}
            >
              <div
                className={`flex p-4 rounded-lg items-center justify-between w-full ${isDarkMode ? 'bg-custom-dark ' : 'bg-white'}`}
              >
                <div className='card-content flex items-center '>
                  <img
                    src={user.avatar || 'default-avatar.png'}
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
                    className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-500'}  hover:text-red-500 transition-colors duration-200 cursor-pointer`}
                    title='Logout'
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
