/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate, useParams } from 'react-router-dom'

function MyPondLogId() {
  const { isDarkMode } = useDarkMode()
  const [log, setLog] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [currentLog, setCurrentLog] = useState(null)
  const [ponds, setPonds] = useState([])
  const [title, setTitle] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [category, setCategory] = useState('')
  const [pond, setPond] = useState('')
  const [note, setNote] = useState('')
  const { id } = useParams()

  const navigate = useNavigate()

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
  }

  const openEditForm = (log) => {
    setTitle(log.logTitle)
    setDateTime(log.logDate)
    setCategory(log.category)
    setNote(log.note)
    setPond(log.koiPondName)
    localStorage.setItem('logId', log.logId)
    toggleEditFormVisibility(true)
  }

  const toggleCloseForm = () => {
    setIsEditFormVisible(!isEditFormVisible)
    setIsEditFormVisible(false)
    setCurrentLog(null)
  }

  const toggleEditFormVisibility = (logs) => {
    if (logs) {
      setCurrentLog(logs)
      setIsEditFormVisible(true)
      setIsAddFormVisible(false)
    }
  }

  const pondLog = async () => {
    try {
      const token = localStorage.getItem('token')
      const pondId = id
      if (!token) {
        console.log('not found token')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/log/koiPond/${pondId}`, {
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
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('not found token')
      }
      const logId = localStorage.getItem('logId')

      await axios.delete(`https://koicaresystemv4.azurewebsites.net/api/log/delete/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      pondLog()
      toggleCloseForm()
    } catch (error) {
      console.log('err', error)
    }
  }

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
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

  const createLog = async () => {
    try {
      const token = localStorage.getItem('token')

      await axios.post(
        'https://koicaresystemv4.azurewebsites.net/api/log/create',
        {
          logTitle: title,
          logDate: dateTime,
          category: category.toUpperCase(),
          note: note,
          koiPondId: pond
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      pondLog()
      toggleAddFormVisibility(false)
    } catch (error) {
      console.error('Error details:', error)
    }
  }

  const updateLog = async () => {
    try {
      const token = localStorage.getItem('token')
      const logId = localStorage.getItem('logId')
      await axios.put(
        `https://koicaresystemv4.azurewebsites.net/api/log/update/${logId}`,
        {
          logTitle: title,
          logDate: dateTime,
          category: category.toUpperCase(),
          note: note,
          koiPondId: pond
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      pondLog()
      toggleCloseForm()
    } catch (error) {
      console.error('Error details:', error)
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
            <TopLayout text='My Pond' textName='My Pond LogId' links='member/myPond' />

            <div className='grid grid-cols-2 gap-10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='fixed bottom-5 right-5 text-lg text-black outline-none rounded-full bg-custom-layout-light shadow-lg size-16 p-2 cursor-pointer'
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
                  <div className='flex justify-between'>
                    <div className='text-2xl font-semibold'>{logs.logTitle}</div>
                    <div className='py-1 px-2 bg-blue-400 text-white rounded-xl'>{logs.category}</div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex-none w-[500px]'>
                      <div className='mt-5 text-lg'>{logs.koiPondName}</div>
                      <div className='mt-3 text-red-500'>{formatDate(logs.logDate)}</div>
                      <div className='mt-3'>{logs.note}</div>
                    </div>
                  </div>
                </div>
              ))}

              {isAddFormVisible && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                  <div
                    className={` ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    }  min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
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

                      <button onClick={() => createLog()}>
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
                    <h3 className='mb-5 text-2xl font-bold'>Add a Log</h3>
                    <div className='grid grid-cols-2 grid-rows-2 gap-4'>
                      <div className='relative col-span-1'>
                        <label
                          htmlFor='name'
                          className={`absolute block -top-[12px] ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } left-3 text-red-500 font-semibold`}
                        >
                          Title:
                        </label>
                        <input
                          type='text'
                          id='name'
                          placeholder='Enter title'
                          onChange={(e) => setTitle(e.target.value)}
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                        />
                      </div>

                      <div className='relative col-span-1'>
                        <label
                          htmlFor='volume'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Date & time:
                        </label>
                        <input
                          type='datetime-local'
                          id='volume'
                          placeholder='Enter volume'
                          onChange={(e) => setDateTime(e.target.value)}
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                        />
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='depth'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Category:
                        </label>
                        <select
                          id='pondId'
                          onChange={(e) => setCategory(e.target.value)}
                          className='block w-full p-3 border border-black rounded-md shadow-sm'
                        >
                          <option value='OTHER'>Other</option>
                          <option value='WATER_CHANGE'>Water Change</option>
                          <option value='KOI_TREATMENT'>Koi Treatment</option>
                          <option value='WATER_TREATMENT'>Water Treatment</option>
                          <option value='POPULATION_CHANGE'>Population Change</option>
                          <option value='EXPERIENCE'>Experience</option>
                          <option value='POND_MODIFICATION'>Pond Modification</option>
                        </select>
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Pond:
                        </label>
                        <select
                          id='pondId'
                          onChange={(e) => setPond(e.target.value)}
                          className='block w-full p-3 border border-black rounded-md shadow-sm'
                        >
                          <option value=''>Select a pond</option>
                          {ponds.map((pond) => (
                            <option key={pond.id} value={pond.id}>
                              {pond.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='mb-4 mt-4 relative w-full'>
                      <label
                        htmlFor='drainCount'
                        className={`absolute -top-[12px] left-3 text-red-500 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } font-semibold`}
                      >
                        Note:
                      </label>
                      <input
                        type='text'
                        onChange={(e) => setNote(e.target.value)}
                        id='drainCount'
                        placeholder='Note'
                        className={`w-full h-32 p-3 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isEditFormVisible && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                  <div
                    className={`${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    }  min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
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

                      <button onClick={() => updateLog()}>
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
                    <h3 className='mb-5 text-2xl font-bold'>Update a Log</h3>
                    <div className='grid grid-cols-2 grid-rows-2 gap-4'>
                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='name'
                          className={`absolute block -top-[12px] ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } left-3 text-red-500 font-semibold`}
                        >
                          Title:
                        </label>
                        <input
                          type='text'
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder='Enter title'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                        />
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='volume'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Date & time:
                        </label>
                        <input
                          type='datetime-local'
                          value={dateTime}
                          onChange={(e) => setDateTime(e.target.value)}
                          placeholder='Enter Date Time'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                        />
                      </div>

                      <div className='relative col-span-1'>
                        <label
                          htmlFor='depth'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Category:
                        </label>
                        <select
                          id='pondId'
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className='block w-full p-3 border border-black rounded-md shadow-sm'
                        >
                          <option value='OTHER'>Other</option>
                          <option value='WATER_CHANGE'>Water Change</option>
                          <option value='KOI_TREATMENT'>Koi Treatment</option>
                          <option value='WATER_TREATMENT'>Water Treatment</option>
                          <option value='POPULATION_CHANGE'>Population Change</option>
                          <option value='EXPERIENCE'>Experience</option>
                          <option value='POND_MODIFICATION'>Pond Modification</option>
                        </select>
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Pond:
                        </label>
                        <select
                          id='pondId'
                          value={pond}
                          onChange={(e) => setPond(e.target.value)}
                          className='block w-full p-3 border border-black rounded-md shadow-sm'
                        >
                          <option value=''>Select a pond</option>
                          {ponds.map((pond) => (
                            <option key={pond.id} value={pond.id}>
                              {pond.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className='mt-4 relative w-full'>
                      <label
                        htmlFor='drainCount'
                        className={`absolute -top-[12px] left-3 text-red-500 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } font-semibold`}
                      >
                        Note:
                      </label>
                      <textarea
                        type='text'
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder='Note'
                        className={`w-full h-32 p-3 ${
                          isDarkMode ? 'bg-custom-dark' : 'bg-white'
                        } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                      />
                    </div>

                    <div className='w-full flex flex-col justify-center'>
                      <button className='mx-auto' onClick={() => deleteLog()}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-12 mx-auto p-2 rounded-full bg-red-500 text-white cursor-pointer mt-5'
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPondLogId
