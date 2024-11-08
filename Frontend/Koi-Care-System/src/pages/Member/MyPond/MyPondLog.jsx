/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { FaSpinner } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function MyPondLog() {
  const { isDarkMode } = useDarkMode()
  const [log, setLog] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ponds, setPonds] = useState([])
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
    reset({
      logTitle: '',
      logDate: '',
      category: log.category,
      note: '',
      koiPondId: ''
    })
  }

  const openEditForm = (log) => {
    localStorage.setItem('logId', log.logId)
    reset({
      logTitle: log.logTitle,
      logDate: log.dateTime,
      category: log.category,
      note: log.note,
      koiPondId: log.koiPondName
    })
    setIsEditFormVisible(true)
  }

  const toggleCloseForm = () => {
    setIsEditFormVisible(false)
  }

  const pondLog = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        console.log('not found token')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/log/user/${userId}/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(res.data.data)
      setLog(res.data.data)
    } catch (error) {
      console.log('err', error)
    }
  }

  const deleteLog = async () => {
    setIsLoading(true)
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (!isConfirmed) {
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('not found token')
      }
      const logId = localStorage.getItem('logId')

      await axios.delete(`https://koicaresystemv2.azurewebsites.net/api/log/delete/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Delete Pond Log Fail')
      pondLog()
      toggleCloseForm()
    } catch (error) {
      toast.error('Delete Pond Log Fail')
      console.log('err', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setPonds(res.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - Token expired or invalid. Logging out...')
          localStorage.removeItem('token')
          localStorage.removeItem('id')
          toast.error('Token expired navigate to login')
          navigate('/login')
        } else {
          console.error('Error fetching ponds:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  const createLog = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')

      await axios.post(
        'https://koicaresystemv2.azurewebsites.net/api/log/create',
        {
          logTitle: data.logTitle,
          logDate: data.dateTime,
          category: data.category,
          note: data.note,
          koiPondId: data.koiPondName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(data.koiPondName)
      toast.success('Create Pond Log Successfully')
      pondLog()
      toggleAddFormVisibility(false)
      reset()
    } catch (error) {
      toast.error('Create Pond Log Fail')
      console.log(data.category)
    } finally {
      setIsLoading(false)
    }
  }

  const updateLog = async (data) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const logId = localStorage.getItem('logId')
      await axios.put(
        `https://koicaresystemv2.azurewebsites.net/api/log/update/${logId}`,
        {
          logTitle: data.logTitle,
          logDate: data.dateTime,
          category: data.category,
          note: data.note,
          koiPondId: data.koiPondName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success('Update Pond Log Successfully')
      reset()
      pondLog()
      toggleCloseForm()
    } catch (error) {
      toast.error('Update Pond Log Fail')
      console.log(data.dateTime)
      console.log(error)
      console.error(data.koiPondName)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPond()
  }, [])

  useEffect(() => {
    pondLog()
  }, [])

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }

    return new Date(dateString).toLocaleDateString(undefined, options)
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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <TopLayout text='My Pond' textName='My Pond Log' links='member/myPond' />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
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

              {log.map((logs) => (
                <div
                  key={logs.logId}
                  onClick={() => openEditForm(logs)}
                  className='border border-gray-50 shadow-lg rounded-xl px-10 py-5'
                >
                  <div className='flex flex-col gap-1 lg:flex-row lg:justify-between'>
                    <div className='text-2xl font-semibold'>{logs.logTitle}</div>
                    <div className='py-1 px-2 bg-blue-400 text-white rounded-lg'>{logs.category}</div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex-none w-[500px]'>
                      <div className='lg:mt-5 mt-2 text-lg'>{logs.koiPondName}</div>
                      <div className='lg:mt-3 mt-1 text-red-500'>{formatDate(logs.logDate)}</div>
                      <div className='lg:mt-3 mt-1'>{logs.note}</div>
                    </div>
                  </div>
                </div>
              ))}

              {isAddFormVisible && (
                <form
                  onSubmit={handleSubmit(createLog)}
                  className='fixed inset-0 bg-black h-screen flex justify-center items-end bg-opacity-50 z-40'
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: -100 },
                      visible: { opacity: 1, y: 100, transition: { delay: 2000 } }
                    }}
                    className={` ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    }  lg:min-w-[80vh] m-auto p-6 lg:rounded-lg`}
                  >
                    <div className='flex justify-between mb-5'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        onClick={() => {
                          toggleAddFormVisibility()
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
                    <h3 className='mb-5 lg:text-2xl text-lg font-bold'>Add a Log</h3>
                    <div className='grid grid-cols-2 lg:grid-rows-2 gap-4'>
                      <div className='relative lg:mb-4 col-span-1'>
                        <label
                          htmlFor='name'
                          className={`absolute block -top-[12px] ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                        >
                          Title:
                        </label>
                        <input
                          type='text'
                          id='name'
                          placeholder='Enter title'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black lg:text-lg text-sm rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('logTitle', { required: 'Title is required' })}
                        />
                        {errors.logTitle && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.logTitle.message}</p>
                        )}
                      </div>

                      <div className='relative lg:mb-4 col-span-1'>
                        <label
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold lg:text-lg text-sm`}
                        >
                          Date & time:
                        </label>
                        <input
                          type='datetime-local'
                          min={new Date().toISOString().slice(0, 16)}
                          placeholder='Enter date & time'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg lg:text-lg text-sm focus:outline-none transition-colors duration-200`}
                          {...register('dateTime', { required: 'Date Time is required' })}
                        />
                        {errors.dateTime && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.dateTime.message}</p>
                        )}
                      </div>

                      <div className='lg:mb-4 relative col-span-1'>
                        <label
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold lg:text-lg text-sm`}
                        >
                          Category:
                        </label>
                        <select
                          id='pondId'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg lg:text-lg text-sm focus:outline-none transition-colors duration-200`}
                          {...register('category', { required: 'Category is required' })}
                        >
                          <option value='WATER_CHANGE'>Water Change</option>
                          <option value='KOI_TREATMENT'>Koi Treatment</option>
                          <option value='WATER_TREATMENT'>Water Treatment</option>
                          <option value='POPULATION_CHANGE'>Population Change</option>
                          <option value='EXPERIENCE'>Experience</option>
                          <option value='POND_MODIFICATION'>Pond Modification</option>
                          <option value='OTHER'>Other</option>
                        </select>
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold lg:text-lg text-sm`}
                        >
                          Pond:
                        </label>
                        <select
                          id='pondId'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg lg:text-lg text-sm focus:outline-none transition-colors duration-200`}
                          {...register('koiPondName', { required: 'Pond is required' })}
                        >
                          {ponds.map((pond) => (
                            <option key={pond.id} value={pond.id}>
                              {pond.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='relative w-full'>
                      <label
                        className={`absolute -top-[12px] left-3 text-red-500 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } font-semibold lg:text-lg text-sm`}
                      >
                        Note:
                      </label>
                      <textarea
                        type='text'
                        placeholder='Note'
                        className={`w-full lg:h-32 h-24 p-3 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                        {...register('note', { required: 'Note is required' })}
                      />
                      {errors.note && <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.note.message}</p>}
                    </div>
                  </motion.div>
                </form>
              )}

              {isEditFormVisible && (
                <form
                  onSubmit={handleSubmit(updateLog)}
                  className='fixed inset-0 bg-black h-screen flex justify-center items-end bg-opacity-50 z-40'
                >
                  <div
                    className={`${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    }  lg:min-w-[80vh] my-auto p-6 rounded-lg shadow-lg`}
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
                    <h3 className='mb-5 lg:text-2xl text-xl font-bold'>Update a Log</h3>
                    <div className='grid grid-cols-2 lg:grid-rows-2 gap-4'>
                      <div className='lg:mb-4 relative col-span-1'>
                        <label
                          htmlFor='name'
                          className={`absolute block -top-[12px] ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } left-3 text-red-500 font-semibold lg:text-lg text-sm`}
                        >
                          Title:
                        </label>
                        <input
                          type='text'
                          placeholder='Enter title'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('logTitle', { required: 'Title is required' })}
                        />
                        {errors.logTitle && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.logTitle.message}</p>
                        )}
                      </div>

                      <div className='lg:mb-4 relative col-span-1'>
                        <label
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold lg:text-lg text-sm`}
                        >
                          Date & time:
                        </label>
                        <input
                          type='datetime-local'
                          min={new Date().toISOString().slice(0, 16)}
                          placeholder='Enter Date Time'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('dateTime', { required: 'Date Time is required' })}
                        />
                        {errors.dateTime && (
                          <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.dateTime.message}</p>
                        )}
                      </div>

                      <div className='relative col-span-1'>
                        <label
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold lg:text-lg text-sm`}
                        >
                          Category:
                        </label>
                        <select
                          id='pondId'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('category', { required: 'Category is required' })}
                        >
                          <option value='WATER_CHANGE'>Water Change</option>
                          <option value='KOI_TREATMENT'>Koi Treatment</option>
                          <option value='WATER_TREATMENT'>Water Treatment</option>
                          <option value='POPULATION_CHANGE'>Population Change</option>
                          <option value='EXPERIENCE'>Experience</option>
                          <option value='POND_MODIFICATION'>Pond Modification</option>
                          <option value='OTHER'>Other</option>
                        </select>
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold lg:text-lg text-sm`}
                        >
                          Pond:
                        </label>
                        <select
                          id='pondId'
                          className={`w-full lg:p-3 px-2 py-1 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('koiPondName', { required: 'Pond is required' })}
                        >
                          {ponds.map((pond) => (
                            <option key={pond.id} value={pond.id}>
                              {pond.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='lg:mt-4 relative w-full'>
                      <label
                        className={`absolute -top-[12px] left-3 text-red-500 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } font-semibold lg:text-lg text-sm`}
                      >
                        Note:
                      </label>
                      <textarea
                        type='text'
                        placeholder='Note'
                        className={`w-full lg:h-32 h-24 p-3 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                        {...register('note', { required: 'Note is required' })}
                      />
                      {errors.note && <p className='text-red-500 absolute lg:text-lg text-sm'>{errors.note.message}</p>}
                    </div>

                    <div className='w-full flex flex-col justify-center'>
                      <button
                        className='mx-auto'
                        onClick={() => {
                          deleteLog()
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
                </form>
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
    </div>
  )
}

export default MyPondLog
