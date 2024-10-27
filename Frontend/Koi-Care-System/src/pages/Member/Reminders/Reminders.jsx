import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import '../../../index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Switch } from '@mui/material'
import { useForm } from 'react-hook-form'

function Reminders() {
  const { isDarkMode } = useDarkMode()
  const [reminder, setReminder] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    // if (currentPond) {
    //   upDatePond(data, currentPond.id)
    // } else {
    //   upDatePond(data)
    // }
  }

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
    reset()
  }

  const getReminder = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get('http://68.183.232.120:8080/api/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setReminder(res.data.data)
      console.log(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getReminder()
  }, [])

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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px] max-h-[800px]'>
            <TopLayout text='Reminders' links='/member/reminders' />
            <div className='grid grid-cols-3 gap-32 mt-10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='fixed bottom-5 right-5 text-lg text-white outline-none rounded-full bg-custom-left-bar shadow-lg size-8 lg:size-14 cursor-pointer'
                onClick={() => {
                  toggleAddFormVisibility()
                }}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
              <div className='border border-gray-200 rounded-3xl shadow-xl px-8 py-6 flex justify-between items-center'>
                <div className='flex flex-col gap-4'>
                  <div className='text-3xl'>abcd</div>
                  <div className='flex gap-8'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-7'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z'
                      />
                    </svg>

                    <div className='text-2xl'>15.10.2024 01:05</div>
                  </div>
                  <div className='flex gap-8 items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-7'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>
                    <div className='text-2xl items-center'>01:05</div>
                  </div>
                  <div className='flex gap-5 items-center'>
                    <div className='size-10'>
                      <svg xmlns='http://www.w3.org/2000/svg' className='ionicon s-ion-icon' viewBox='0 0 512 512'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M320 120l48 48-48 48'
                          className='ionicon-fill-none ionicon-stroke-width'
                        />
                        <path
                          d='M352 168H144a80.24 80.24 0 00-80 80v16M192 392l-48-48 48-48'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='ionicon-fill-none ionicon-stroke-width'
                        />
                        <path
                          d='M160 344h208a80.24 80.24 0 0080-80v-16'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='ionicon-fill-none ionicon-stroke-width'
                        />
                      </svg>
                    </div>
                    <div className='text-2xl'>one-time</div>
                  </div>
                </div>
                <FormControlLabel
                  value='end'
                  control={<Switch color='primary' />}
                  sx={{
                    fontSize: '2rem',
                    '.MuiSwitch-root': {
                      transform: 'scale(1.75)'
                    },
                    '.MuiFormControlLabel-label': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>

              <div className='border border-gray-200 rounded-3xl shadow-xl px-8 py-6 flex justify-between items-center'>
                <div className='flex flex-col gap-4'>
                  <div className='text-3xl'>abcd</div>
                  <div className='flex gap-8'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-7'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z'
                      />
                    </svg>

                    <div className='text-2xl'>15.10.2024 01:05</div>
                  </div>
                  <div className='flex gap-8 items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-7'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>
                    <div className='text-2xl items-center'>01:05</div>
                  </div>
                  <div className='flex gap-5 items-center'>
                    <div className='size-10'>
                      <svg xmlns='http://www.w3.org/2000/svg' className='ionicon s-ion-icon' viewBox='0 0 512 512'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M320 120l48 48-48 48'
                          className='ionicon-fill-none ionicon-stroke-width'
                        />
                        <path
                          d='M352 168H144a80.24 80.24 0 00-80 80v16M192 392l-48-48 48-48'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='ionicon-fill-none ionicon-stroke-width'
                        />
                        <path
                          d='M160 344h208a80.24 80.24 0 0080-80v-16'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='ionicon-fill-none ionicon-stroke-width'
                        />
                      </svg>
                    </div>
                    <div className='text-2xl'>one-time</div>
                  </div>
                </div>
                <FormControlLabel
                  value='end'
                  control={<Switch color='primary' />}
                  sx={{
                    fontSize: '2rem',
                    '.MuiSwitch-root': {
                      transform: 'scale(1.75)'
                    },
                    '.MuiFormControlLabel-label': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>
            </div>

            {isAddFormVisible && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                <div
                  className={` ${
                    isDarkMode ? 'bg-custom-dark' : 'bg-white'
                  }  lg:min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
                >
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className='flex justify-between mb-5'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        onClick={() => {
                          reset()
                          // toggleAddFormVisibility()
                        }}
                        className='size-10 text-red-500 cursor-pointer'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>

                      <button type='submit'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-10 text-green-500 cursor-pointer'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                          />
                        </svg>
                      </button>
                    </div>
                    <h3 className='mb-5 text-xl lg:text-2xl font-bold'>Add Reminder</h3>
                    <div className='grid grid-cols-2 grid-rows-2 gap-6'>
                      <div className='relative col-span-2'>
                        <label
                          className={`absolute lg:text-lg text-sm -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Title:
                        </label>
                        <input
                          type='number'
                          placeholder='Enter title'
                          className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.title.message}</p>
                        )}
                      </div>

                      <div className='lg:mb-4 relative col-span-1'>
                        <label
                          className={`absolute lg:text-lg text-sm -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Date & Time:
                        </label>
                        <input
                          type='datetime-local'
                          placeholder='Enter depth in meters'
                          className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('datetime', { required: 'Date & Time is required' })}
                        />
                        {errors.datetime && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.datetime.message}</p>
                        )}
                      </div>

                      <div className='lg:mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className={`absolute -top-[12px] lg:text-lg text-sm left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Interval
                        </label>
                        <select
                          className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('interval', { required: 'Interval is required' })}
                        >
                          <option value='onetime'>onetime</option>
                          <option value='daily'>daily</option>
                          <option value='weekly'>weekly</option>
                        </select>
                        <input />
                        {errors.interval && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.interval.message}</p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reminders
