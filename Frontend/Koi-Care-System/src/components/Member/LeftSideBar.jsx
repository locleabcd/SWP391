import { IoFishOutline } from 'react-icons/io5'
import { GiAquarium } from 'react-icons/gi'
import { IoIosWater } from 'react-icons/io'
import { LuAlarmClock } from 'react-icons/lu'
import { FaHandPointRight } from 'react-icons/fa'
import { CgCalculator } from 'react-icons/cg'
import { IoStatsChartSharp } from 'react-icons/io5'
import { FaRegNewspaper } from 'react-icons/fa'
import {Link, NavLink } from 'react-router-dom'
import path from '../../constants/path'
import { useDarkMode } from '../../hooks/DarkModeContext'
import logo from '../../assets/logo.png'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { IoPowerOutline } from 'react-icons/io5'
import  '../../components/Member/animation.css'
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

  const handleLogout = () => {
    localStorage.clear()
  }

  const isMember = user?.status === 'NORMAL'

  return (
    <div>
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

                const memberStyles = isMember ? 'opacity-50 line-through cursor-not-allowed bg-white' : ''

                return `${active} ${memberStyles} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                }`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <IoIosWater className='w-full h-full' />
                </div>
                {!isClosed && <span className='font-semibold'>Water Parameters</span>}
              </div>
            </NavLink>

            <NavLink
              to={isMember ? path.pricing : path.reminders}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                const memberStyles = isMember ? 'opacity-50 line-through cursor-not-allowed bg-white' : ''

                return `${active} ${memberStyles} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                }`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <LuAlarmClock className='w-full h-full' />
                </div>
                {!isClosed && <span className='font-semibold'>Reminders</span>}
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

                const memberStyles = isMember ? 'opacity-50 line-through cursor-not-allowed bg-white' : ''

                return `${active} ${memberStyles} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                }`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <CgCalculator className='w-full h-full' />
                </div>
                {!isClosed && <span className='font-semibold'>Food Calculator</span>}
              </div>
            </NavLink>

            <NavLink
              to={isMember ? path.pricing : path.saltCalculator}
              className={({ isActive }) => {
                const active = isActive
                  ? `${isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'}`
                  : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`

                const memberStyles = isMember ? 'opacity-50 line-through cursor-not-allowed bg-white' : ''

                return `${active} ${memberStyles} min-w-full p-4 mt-2 cursor-pointer rounded-lg flex justify-between items-center ${
                  isClosed ? 'flex-col' : ''
                }`
              }}
            >
              <div className='flex items-center'>
                <div className='w-7 h-7 mr-3'>
                  <CgCalculator className='w-full h-full' />
                </div>
                {!isClosed && <span className='font-semibold'>Salt Calculator</span>}
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
                  <FaRegNewspaper className='w-full h-full' />
                </div>
                {!isClosed && <span className='font-semibold'>About</span>}
              </div>
            </NavLink>
           
          </div>
        </div>

        <div className={`mt-auto w-full p-4 flex justify-between items-center ${isDarkMode ? 'bg-custom-dark' : 'bg-white'} neon-border`}>
          
      {/* User avatar, name, and role */}
     
      <div className="card-content flex items-center">
        
        <img src={user.avatar || 'default-avatar.png'} alt="User Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-gray-300" />
        <div className="ml-3">
          <p className="font-semibold text-lg text-black">{user.name || 'User Name'}</p>
          <p className="text-sm text-gray-500">{user.role || 'User Role'}</p>
        </div>
      </div>
      <Link onClick={handleLogout} to="/login"  >
        <IoPowerOutline 
          className="text-2xl text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
          title="Logout"
        />
      </Link>
      </div>
      </div>
    </div>
  )
}

export default LeftSideBar
