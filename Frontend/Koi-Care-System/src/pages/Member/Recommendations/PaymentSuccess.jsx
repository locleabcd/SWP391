import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import gif from '../../../assets/payment-complete.gif'
import { Link } from 'react-router-dom'

function PaymentSuccess() {
  const { isDarkMode } = useDarkMode()
  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />

          <div className='py-5 px-[30px] mx-auto '>
            <TopLayout text='Recommendations' textName='Payment' links='member/recommendations' />

            <div className='border border-gray-200 px-10 py-5 rounded-xl'>
              <ol className='items-center flex w-full px-52 pb-20 pt-14 justify-center text-center text-sm font-medium text-gray-700'>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400 dark:text-primary-500'>
                  <span className='flex flex-col'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-10 bg-blue-400 rounded-full text-white'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <div className='mt-4'>Cart</div>
                  </span>
                </li>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400 dark:text-primary-500'>
                  <span className='flex flex-col'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-10 bg-blue-400 rounded-full text-white'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>
                    <div className='mt-4'>Address</div>
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='flex flex-col'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-10 bg-blue-400 rounded-full text-white'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>
                    <div className='mt-4'>Payment</div>
                  </span>
                </li>
              </ol>

              <div className='flex flex-col justify-center items-center'>
                <div className='text-3xl font-semibold mb-4'>Thank you for your purchase!</div>
                <img
                  alt='payment'
                  loading='lazy'
                  width={400}
                  decoding='async'
                  data-nimg={1}
                  src={gif}
                  style={{ color: 'transparent' }}
                />
              </div>

              <div className='flex justify-between mt-8'>
                <Link
                  to='/member/recommendations'
                  className='px-6 py-3 bg-blue-400 hover:bg-gray-400 text-white rounded-lg cursor-pointer'
                >
                  Continue to shopping
                </Link>
                <button className='px-6 py-3 bg-gray-300 hover:bg-gray-400 text-white rounded-lg cursor-pointer'>
                  Download bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
