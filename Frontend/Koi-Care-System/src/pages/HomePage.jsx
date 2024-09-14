import React, { Component } from 'react'
import homepageImage from '../assets/homepage.png';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export default class HomePage extends Component {
  render() {
    return (
      <div>
        {/* homepage 1  */}
        <div className='bg-cover bg-no-repeat bg-center min-h-screen ' style={{ backgroundImage: `url(${homepageImage})` }}>
        {/* header */}
          <header className=" shadow large shadow-gray-300">         
            {/* container for logo and nav */}
            <div className="container mx-auto flex justify-between items-center py-4">
              {/* logo */}
              <div className="flex items-center">
                <button className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <img className="w-12" src={logo} alt="Logo" />
                </button>
                <a href="#" className="ml-4 text-xl font-bold text-gray-800">
                  Koi Care System
                </a>
              </div>
              {/* nav menu */}
              <nav className="inline-block">
                <ul className="flex space-x-8">
                  <li><a href="#" className="text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md">Home</a></li>
                  <li><a href="#" className="text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md">Our Feature</a></li>
                  <li><a href="#" className="text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md">About</a></li>
                  <li>
                    <Link to='/login' className="text-black-600 hover:text-white hover:bg-red-500 font-medium text-xl px-3 py-2 rounded-md">Sign in</Link>
                    </li>
                </ul>
              </nav>
            </div>
          </header>
          <div className='content-homepage'>
            {/* content home page  */}
          <div className='flex justify-start items-center h-full'>
            <div className='flex flex-col items-center mr-auto ml-10 pt-40 w-1/2'>
              <h1 className='text-5xl font-bold text-black mb-4'>Travel to Japan</h1>
              <p className='text-gray-600 text-lg mb-8'>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit
              </p>
              <button className='bg-white text-black border border-gray-300 border-solid  hover:bg-red-500 hover:text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline'>
                Learn More
              </button>
            </div>         
          </div>
          
          </div>      
        </div>
        {/* homepage 2 */}
        <div>
        </div>
      </div>
      
       
    )
  }
}
