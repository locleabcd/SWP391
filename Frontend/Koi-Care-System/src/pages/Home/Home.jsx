import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import Homepage from '../../components/Homepage/Homepage'
import About from '../../components/About/About'
import Feature from '../../components/Features/Feature'
import { Link as ScrollLink } from 'react-scroll'
import '../../index.css'
import { FaFacebook, FaTwitter, FaInstagram, FaTimes } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import { FaBars } from 'react-icons/fa'

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State to manage sidebar visibility
  const sidebarRef = useRef(null) // Ref for the sidebar element

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen) // Toggle the sidebar state
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false) // Close the sidebar
  }

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar()
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen])

  return (
    <div className='bg-overlay overflow-x-hidden'>
      <div className=' bg-white/50 '>
        <header className='shadow-lg bg-pink-100 fixed top-0 w-full z-10 '>
          <div className='mx-auto flex justify-between items-center py-4 px-4 lg:px-20'>
            <div className='flex items-center space-x-3'>
              <button className='p-2 rounded-lg hover:bg-gray-100'>
                <img className='w-12 lg:w-16 animate-slow-spin' src={logo} alt='Logo' />
              </button>
              <a href='#' className='text-2xl lg:text-3xl font-bold'>
                Koi Care System
              </a>
            </div>

            <nav className='pr-10 hidden lg:block'>
              <ul className='flex space-x-8'>
                <li>
                  <ScrollLink
                    to='home'
                    smooth={true}
                    duration={500}
                    spy={true}
                    activeClass='bg-red-500 text-white'
                    className='cursor-pointer hover:bg-red-500 hover:text-white font-medium text-2xl px-4 py-2 rounded-lg transition'
                  >
                    Home
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to='features'
                    smooth={true}
                    duration={500}
                    spy={true}
                    activeClass='bg-red-500 text-white'
                    className='cursor-pointer hover:bg-red-500 hover:text-white font-medium text-2xl px-4 py-2 rounded-lg transition'
                  >
                    Our Features
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to='about'
                    smooth={true}
                    duration={500}
                    spy={true}
                    activeClass='bg-red-500 text-white'
                    className='cursor-pointer hover:bg-red-500 hover:text-white font-medium text-2xl px-4 py-2 rounded-lg transition'
                  >
                    About
                  </ScrollLink>
                </li>
                <li>
                  <Link
                    to='/login'
                    className='hover:bg-red-500 hover:text-white font-medium text-2xl px-4 py-2 rounded-lg transition'
                  >
                    Sign in
                  </Link>
                </li>
              </ul>
            </nav>

            <div className='lg:hidden'>
              <button className='p-2 rounded-lg hover:bg-gray-100' onClick={toggleSidebar}>
                <FaBars />
              </button>
            </div>
          </div>
        </header>

        {isSidebarOpen && (
          <div className='fixed inset-0 z-20 flex items-start justify-end bg-black bg-opacity-50'>
            <div ref={sidebarRef} className='bg-pink-100 w-64 h-full shadow-lg p-4 relative'>
              <button className='absolute top-4 right-4 text-red-500' onClick={closeSidebar}>
                <FaTimes size={24} />
              </button>
              <nav className='flex flex-col space-y-4'>
                <ScrollLink
                  to='home'
                  smooth={true}
                  duration={500}
                  spy={true}
                  activeClass='bg-red-500 text-white'
                  className='cursor-pointer hover:bg-red-500 hover:text-white font-medium text-xl px-4 py-2 rounded-lg transition'
                  onClick={closeSidebar}
                >
                  Home
                </ScrollLink>
                <ScrollLink
                  to='features'
                  smooth={true}
                  duration={500}
                  spy={true}
                  activeClass='bg-red-500 text-white'
                  className='cursor-pointer hover:bg-red-500 hover:text-white font-medium text-xl px-4 py-2 rounded-lg transition'
                  onClick={closeSidebar}
                >
                  Our Features
                </ScrollLink>
                <ScrollLink
                  to='about'
                  smooth={true}
                  duration={500}
                  spy={true}
                  activeClass='bg-red-500 text-white'
                  className='cursor-pointer hover:bg-red-500 hover:text-white font-medium text-xl px-4 py-2 rounded-lg transition'
                  onClick={closeSidebar}
                >
                  About
                </ScrollLink>
                <Link
                  to='/login'
                  className='hover:bg-red-500 hover:text-white font-medium text-xl px-4 py-2 rounded-lg transition'
                  onClick={closeSidebar}
                >
                  Sign in
                </Link>
              </nav>
            </div>
          </div>
        )}

        <div id='home' className='pt-20 min-h-screen flex items-center justify-center'>
          <Homepage />
        </div>

        <div id='features' className='pt-20 min-h-screen'>
          <Feature />
        </div>

        <div id='about' className='pt-20 min-h-screen'>
          <About />
        </div>

        <footer className='py-6 border-t bg-gradient-to-r from-purple-200 to-pink-200 border-gray-200'>
          <div className='container mx-auto text-center'>
            <p className='mb-2'>© 2024 Koi Care System.</p>
            <p className='mb-2'>Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000</p>
            <p className='mb-2'>
              <a href='mailto:info@koicare.com' className='text-red-500 hover:underline'>
                koicaresystem@gmail.com
              </a>
            </p>

            <Link to='/policy' className='mb-2 px-3 underline'>
              Policy
            </Link>

            <div className='flex justify-center items-center space-x-4 mt-4'>
              <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer'>
                <FaFacebook className='w-6 h-6' />
              </a>
              <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer'>
                <FaTwitter className='w-6 h-6' />
              </a>
              <a href='https://www.instagram.com' target='_blank' rel='noopener noreferrer'>
                <FaInstagram className='w-6 h-6' />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
