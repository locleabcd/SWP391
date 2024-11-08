import { Link, useNavigate } from 'react-router-dom'
import { useDarkMode } from '../../hooks/DarkModeContext'
import Header from '../Member/Header'
import LeftSideBar from '../Member/LeftSideBar'
import { useState } from 'react'
import axios from 'axios'

function Pricing() {
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const createPayment = async () => {
    const userId = localStorage.getItem('id')
    try {
      const token = localStorage.getItem('token')

      await axios.post(
        'https://koicaresystemv2.azurewebsites.net/api/orders/order/premium',
        {
          userId: userId,
          time: '1MONTH'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      navigate('/member/payment')
      localStorage.setItem('totalPrice', 299999)
    } catch (error) {
      console.error('Error details:', error)
    }
  }

  return (
    <div>
      <div className='min-h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-x-hidden`}
        >
          <Header />

          <div className='px-[30px] mt-[120px]'>
            <section className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='flex flex-col rounded-lg  p-6 shadow border border-gray-200 xl:p-8'>
                <div className='flex-1'>
                  <h3 className='mb-4 text-2xl font-semibold '>Premium Bronze</h3>
                  <div className='mb-4 flex items-baseline '>
                    <span className='text-3xl font-semibold'>đ</span>
                    <span className='text-5xl font-extrabold tracking-tight ml-2'>299.000</span>
                    <span className='ml-1 text-2xl font-normal'>/month</span>
                  </div>
                  <p className='text-lg font-normal '>
                    Essential features in the koi care system, perfect for beginners and casual users.
                  </p>
                  <ul className='my-6 space-y-4'>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                        <path
                          fillRule='evenodd'
                          d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Unlock access to water parameters, ensuring optimal conditions for your koi.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Unlock the food calculator to determine the right amount of food for your koi.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Access the salt calculator to maintain optimal health in your koi pond.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        24/7 phone, chat, and email support.
                      </span>
                    </li>
                    <li className='flex space-x-3 line-through decoration-gray-500'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-500'>
                        Get hundreds of feature updates each year.
                      </span>
                    </li>
                    <li className='flex space-x-3 line-through decoration-gray-500'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-500'>
                        No setup fees, monthly fees, or hidden fees.
                      </span>
                    </li>
                    <li className='flex space-x-3 line-through decoration-gray-500'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-500'>Save costs</span>
                    </li>
                  </ul>
                </div>
                <div
                  onClick={() => navigate('/member/recommendations/1')}
                  className='rounded-lg bg-blue-400 px-5 cursor-pointer py-4 hover:bg-blue-500 text-center text-sm font-medium text-white'
                >
                  Buy Now
                </div>
              </div>
              <div className='flex flex-col rounded-lg  p-6 shadow border border-gray-200  xl:p-8'>
                <div className='flex-1'>
                  <h3 className='mb-4 text-2xl font-semibold '>Premium Silver</h3>
                  <div className='mb-4 flex items-baseline'>
                    <span className='text-3xl font-semibold'>đ</span>
                    <span className='text-5xl font-extrabold tracking-tight ml-2'>999.000</span>
                    <span className='ml-1 text-2xl font-normal'>/6 months</span>
                  </div>
                  <p className='text-lg font-normal '>
                    Advanced features for enthusiastic koi keepers looking to enhance their experience.
                  </p>
                  <ul className='my-6 space-y-4'>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                        <path
                          fillRule='evenodd'
                          d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Unlock access to water parameters, ensuring optimal conditions for your koi.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Unlock the food calculator to determine the right amount of food for your koi.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Access the salt calculator to maintain optimal health in your koi pond.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        24/7 phone, chat, and email support.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Get hundreds of feature updates each year.
                      </span>
                    </li>
                    <li className='flex space-x-3 line-through decoration-gray-500'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-500'>
                        No setup fees, monthly fees, or hidden fees.
                      </span>
                    </li>
                    <li className='flex space-x-3 line-through decoration-gray-500'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-500'>Save costs</span>
                    </li>
                  </ul>
                </div>
                <div
                  onClick={() => navigate('/member/recommendations/2')}
                  className='rounded-lg bg-blue-400 px-5 cursor-pointer py-4 hover:bg-blue-500 text-center text-sm font-medium text-white'
                >
                  Buy Now
                </div>
              </div>
              <div className='flex flex-col rounded-lg  p-6 shadow border border-gray-200 xl:p-8'>
                <div className='flex-1'>
                  <h3 className='mb-4 text-2xl font-semibold '>Premium Gold</h3>
                  <div className='mb-4 flex items-baseline'>
                    <span className='text-3xl font-semibold'>đ</span>
                    <span className='text-5xl font-extrabold tracking-tight ml-2'>1.999.000</span>
                    <span className='ml-1 text-2xl font-normal text-gray-500 dark:text-gray-400'>/year</span>
                  </div>
                  <p className='text-lg font-normal'>
                    The ultimate package for serious koi enthusiasts who want the best for their fish.
                  </p>
                  <ul className='my-6 space-y-4'>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                        <path
                          fillRule='evenodd'
                          d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Unlock access to water parameters, ensuring optimal conditions for your koi.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Unlock the food calculator to determine the right amount of food for your koi.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Access the salt calculator to maintain optimal health in your koi pond.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        24/7 phone, chat, and email support.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        Get hundreds of feature updates each year.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>
                        No setup fees, monthly fees, or hidden fees.
                      </span>
                    </li>
                    <li className='flex space-x-3'>
                      <svg
                        stroke='currentColor'
                        fill='currentColor'
                        strokeWidth={0}
                        viewBox='0 0 20 20'
                        aria-hidden='true'
                        className='h-5 w-5 shrink-0 text-green-400'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-base font-normal text-gray-500 dark:text-gray-400'>Save costs</span>
                    </li>
                  </ul>
                </div>
                <div
                  onClick={() => navigate('/member/recommendations/3')}
                  className='rounded-lg bg-blue-400 px-5 cursor-pointer py-4 hover:bg-blue-500 text-center text-sm font-medium text-white'
                >
                  Buy Now
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
