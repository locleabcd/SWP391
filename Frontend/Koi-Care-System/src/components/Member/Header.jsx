import { useDarkMode } from '../../components/DarkModeContext'
import logo from '../../assets/logo.png'
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'
import path from '../../constants/path'

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const toggleList = () => {
    setIsOpen(!isOpen)

  }

  const handleLogout = () => {
    localStorage.clear()
  }

  const { isDarkMode, toggleDarkMode } = useDarkMode()




  return (
    <div className={isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'}>
      <div className='flex items-center justify-between p-2'>
        <div className='flex justify-center items-center'>
          <button className='pt-2 rounded-md'>
            <img className='w-14 animate-slow-spin' src={logo} alt='Logo' />
          </button>
          <a href='#' className='pt-2 text-xl font-bold'>
            Koi Care System
          </a>
        </div>
        <div className="search-box mt-4">
              <input
                type="text"
                className="w-80 max-w-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Search"
              />
        </div>
        <div>
          <div className='flex items-center mr-6'>
            <div className='switch-checkbox'>
              <label className='switch'>
                <input type='checkbox' checked={isDarkMode} onChange={toggleDarkMode} />
                <span className='slider round'> </span>
              </label>
            </div>
            <div className='my-account '>
              <button
                  onClick={toggleList}
                  className='flex items-center p-2 rounded-md space-x-2'>
                  <div className='flex flex-col'>
                    <p className='text-sm font-medium'>User Name</p>
                    <p className='text-xs text-gray-500'>Member</p>
                  </div>
                  <div className='ml-auto flex items-center space-x-1'>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-12"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
              </button>
              {isOpen && (
                <div
                className={`absolute right-10 w-44 border border-gray-300 shadow-lg ${
                  isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                }`}
                >
                  <NavLink
                    to={path.profile}
                    end
                    className=' px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center'
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
                    to={path.shopCart}
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center'
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
                    <span>Shop Cart</span>
                  </NavLink>
                  <Link
                    onClick={handleLogout}
                    to={path.login}
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center'
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
    </div>
  )
}

export default Header
