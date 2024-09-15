import React, { Component } from 'react'
import homepageImage from '../assets/homepage.png';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
// example anh demo ->> 
import demo from '../assets/left_login.png'
import { useEffect, useRef, useState } from 'react';

export default class HomePage extends Component {
  constructor(props) {

    super(props);
    this.state = {
      isVisible: false,
    };
    this.leftContentRef = React.createRef();
    this.rightContentRef = React.createRef();
  }

  componentDidMount() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setState({ isVisible: true });
          }
        });
      },
      { threshold: 0.3 } 
    );

    if (this.leftContentRef.current) {
      observer.observe(this.leftContentRef.current);
    }

    if (this.rightContentRef.current) {
      observer.observe(this.rightContentRef.current);
    }

    this.observer = observer;
  }

  componentWillUnmount() {
    if (this.leftContentRef.current) {
      this.observer.unobserve(this.leftContentRef.current);
    }

    if (this.rightContentRef.current) {
      this.observer.unobserve(this.rightContentRef.current);
    }
  }
  render() {
    const { isVisible } = this.state;
    
    return (
      <div>
        {/* homepage 1  */}
        <div className='bg-cover bg-no-repeat bg-center min-h-screen ' style={{ backgroundImage: `url(${homepageImage})` }}>
        {/* header */}
          <header className=" shadow large shadow-gray-300 fixed top-0 left-0 w-full bg-white z-50">         
            {/* container for logo and nav */}
            <div className="container mx-auto flex justify-between items-center py-1 pb-15">
              {/* logo */}
              <div className="flex items-center">
                <button className="p-1 ml-6 rounded-md ">
                  <img className="w-12" src={logo} alt="Logo" />
                </button>
                <a href="#" className=" text-xl font-bold text-gray-800">
                  Koi Care System
                </a>
              </div>
              {/* nav menu */}
              <nav className="inline-block pr-10">
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
          <div>
            <div className='flex justify-start items-center h-full'>
              <div className='flex flex-col items-center mr-auto ml-10 pt-36 w-1/2'>
                <h1 className='text-5xl font-bold text-black mb-4'>Koi Care System</h1>
                <p className='text-gray-600 text-lg font-medium mb-8'>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit
                </p>
                <button className='bg-white text-black border border-gray-300 border-solid  hover:bg-red-500 hover:text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline'>
                  Learn More
                </button>
              </div>         
            </div>
            
            </div>      
          </div>
        {/* homepage content */}
        <div className='flex h-[90vh] '>
          {/* left content */}
          <div ref={this.leftContentRef} className={`w-2/5 flex flex-col items-center justify-center h-full py-10 transition-transform duration-[2000ms] ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-56 opacity-0'
          }`}>
            <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
              <h className="text-3xl text-center font-bold mb-12">Keep an eye on your water parameters!</h> 
              <p className="text-justify text-gray-600">As a pond owner, regular water measurements are part of everyday life
                . Keep track and store your water parameters in KoiControl. The app analyzes your water parameters and gives you suggestions 
                on how to improve them if necessary. This way you can offer your fish optimal conditions.</p>
            </div>

          </div>
          {/* right content */}
          <div ref={this.rightContentRef}
          className={`w-3/5 flex flex-col items-center justify-center min-h-full transition-transform duration-[2000ms] ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-56 opacity-0'
          }`}>
            <img className='' src={demo} alt="img" />
          </div>
        </div>

        {/* homepage content */}
        <div className='flex h-[90vh] '>
          {/* left content */}
          <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
            <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
              <h className="text-3xl text-center font-bold mb-12">Keep an eye on your water parameters!</h> 
              <p className="text-justify text-gray-600">As a pond owner, regular water measurements are part of everyday life
                . Keep track and store your water parameters in KoiControl. The app analyzes your water parameters and gives you suggestions 
                on how to improve them if necessary. This way you can offer your fish optimal conditions.</p>
            </div>

          </div>
          {/* right content */}
          <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
            <img className='' src={demo} alt="img" />
          </div>
        </div>

        {/* homepage content */}
        <div className='flex h-[90vh] '>
          {/* left content */}
          <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
            <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
              <h className="text-3xl text-center font-bold mb-12">Keep an eye on your water parameters!</h> 
              <p className="text-justify text-gray-600">As a pond owner, regular water measurements are part of everyday life
                . Keep track and store your water parameters in KoiControl. The app analyzes your water parameters and gives you suggestions 
                on how to improve them if necessary. This way you can offer your fish optimal conditions.</p>
            </div>

          </div>
          {/* right content */}
          <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
            <img className='' src={demo} alt="img" />
          </div>
        </div>

        {/* homepage content */}
        <div className='flex h-[90vh] '>
          {/* left content */}
          <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
            <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
              <h className="text-3xl text-center font-bold mb-12">Keep an eye on your water parameters!</h> 
              <p className="text-justify text-gray-600">As a pond owner, regular water measurements are part of everyday life
                . Keep track and store your water parameters in KoiControl. The app analyzes your water parameters and gives you suggestions 
                on how to improve them if necessary. This way you can offer your fish optimal conditions.</p>
            </div>

          </div>
          {/* right content */}
          <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
            <img className='' src={demo} alt="img" />
          </div>
        </div>

        {/* homepage content */}
        <div className='flex h-[90vh] '>
          {/* left content */}
          <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
            <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
              <h className="text-3xl text-center font-bold mb-12">Keep an eye on your water parameters!</h> 
              <p className="text-justify text-gray-600">As a pond owner, regular water measurements are part of everyday life
                . Keep track and store your water parameters in KoiControl. The app analyzes your water parameters and gives you suggestions 
                on how to improve them if necessary. This way you can offer your fish optimal conditions.</p>
            </div>

          </div>
          {/* right content */}
          <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
            <img className='' src={demo} alt="img" />
          </div>
        </div>
        {/* footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto text-center">
            <p className="mb-2">© 2024 Koi Care System.</p>
            <p className="mb-2">Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000</p>
            <p className="mb-2">
              <a href="mailto:info@koicare.com" className="text-red-500 hover:underline">info@koicare.com</a>
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="../assets/facebook.png" alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="../assets/twitter.png" alt="Twitter" className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="../assets/instagram.png" alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </footer>
        


      </div>
      
       
    )
  }
}
