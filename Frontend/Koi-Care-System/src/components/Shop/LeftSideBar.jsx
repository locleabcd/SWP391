import { IoFishOutline } from 'react-icons/io5'
import { GiAquarium } from 'react-icons/gi'
import { IoIosWater } from 'react-icons/io'
import { LuAlarmClock } from 'react-icons/lu'
import { FaHandPointRight } from 'react-icons/fa'
import { CgCalculator } from 'react-icons/cg'
import { IoStatsChartSharp } from 'react-icons/io5'
import { FaRegNewspaper } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import path from '../../constants/path'
import { useDarkMode } from '../DarkModeContext'
import logo from '../../assets/logo.png'
import { useState } from 'react'

function LeftSideBar() {
  const { isDarkMode } = useDarkMode()

  const [isClosed, setClosed] = useState(false)

  return (
    <div>
      {/* open close button  */}
      <div className='relative '>
        {isClosed ? (
          <button
            className={`absolute duration-200 ease-linear left-0 top-6 p-1 z-30 ${
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
      {!isClosed && (
        <div
          className={`absolute top-0 left-0 z-999 flex h-screen w-[240px] flex-col no-scroll-bar overflow-y-auto border-r ${
            isDarkMode ? 'bg-custom-dark text-white  border-gray-700' : 'bg-white text-black border-gray-300'
          } shadow-sm duration-200 ease-linear lg:static lg:translate-x-0 -translate-x-full`}
        >
          <div className='flex justify-center items-center'>
            <button className='mt-4 rounded-md'>
              <img className='w-14 animate-slow-spin' src={logo} alt='Logo' />
            </button>
            <a href='#' className='mt-3 text-xl font-bold'>
              Koi Care System
            </a>
          </div>
          {/* right section */}

          <div className='flex flex-col justify-center items-center mt-6 duration-200'>
            <div className=''>
              

              {/* sidebar items  */}
              <NavLink
                to={path.shopNews}
                className={({ isActive }) => {
                  const active = isActive ? 'bg-custom-left-bar text-white' : ''
                  return `hover:text-white ${active} mt-2 hover:bg-custom-left-bar min-w-full p-4 cursor-pointer rounded-lg flex justify-between items-center`
                }}
              >
                {/* left section */}
                <div className='flex items-center'>
                  {/* icon image */}
                  <div className='w-7 h-7 mr-3'>
                    <FaRegNewspaper className='w-full h-full' />
                  </div>
                  <span className='font-semibold'>News and blogs</span>
                </div>
              </NavLink>

              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeftSideBar
