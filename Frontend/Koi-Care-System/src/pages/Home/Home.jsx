import homepageImage from '../../assets/homepage.png'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
// example anh demo ->>
import demo from '../../assets/left_login.png'
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
          <div className='container mx-auto flex justify-between items-center py-1 pb-15'>
            {/* logo */}
            <div className='flex items-center'>
              <button className='p-1 ml-6 rounded-md '>
                <img className='w-12' src={logo} alt='Logo' />
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
      {/* homepage content */}
      <div id='feature'>
        <Feature />
      </div>

      <div id='about'>
        <About />
      </div>
      {/* homepage content */}

      {/* homepage content */}
      <div className='flex h-[90vh] '>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Keep an eye on your water parameters!</h>
            <p className='text-justify text-gray-600'>
              As a pond owner, regular water measurements are part of everyday life . Keep track and store your water
              parameters in KoiControl. The app analyzes your water parameters and gives you suggestions on how to
              improve them if necessary. This way you can offer your fish optimal conditions.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>

      {/* homepage content */}
      <div className='flex h-[90vh] '>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Keep an eye on your water parameters!</h>
            <p className='text-justify text-gray-600'>
              As a pond owner, regular water measurements are part of everyday life . Keep track and store your water
              parameters in KoiControl. The app analyzes your water parameters and gives you suggestions on how to
              improve them if necessary. This way you can offer your fish optimal conditions.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>

      {/* homepage content */}
      <div className='flex h-[90vh] '>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Keep an eye on your water parameters!</h>
            <p className='text-justify text-gray-600'>
              As a pond owner, regular water measurements are part of everyday life . Keep track and store your water
              parameters in KoiControl. The app analyzes your water parameters and gives you suggestions on how to
              improve them if necessary. This way you can offer your fish optimal conditions.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>
    </div>
  )
}

export default Home
