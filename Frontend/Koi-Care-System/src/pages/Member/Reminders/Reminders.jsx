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
import { FaSpinner } from 'react-icons/fa'

function Reminders() {
  const { isDarkMode } = useDarkMode()
  const [reminder, setReminder] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [dateTime, setDateTime] = useState('')
  const [title, setTitle] = useState('')
  const [interval, setInterval] = useState('')
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentLog, setCurrentLog] = useState(null)
  const [reminderId, setReminderId] = useState(null)

  const openEditForm = (reminder) => {
    setTitle(reminder.title)
    setDateTime(reminder.dateTime)
    setInterval(reminder.interval)
    localStorage.setItem('reminderId', reminder.id)
    setReminderId(reminder.id)
    toggleEditFormVisibility(true)
  }

  const toggleCloseForm = () => {
    setIsEditFormVisible(false)
    setTitle('')
    setDateTime('')
    setInterval('')
    setReminderId(null)
    setCurrentLog(null)
  }

  const toggleEditFormVisibility = (reminders) => {
    if (reminders) {
      setCurrentLog(reminders)
      setIsEditFormVisible(true)
      setIsAddFormVisible(false)
    }
  }

  const getReminder = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get('http://146.190.84.154:8080/api/reminders/list', {
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

  const createReminder = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://146.190.84.154:8080/api/reminders/create',
        {
          title: title,
          dateTime: dateTime,
          repeatInterval: interval
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(interval)
      getReminder()
      setIsAddFormVisible(false)
    } catch (err) {
      console.log(interval)
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateReminder = async () => {
    setIsLoading(true)
    if (!reminderId) return
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('reminderId')
      await axios.put(
        `http://146.190.84.154:8080/api/reminders/update/${id}`,
        {
          title: title,
          dateTime: dateTime,
          repeatInterval: interval
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      getReminder()
      toggleCloseForm()
    } catch (err) {
      console.log(interval)
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteReminder = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('not found token')
      }
      const id = localStorage.getItem('reminderId')

      await axios.delete(`http://146.190.84.154:8080/api/reminders/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      getReminder()
      toggleCloseForm()
    } catch (error) {
      console.log('err', error)
    } finally {
      setIsLoading(false)
    }
  }

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
                  setIsAddFormVisible(true)
                }}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>

              {reminder.map((reminders) => (
                <div
                  onClick={() => openEditForm(reminders)}
                  key={reminders.id}
                  className='border border-gray-200 rounded-3xl shadow-xl px-8 py-6 flex justify-between items-center'
                >
                  <div className='flex flex-col gap-4'>
                    <div className='text-3xl'>{reminders.title}</div>
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

                      <div className='text-2xl'></div>
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
                      <div className='text-2xl items-center'>{reminders.dateTime}</div>
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
                      <div className='text-2xl'>{reminders.repeatInterval}</div>
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
              ))}
            </div>

            {isAddFormVisible && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                <div
                  className={` ${
                    isDarkMode ? 'bg-custom-dark' : 'bg-white'
                  }  lg:min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
                >
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={() => {
                        setIsAddFormVisible(false)
                      }}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button onClick={() => createReminder()}>
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
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='relative'>
                      <label
                        className={`absolute lg:text-lg text-sm -top-[12px] left-3 text-red-500 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } font-semibold`}
                      >
                        Title:
                      </label>
                      <input
                        type='text'
                        placeholder='Enter title'
                        className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className='relative col-span-1'>
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
                        onChange={(e) => setDateTime(e.target.value)}
                      />
                    </div>

                    <div className='relative col-span-1'>
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
                        onChange={(e) => setInterval(e.target.value)}
                      >
                        <option value='Select'>Select</option>
                        <option value='ONE_TIME'>ONE_TIME</option>
                        <option value='DAILY'>DAILY</option>
                        <option value='WEEKLY'>WEEKLY</option>
                      </select>
                      <input />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEditFormVisible && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                <div
                  className={` ${
                    isDarkMode ? 'bg-custom-dark' : 'bg-white'
                  }  lg:min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
                >
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={() => {
                        toggleCloseForm()
                      }}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button onClick={() => updateReminder()}>
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
                  <h3 className='mb-5 text-xl lg:text-2xl font-bold'>Update Reminder</h3>
                  <div className='grid grid-cols-2 gap-6'>
                    <div className='relative'>
                      <label
                        className={`absolute lg:text-lg text-sm -top-[12px] left-3 text-red-500 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } font-semibold`}
                      >
                        Title:
                      </label>
                      <input
                        type='text'
                        placeholder='Enter title'
                        className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className='relative col-span-1'>
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
                        onChange={(e) => setDateTime(e.target.value)}
                      />
                    </div>

                    <div className='relative col-span-1'>
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
                        onChange={(e) => setInterval(e.target.value)}
                      >
                        <option value='ONE_TIME'>ONE_TIME</option>
                        <option value='DAILY'>DAILY</option>
                        <option value='WEEKLY'>WEEKLY</option>
                      </select>
                      <input />
                    </div>
                  </div>
                  <div className='w-full flex flex-col justify-center'>
                    <button
                      className='mx-auto'
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this pond log?')) {
                          deleteReminder()
                        }
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='lg:size-12 size-8 mx-auto lg:p-2 p-1 rounded-full bg-red-500 text-white cursor-pointer mt-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
                        />
                      </svg>
                    </button>

                    <p className='text-center font-semibold'>Delete this log</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className='fixed inset-0 px-4 py-2 flex items-center justify-center z-50'>
                <FaSpinner className='animate-spin text-green-500 text-6xl' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reminders
