import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Payment() {
  const { isDarkMode } = useDarkMode()

  const [payment, SetPayment] = useState([])
  const [cart, setCart] = useState([])
  const [selectedPayment, setSelectedPayment] = useState('')

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value)
    console.log(selectedPayment)
  }

  const getCartId = async () => {
    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/carts/cart/${cartId}/my-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCart(response.data.data)
      console.log(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCartId()
  }, [])

  const createPayment = async () => {
    try {
      const token = localStorage.getItem('token')

      const id = localStorage.getItem('id')
      const res = await axios.get('https://koicaresystemv2.azurewebsites.net/api/payment/vn-pay', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          amount: promotionTotal,
          userId: id,
          bankCode: selectedPayment
        }
      })
      SetPayment(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (selectedPayment) {
      createPayment()
      console.log('Selected Payment:', selectedPayment)
    }
  }, [selectedPayment])

  const subTotal = Number(localStorage.getItem('totalPrice') || 0)
  const promotionTotal = Number(localStorage.getItem('promotionTotal') || 0)

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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px] '>
            <TopLayout text='Recommendations' textName='Payment' links='member/recommendations' />

            <div className='lg:border lg:border-gray-200 lg:px-10 lg:py-5 rounded-xl'>
              <ol className='items-center lg:flex hidden w-full px-52 pb-20 pt-14 justify-center text-center text-sm font-medium text-gray-700'>
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
                    <div className='w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white '>
                      3
                    </div>
                    <div className='mt-4'>Payment</div>
                  </span>
                </li>
              </ol>

              <div className='flex flex-col justify-center items-center lg:border lg:border-gray-200 lg:px-10 lg:py-5'>
                <div className='lg:text-3xl text-xl font-semibold text-start w-full'>Payment option</div>
                <div className='flex justify-between gap-3 lg:mt-16 mt-5 w-full'>
                  <div className='lg:flex-none lg:w-[1000px] col-span-2 space-y-3'>
                    <div className='border p-6 rounded-lg'>
                      <div className='flex items-center justify-between gap-5'>
                        <div className='flex items-center gap-5'>
                          <input
                            type='radio'
                            name='payment-method'
                            id='intcard'
                            value='INTCARD'
                            checked={selectedPayment === 'INTCARD'}
                            onChange={handlePaymentChange}
                            className='mr-2 size-6'
                          />
                          <label htmlFor='intcard'>
                            <h6 className='lg:text-lg text-sm font-semibold'>INTCARD Card Payment</h6>
                            <p className='lg:text-lg text-sm mt-3 lg:mt-0 text-gray-600'>
                              We support payments through INTCARD, enabling you to make secure and convenient
                              transactions.
                            </p>
                          </label>
                        </div>
                        <div>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                            version='1.1'
                            className='size-16'
                            viewBox='0 0 256 256'
                            xmlSpace='preserve'
                          >
                            <defs />
                            <g
                              style={{
                                stroke: 'none',
                                strokeWidth: 0,
                                strokeDasharray: 'none',
                                strokeLinecap: 'butt',
                                strokeLinejoin: 'miter',
                                strokeMiterlimit: 10,
                                fill: 'none',
                                fillRule: 'nonzero',
                                opacity: 1
                              }}
                              transform='translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)'
                            >
                              <path
                                d='M 84.259 16.068 H 5.741 C 2.57 16.068 0 18.638 0 21.809 v 8.131 h 90 v -8.131 C 90 18.638 87.43 16.068 84.259 16.068 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(27,77,162)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 0 60.06 v 8.131 c 0 3.171 2.57 5.741 5.741 5.741 h 78.518 c 3.171 0 5.741 -2.57 5.741 -5.741 V 60.06 H 0 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(244,169,41)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <rect
                                x={0}
                                y='27.94'
                                rx={0}
                                ry={0}
                                width={90}
                                height='34.12'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(240,240,240)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <path
                                d='M 9.259 34.213 c 0.96 -0.494 2.058 -0.295 3.089 -0.314 c 2.362 0.062 4.728 -0.057 7.09 0.048 c 1.064 -0.005 1.977 0.879 2.124 1.91 c 0.741 3.592 1.421 7.199 2.148 10.801 c -1.202 -4.22 -4.376 -7.665 -8.107 -9.855 C 13.631 35.619 11.43 34.93 9.259 34.213 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(244,169,41)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 29.806 33.909 c 2.048 0.024 4.091 0.014 6.135 0 c -3.108 7.427 -6.006 14.94 -9.181 22.339 c -1.996 -0.062 -3.992 -0.033 -5.987 -0.033 c -1.768 -6.458 -3.417 -12.949 -5.17 -19.411 c 3.73 2.191 6.904 5.636 8.107 9.855 c 0.181 0.817 0.309 1.654 0.466 2.48 C 26.038 44.059 27.924 38.984 29.806 33.909 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(27,77,162)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 38.236 33.899 c 1.925 0.014 3.849 0.014 5.774 0 c -1.183 7.441 -2.428 14.873 -3.583 22.32 c -1.915 0.005 -3.83 0.005 -5.75 0 C 35.779 48.768 37.076 41.345 38.236 33.899 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(27,77,162)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 49.483 35.301 c 3.45 -2.267 7.959 -2.2 11.775 -0.946 c -0.176 1.649 -0.451 3.284 -0.737 4.913 c -2.029 -0.974 -4.395 -1.407 -6.6 -0.841 c -1.041 0.247 -2.067 1.54 -1.202 2.509 c 1.777 1.82 4.576 2.233 6.249 4.215 c 1.939 1.896 1.867 5.089 0.546 7.308 c -1.397 2.343 -4.087 3.569 -6.705 3.92 c -2.96 0.309 -6.044 0.124 -8.819 -1.022 c 0.295 -1.663 0.542 -3.336 0.841 -4.999 c 2.4 1.24 5.184 1.863 7.86 1.269 c 0.908 -0.304 1.844 -1.05 1.763 -2.115 c -0.299 -1.269 -1.625 -1.81 -2.656 -2.385 c -2.001 -0.984 -4.153 -2.191 -5.051 -4.353 C 45.63 40.043 47.107 36.845 49.483 35.301 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(27,77,162)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 76.07 33.928 c -1.768 0.033 -3.545 -0.071 -5.313 0.052 c -1.202 0.062 -1.963 1.178 -2.347 2.205 c -2.78 6.691 -5.593 13.367 -8.378 20.053 c 2.015 -0.005 4.03 -0.005 6.044 -0.005 c 0.423 -1.117 0.832 -2.243 1.226 -3.369 c 2.461 0.014 4.923 0.01 7.389 0.01 c 0.228 1.126 0.466 2.248 0.718 3.364 c 1.777 -0.005 3.554 -0.005 5.332 -0.01 C 79.183 48.796 77.652 41.36 76.07 33.928 z M 68.98 48.273 c 1.074 -2.761 1.953 -5.602 3.155 -8.311 c 0.356 2.804 1.055 5.55 1.63 8.316 C 72.169 48.278 70.577 48.278 68.98 48.273 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(27,77,162)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 4 68.191 V 62.06 H 0 v 6.131 c 0 3.171 2.57 5.741 5.741 5.741 h 4 C 6.57 73.932 4 71.362 4 68.191 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(215,149,36)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <path
                                d='M 4 21.809 c 0 -3.171 2.57 -5.741 5.741 -5.741 h -4 C 2.57 16.068 0 18.638 0 21.809 v 6.131 h 4 V 21.809 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(20,62,132)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <polygon
                                points='4,60.06 4,29.94 4,27.94 0,27.94 0,62.06 4,62.06 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(212,212,212)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className='border p-6 rounded-lg'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-5'>
                          <input
                            type='radio'
                            name='payment-method'
                            value='VNBANK'
                            checked={selectedPayment === 'VNBANK'}
                            onChange={handlePaymentChange}
                            className='mr-2 size-6'
                          />
                          <label htmlFor='credit_card' className='pr-12'>
                            <h6 className='lg:text-lg text-sm font-semibold'>Domestic Bank Transfer</h6>
                            <p className='lg:text-lg text-sm text-gray-600'>
                              We support payments through major domestic banks: Vietcombank, BIDV, Techcombank,
                              Agribank, ACB, NCB
                            </p>
                          </label>
                        </div>
                        <div>
                          <svg
                            width='800px'
                            height='800px'
                            viewBox='0 -140 780 780'
                            enableBackground='new 0 0 780 500'
                            version='1.1'
                            xmlSpace='preserve'
                            xmlns='http://www.w3.org/2000/svg'
                            className='size-16'
                          >
                            <rect width={780} height={500} fill='#16366F' />
                            <path
                              d='m449.01 250c0 99.143-80.37 179.5-179.51 179.5s-179.5-80.361-179.5-179.5c0-99.133 80.362-179.5 179.5-179.5 99.137 0 179.51 80.37 179.51 179.5'
                              fill='#D9222A'
                            />
                            <path
                              d='m510.49 70.496c-46.38 0-88.643 17.596-120.5 46.466-6.49 5.889-12.548 12.237-18.125 18.996h36.266c4.966 6.037 9.536 12.388 13.685 19.013h-63.635c-3.827 6.121-7.28 12.469-10.341 19.008h84.312c2.893 6.185 5.431 12.53 7.6 19.004h-99.512c-2.091 6.235-3.832 12.581-5.217 19.009h109.94c2.689 12.49 4.044 25.231 4.041 38.008 0 19.934-3.254 39.113-9.254 57.02h-99.512c2.164 6.479 4.7 12.825 7.595 19.01h84.317c-3.064 6.54-6.52 12.889-10.347 19.013h-63.625c4.154 6.629 8.73 12.979 13.685 18.996h36.258c-5.57 6.772-11.63 13.126-18.13 19.012 31.86 28.867 74.118 46.454 120.5 46.454 99.138-1e-3 179.51-80.362 179.51-179.5 0-99.13-80.37-179.5-179.51-179.5'
                              fill='#EE9F2D'
                            />
                            <path d='m666.08 350.06c0-3.201 2.592-5.801 5.796-5.801s5.796 2.6 5.796 5.801c0 3.199-2.592 5.799-5.796 5.799-3.202-1e-3 -5.797-2.598-5.796-5.799zm5.796 4.408c2.435-1e-3 4.407-1.975 4.408-4.408 0-2.433-1.972-4.404-4.404-4.404h-4e-3c-2.429-4e-3 -4.4 1.963-4.404 4.392v0.013c-3e-3 2.432 1.967 4.406 4.399 4.408 1e-3 -1e-3 3e-3 -1e-3 5e-3 -1e-3zm-0.783-1.86h-1.188v-5.094h2.149c0.45 0 0.908 0 1.305 0.254 0.413 0.278 0.646 0.77 0.646 1.278 0 0.57-0.337 1.104-0.883 1.312l0.937 2.25h-1.315l-0.78-2.016h-0.87v2.016h-1e-3zm0-2.89h0.658c0.246 0 0.504 0.02 0.725-0.1 0.196-0.125 0.296-0.359 0.296-0.584 0-0.195-0.12-0.42-0.288-0.516-0.207-0.131-0.536-0.101-0.758-0.101h-0.633v1.301zm-443.5-80.063c-2.045-0.237-2.945-0.301-4.35-0.301-11.045 0-16.637 3.789-16.637 11.268 0 4.611 2.73 7.546 6.987 7.546 7.938 0 13.659-7.56 14-18.513zm14.171 32.996h-16.146l0.371-7.676c-4.925 6.067-11.496 8.95-20.425 8.95-10.562 0-17.804-8.25-17.804-20.229 0-18.024 12.596-28.54 34.217-28.54 2.208 0 5.041 0.2 7.941 0.569 0.605-2.441 0.763-3.486 0.763-4.8 0-4.908-3.396-6.738-12.5-6.738-9.533-0.108-17.396 2.271-20.625 3.334 0.204-1.23 2.7-16.658 2.7-16.658 9.712-2.846 16.117-3.917 23.325-3.917 16.733 0 25.596 7.512 25.58 21.712 0.032 3.805-0.597 8.5-1.58 14.671-1.692 10.731-5.32 33.718-5.817 39.322zm-62.158 0h-19.488l11.163-69.997-24.925 69.997h-13.28l-1.64-69.597-11.734 69.597h-18.242l15.238-91.054h28.02l1.7 50.966 17.092-50.966h31.167l-15.071 91.054m354.98-32.996c-2.037-0.237-2.942-0.301-4.342-0.301-11.041 0-16.634 3.789-16.634 11.268 0 4.611 2.726 7.546 6.983 7.546 7.939 0 13.664-7.56 13.993-18.513zm14.183 32.996h-16.145l0.365-7.676c-4.925 6.067-11.5 8.95-20.42 8.95-10.566 0-17.8-8.25-17.8-20.229 0-18.024 12.587-28.54 34.212-28.54 2.208 0 5.037 0.2 7.934 0.569 0.604-2.441 0.763-3.486 0.763-4.8 0-4.908-3.392-6.738-12.496-6.738-9.533-0.108-17.388 2.271-20.63 3.334 0.205-1.23 2.709-16.658 2.709-16.658 9.713-2.846 16.113-3.917 23.312-3.917 16.741 0 25.604 7.512 25.588 21.712 0.032 3.805-0.597 8.5-1.58 14.671-1.682 10.731-5.32 33.718-5.812 39.322zm-220.39-1.125c-5.334 1.68-9.492 2.399-14 2.399-9.963 0-15.4-5.725-15.4-16.267-0.142-3.27 1.433-11.879 2.67-19.737 1.125-6.917 8.45-50.53 8.45-50.53h19.371l-2.262 11.209h11.7l-2.643 17.796h-11.742c-2.25 14.083-5.454 31.625-5.491 33.95 0 3.817 2.037 5.483 6.67 5.483 2.221 0 3.941-0.226 5.255-0.7l-2.578 16.397m59.391-0.6c-6.654 2.033-13.075 3.017-19.879 3-21.683-0.021-32.987-11.346-32.987-33.032 0-25.313 14.38-43.947 33.9-43.947 15.97 0 26.17 10.433 26.17 26.796 0 5.429-0.7 10.729-2.387 18.212h-38.575c-1.304 10.742 5.57 15.217 16.837 15.217 6.935 0 13.188-1.43 20.142-4.663l-3.221 18.417zm-10.887-43.9c0.107-1.543 2.054-13.217-9.013-13.217-6.171 0-10.583 4.704-12.38 13.217h21.393zm-123.42-5.017c0 9.367 4.541 15.825 14.841 20.676 7.892 3.709 9.113 4.809 9.113 8.17 0 4.617-3.48 6.7-11.192 6.7-5.812 0-11.22-0.907-17.458-2.92 0 0-2.563 16.32-2.68 17.101 4.43 0.966 8.38 1.861 20.28 2.19 20.562 0 30.058-7.829 30.058-24.75 0-10.175-3.975-16.146-13.737-20.633-8.171-3.75-9.109-4.588-9.109-8.046 0-4.004 3.238-6.046 9.538-6.046 3.825 0 9.05 0.408 14 1.113l2.775-17.175c-5.046-0.8-12.696-1.442-17.15-1.442-21.8 0-29.346 11.387-29.279 25.062m229.09-23.116c5.413 0 10.459 1.42 17.413 4.92l3.187-19.762c-2.854-1.12-12.904-7.7-21.416-7.7-13.042 0-24.066 6.47-31.82 17.15-11.31-3.746-15.959 3.825-21.659 11.367l-5.062 1.179c0.383-2.483 0.73-4.95 0.613-7.446h-17.896c-2.445 22.917-6.779 46.13-10.171 69.075l-0.884 4.976h19.496c3.254-21.143 5.038-34.681 6.121-43.842l7.342-4.084c1.096-4.08 4.529-5.458 11.416-5.292-0.926 5.008-1.389 10.09-1.383 15.184 0 24.225 13.071 39.308 34.05 39.308 5.404 0 10.042-0.712 17.221-2.657l3.431-20.76c-6.46 3.18-11.761 4.676-16.561 4.676-11.328 0-18.183-8.362-18.183-22.184-1e-3 -20.05 10.195-34.108 24.745-34.108' />
                            <path
                              d='m185.21 297.24h-19.491l11.17-69.988-24.925 69.988h-13.282l-1.642-69.588-11.733 69.588h-18.243l15.238-91.042h28.02l0.788 56.362 18.904-56.362h30.267l-15.071 91.042'
                              fill='#ffffff'
                            />
                            <path d='m647.52 211.6l-4.319 26.308c-5.33-7.012-11.054-12.087-18.612-12.087-9.834 0-18.784 7.454-24.642 18.425-8.158-1.692-16.597-4.563-16.597-4.563l-4e-3 0.067c0.658-6.133 0.92-9.875 0.862-11.146h-17.9c-2.437 22.917-6.77 46.13-10.157 69.075l-0.893 4.976h19.492c2.633-17.097 4.65-31.293 6.133-42.551 6.659-6.017 9.992-11.267 16.721-10.917-2.979 7.206-4.725 15.504-4.725 24.017 0 18.513 9.367 30.725 23.534 30.725 7.141 0 12.62-2.462 17.966-8.17l-0.912 6.884h18.433l14.842-91.043h-19.222zm-24.37 73.942c-6.634 0-9.983-4.909-9.983-14.597 0-14.553 6.271-24.875 15.112-24.875 6.695 0 10.32 5.104 10.32 14.508 1e-3 14.681-6.369 24.964-15.449 24.964z' />
                            <path
                              d='m233.19 264.26c-2.042-0.236-2.946-0.3-4.346-0.3-11.046 0-16.634 3.788-16.634 11.267 0 4.604 2.73 7.547 6.98 7.547 7.945-1e-3 13.666-7.559 14-18.514zm14.179 32.984h-16.146l0.367-7.663c-4.921 6.054-11.5 8.95-20.421 8.95-10.567 0-17.804-8.25-17.804-20.229 0-18.032 12.591-28.542 34.216-28.542 2.209 0 5.042 0.2 7.938 0.571 0.604-2.442 0.762-3.487 0.762-4.808 0-4.908-3.391-6.73-12.496-6.73-9.537-0.108-17.395 2.272-20.629 3.322 0.204-1.226 2.7-16.638 2.7-16.638 9.709-2.858 16.121-3.93 23.321-3.93 16.738 0 25.604 7.518 25.588 21.705 0.029 3.82-0.605 8.512-1.584 14.675-1.687 10.725-5.32 33.725-5.812 39.317zm261.38-88.592l-3.192 19.767c-6.95-3.496-12-4.921-17.407-4.921-14.551 0-24.75 14.058-24.75 34.107 0 13.821 6.857 22.181 18.183 22.181 4.8 0 10.096-1.492 16.554-4.677l-3.42 20.75c-7.184 1.959-11.816 2.672-17.226 2.672-20.976 0-34.05-15.084-34.05-39.309 0-32.55 18.059-55.3 43.888-55.3 8.507 1e-3 18.562 3.609 21.42 4.73m31.442 55.608c-2.041-0.236-2.941-0.3-4.346-0.3-11.042 0-16.634 3.788-16.634 11.267 0 4.604 2.729 7.547 6.984 7.547 7.937-1e-3 13.662-7.559 13.996-18.514zm14.179 32.984h-16.15l0.37-7.663c-4.924 6.054-11.5 8.95-20.42 8.95-10.563 0-17.804-8.25-17.804-20.229 0-18.032 12.595-28.542 34.212-28.542 2.213 0 5.042 0.2 7.941 0.571 0.601-2.442 0.763-3.487 0.763-4.808 0-4.908-3.392-6.73-12.496-6.73-9.533-0.108-17.396 2.272-20.629 3.322 0.204-1.226 2.704-16.638 2.704-16.638 9.709-2.858 16.116-3.93 23.316-3.93 16.742 0 25.604 7.518 25.583 21.705 0.034 3.82-0.595 8.512-1.579 14.675-1.682 10.725-5.324 33.725-5.811 39.317zm-220.39-1.122c-5.338 1.68-9.496 2.409-14 2.409-9.963 0-15.4-5.726-15.4-16.266-0.138-3.281 1.437-11.881 2.675-19.738 1.12-6.926 8.446-50.533 8.446-50.533h19.367l-2.259 11.212h9.942l-2.646 17.788h-9.975c-2.25 14.091-5.463 31.619-5.496 33.949 0 3.83 2.042 5.483 6.671 5.483 2.22 0 3.938-0.217 5.254-0.692l-2.579 16.388m59.392-0.591c-6.65 2.033-13.08 3.013-19.88 3-21.684-0.021-32.987-11.346-32.987-33.033 0-25.321 14.38-43.95 33.9-43.95 15.97 0 26.17 10.429 26.17 26.8 0 5.433-0.7 10.733-2.382 18.212h-38.575c-1.306 10.741 5.569 15.221 16.837 15.221 6.93 0 13.188-1.434 20.137-4.676l-3.22 18.426zm-10.892-43.912c0.117-1.538 2.059-13.217-9.013-13.217-6.166 0-10.579 4.717-12.375 13.217h21.388zm-123.42-5.004c0 9.365 4.542 15.816 14.842 20.675 7.891 3.708 9.112 4.812 9.112 8.17 0 4.617-3.483 6.7-11.187 6.7-5.817 0-11.225-0.908-17.467-2.92 0 0-2.554 16.32-2.67 17.1 4.42 0.967 8.374 1.85 20.274 2.191 20.567 0 30.059-7.829 30.059-24.746 0-10.18-3.971-16.15-13.738-20.637-8.167-3.758-9.112-4.583-9.112-8.046 0-4 3.245-6.058 9.541-6.058 3.821 0 9.046 0.42 14.004 1.125l2.771-17.18c-5.041-0.8-12.691-1.441-17.146-1.441-21.804 0-29.345 11.379-29.283 25.067m398.45 50.629h-18.437l0.917-6.893c-5.347 5.717-10.825 8.18-17.967 8.18-14.168 0-23.53-12.213-23.53-30.725 0-24.63 14.521-45.393 31.709-45.393 7.558 0 13.28 3.088 18.604 10.096l4.325-26.308h19.221l-14.842 91.043zm-28.745-17.109c9.075 0 15.45-10.283 15.45-24.953 0-9.405-3.63-14.509-10.325-14.509-8.838 0-15.116 10.317-15.116 24.875-1e-3 9.686 3.357 14.587 9.991 14.587zm-56.843-56.929c-2.439 22.917-6.773 46.13-10.162 69.063l-0.891 4.975h19.491c6.971-45.275 8.658-54.117 19.588-53.009 1.742-9.266 4.982-17.383 7.399-21.479-8.163-1.7-12.721 2.913-18.688 11.675 0.471-3.787 1.334-7.466 1.163-11.225h-17.9m-160.42 0c-2.446 22.917-6.78 46.13-10.167 69.063l-0.887 4.975h19.5c6.962-45.275 8.646-54.117 19.569-53.009 1.75-9.266 4.992-17.383 7.4-21.479-8.154-1.7-12.716 2.913-18.678 11.675 0.47-3.787 1.325-7.466 1.162-11.225h-17.899m254.57 68.242c0-3.214 2.596-5.8 5.796-5.8 3.197-3e-3 5.792 2.587 5.795 5.785v0.015c-1e-3 3.2-2.595 5.794-5.795 5.796-3.2-2e-3 -5.794-2.596-5.796-5.796zm5.796 4.404c2.432 1e-3 4.403-1.97 4.403-4.401v-2e-3c3e-3 -2.433-1.968-4.406-4.399-4.408h-4e-3c-2.435 1e-3 -4.408 1.974-4.409 4.408 3e-3 2.432 1.976 4.403 4.409 4.403zm-0.784-1.87h-1.188v-5.084h2.154c0.446 0 0.908 8e-3 1.296 0.254 0.416 0.283 0.654 0.767 0.654 1.274 0 0.575-0.338 1.113-0.888 1.317l0.941 2.236h-1.319l-0.78-2.008h-0.87v2.008 3e-3zm0-2.88h0.654c0.245 0 0.513 0.018 0.729-0.1 0.195-0.125 0.295-0.361 0.295-0.587-9e-3 -0.21-0.115-0.404-0.287-0.524-0.204-0.117-0.542-0.085-0.763-0.085h-0.629v1.296h1e-3z'
                              fill='#ffffff'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className='border p-6 rounded-lg'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-5'>
                          <input
                            type='radio'
                            value='VnMart'
                            checked={selectedPayment === 'VnMart'}
                            onChange={handlePaymentChange}
                            className='mr-2  size-6'
                          />
                          <label>
                            <h6 className='lg:text-lg text-sm font-semibold'>VNPAY QR Payment</h6>
                            <p className='lg:text-lg text-sm text-gray-600'>
                              We support payments through VNPAY QR, allowing you to make quick and secure transactions
                              using your mobile device.
                            </p>
                          </label>
                        </div>
                        <div className='pl-32'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                            version='1.1'
                            className='size-16'
                            viewBox='0 0 256 256'
                            xmlSpace='preserve'
                          >
                            <defs></defs>
                            <g
                              style={{
                                stroke: 'none',
                                strokeWidth: 0,
                                strokeDasharray: 'none',
                                strokeLinecap: 'butt',
                                strokeLinejoin: 'miter',
                                strokeMiterlimit: 10,
                                fill: 'none',
                                fillRule: 'nonzero',
                                opacity: 1
                              }}
                              transform='translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)'
                            >
                              <rect
                                x={0}
                                y={0}
                                rx={0}
                                ry={0}
                                width={90}
                                height={90}
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(41,204,87)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='46.39,81.91 38.47,81.91 38.47,78.91 43.39,78.91 43.39,73.69 36.61,73.69 36.61,58.03 39.61,58.03 39.61,70.69 46.39,70.69 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='8.09'
                                y='36.47'
                                rx={0}
                                ry={0}
                                width={3}
                                height='15.41'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='9.59'
                                y='42.68'
                                rx={0}
                                ry={0}
                                width='14.85'
                                height={3}
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='31.95,53.84 18.3,53.84 18.3,50.84 28.95,50.84 28.95,42.68 38.98,42.68 38.98,45.68 31.95,45.68 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='52.59,66.39 45.03,66.39 45.03,44.53 48.03,44.53 48.03,63.39 52.59,63.39 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='25.95'
                                y='36.47'
                                rx={0}
                                ry={0}
                                width={3}
                                height='3.03'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='36.51'
                                y='50.83'
                                rx={0}
                                ry={0}
                                width={3}
                                height='3.03'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='15.88'
                                y='36.47'
                                rx={0}
                                ry={0}
                                width={3}
                                height='3.03'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='52.97,20.37 49.97,20.37 49.97,11.09 40.68,11.09 40.68,8.09 52.97,8.09 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='45.52,32.65 38.47,32.65 38.47,29.64 42.52,29.64 42.52,18.48 36.47,18.48 36.47,15.48 45.52,15.48 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='36.51'
                                y='22.04'
                                rx={0}
                                ry={0}
                                width={3}
                                height='3.03'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='81.91,81.91 65.24,81.91 65.24,78.91 78.91,78.91 78.91,66.73 70.16,66.73 70.16,63.73 81.91,63.73 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='70.2'
                                y='71.79'
                                rx={0}
                                ry={0}
                                width={3}
                                height='3.03'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='60.2,47.91 54.15,47.91 54.15,44.91 57.2,44.91 57.2,39.49 36.01,39.49 36.01,36.49 60.2,36.49 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='57.2'
                                y='52.48'
                                rx={0}
                                ry={0}
                                width={3}
                                height='14.15'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='58.7'
                                y='58.09'
                                rx={0}
                                ry={0}
                                width='7.9'
                                height={3}
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='78.91'
                                y='36.47'
                                rx={0}
                                ry={0}
                                width={3}
                                height='9.63'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='81.91,60.23 78.91,60.23 78.91,52.33 65.04,52.33 65.04,49.33 81.91,49.33 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='74.11,50.83 71.11,50.83 71.11,39.62 65.04,39.62 65.04,36.62 74.11,36.62 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='50.65'
                                y='71.8'
                                rx={0}
                                ry={0}
                                width='13.82'
                                height={3}
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='56.06'
                                y='73.3'
                                rx={0}
                                ry={0}
                                width={3}
                                height='8.12'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='71.02'
                                y='56.14'
                                rx={0}
                                ry={0}
                                width={3}
                                height='3.03'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='49.97'
                                y='25.33'
                                rx={0}
                                ry={0}
                                width={3}
                                height='5.81'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <rect
                                x='46.53'
                                y='52.98'
                                rx={0}
                                ry={0}
                                width='4.65'
                                height={3}
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <path
                                d='M 32.576 32.645 H 8.093 V 8.093 h 24.482 V 32.645 z M 11.093 29.645 h 18.482 V 11.093 H 11.093 V 29.645 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <rect
                                x='18.69'
                                y='18.72'
                                rx={0}
                                ry={0}
                                width='3.28'
                                height='3.29'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <path
                                d='M 32.576 81.907 H 8.093 V 57.354 h 24.482 V 81.907 z M 11.093 78.907 h 18.482 V 60.354 H 11.093 V 78.907 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <rect
                                x='18.69'
                                y='67.98'
                                rx={0}
                                ry={0}
                                width='3.28'
                                height='3.29'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <path
                                d='M 81.907 32.645 H 57.424 V 8.093 h 24.483 V 32.645 z M 60.424 29.645 h 18.483 V 11.093 H 60.424 V 29.645 z'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                                strokeLinecap='round'
                              />
                              <rect
                                x='68.02'
                                y='18.72'
                                rx={0}
                                ry={0}
                                width='3.28'
                                height='3.29'
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform=' matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='3,31.14 0,31.14 0,0 31.14,0 31.14,3 3,3 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='90,31.14 87,31.14 87,3 58.85,3 58.85,0 90,0 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='31.14,90 0,90 0,58.85 3,58.85 3,87 31.14,87 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                              <polygon
                                points='90,90 58.85,90 58.85,87 87,87 87,58.85 90,58.85 '
                                style={{
                                  stroke: 'none',
                                  strokeWidth: 1,
                                  strokeDasharray: 'none',
                                  strokeLinecap: 'butt',
                                  strokeLinejoin: 'miter',
                                  strokeMiterlimit: 10,
                                  fill: 'rgb(0,0,0)',
                                  fillRule: 'nonzero',
                                  opacity: 1
                                }}
                                transform='  matrix(1 0 0 1 0 0) '
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='lg:flex hidden items-center justify-center'>
                    <img
                      src='https://modernize-nextjs-dark.vercel.app/_next/static/media/payment.85b5b5db.svg'
                      alt='payment'
                      className='h-64 w-64'
                    />
                  </div>
                </div>
              </div>

              <div className='lg:border lg:border-gray-200 lg:px-10 lg:py-5 mt-10 rounded-xl'>
                <div className='lg:text-2xl text-xl font-semibold'>Order Summary</div>
                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className=''>Sub Total</div>
                  <div className=''>
                    {(cart?.totalAmount ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>

                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className=''>Discount</div>
                  <div className=''>
                    {' '}
                    {(subTotal - promotionTotal).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>

                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className=''>Shipping</div>
                  <div className=''>Free</div>
                </div>

                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className='font-medium'>Total</div>
                  <div className=''>
                    {(cart?.totalAmount ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>
              </div>

              <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between mt-8'>
                <Link
                  to={-1}
                  className='w-full text-center lg:w-auto px-6 py-3 bg-gray-300 hover:bg-gray-400 text-white rounded-lg cursor-pointer'
                >
                  Back
                </Link>
                <Link
                  to={payment.paymentUrl}
                  className='w-full lg:w-auto px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-center cursor-pointer'
                >
                  Complete an order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
