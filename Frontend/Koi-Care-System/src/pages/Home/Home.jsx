import homepageImage from '../../assets/homepage.png'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import Homepage from '../../components/Homepage/Homepage'
import About from '../../components/About/About'
import Feature from '../../components/Features/Feature'
import { Link as ScrollLink } from 'react-scroll'

function Home() {
  return (
    <div>
      {/* homepage 1  */}
      <div
        className='bg-cover bg-no-repeat bg-center min-h-screen '
        style={{ backgroundImage: `url(${homepageImage})` }}
      >
        {/* header */}
        <header className=' shadow large fixed w-full z-10 bg-white shadow-gray-300'>
          {/* container for logo and nav */}
          <div className='container  mx-auto flex justify-between items-center py-1 pb-15'>
            {/* logo */}
            <div className='flex items-center'>
              <button className='p-1 ml-6 rounded-md '>
                <img className='w-12 animate-spin' src={logo} alt='Logo' />
              </button>
              <a href='#' className=' text-xl font-bold text-gray-800'>
                Koi Care System
              </a>
            </div>
            {/* nav menu */}
            <nav className='inline-block pr-10'>
              <ul className='flex space-x-8'>
                <li>
                  <ScrollLink
                    to='home'
                    smooth={true}
                    duration={500}
                    spy={true}
                    activeClass='bg-red-500 text-white'
                    className='cursor-pointer text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md'
                  >
                    Home
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to='feature'
                    smooth={true}
                    duration={500}
                    spy={true}
                    activeClass='bg-red-500 text-white'
                    className='cursor-pointer text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md'
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
                    className='cursor-pointer text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md'
                  >
                    About
                  </ScrollLink>
                </li>
                <li>
                  <Link
                    to='/login'
                    className='text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md'
                  >
                    Sign in
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div id='home'>
          <Homepage />
        </div>
      </div>

      <div id='feature'>
        <Feature />
      </div>

      <div id='about'>
        <About />
      </div>

      {/* footer */}
      <footer className='bg-gray-800 text-white py-6'>
        <div className='container mx-auto text-center'>
          <p className='mb-2'>© 2024 Koi Care System.</p>
          <p className='mb-2'>Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000</p>
          <p className='mb-2'>
            <a href='mailto:info@koicare.com' className='text-red-500 hover:underline'>
              info@koicare.com
            </a>
          </p>
          <div className='flex justify-center space-x-4'>
            <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer'>
              <img src='../assets/facebook.png' alt='Facebook' className='w-6 h-6' />
            </a>
            <a href='https://www.twitter.com' target='_blank' rel='noopener noreferrer'>
              <img src='../assets/twitter.png' alt='Twitter' className='w-6 h-6' />
            </a>
            <a href='https://www.instagram.com' target='_blank' rel='noopener noreferrer'>
              <img src='../assets/instagram.png' alt='Instagram' className='w-6 h-6' />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
