/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios, { AxiosError } from 'axios'
import { set, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import AOS from 'aos'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayout'
import { motion } from 'framer-motion'
import { FadeLeft, FadeRight } from '../../../utils/animation'

function MyPond() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])
  const [koi, setKoi] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [currentPond, setCurrentPond] = useState(null)
  const [baseImage, setBaseImage] = useState('')
  const [koiCounts, setKoiCounts] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [showButtons, setShowButtons] = useState(false)

  const navigate = useNavigate()

  const toggleButtons = () => {
    setShowButtons(!showButtons)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
    setIsEditFormVisible(false)
    setCurrentPond(null)
    reset()
  }

  const toggleCloseForm = () => {
    setIsEditFormVisible(!isEditFormVisible)
    setIsEditFormVisible(false)
    setCurrentPond(null)
    setBaseImage(null)
    reset(ponds)
  }

  const toggleEditFormVisibility = (pond) => {
    if (pond) {
      setCurrentPond(pond)
      setIsEditFormVisible(true)
      setIsAddFormVisible(false)
      reset()
    }
  }

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
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

  useEffect(() => {
    getPond()
  }, [])

  const upDatePond = async (data, id = null) => {
    setIsLoading(true)
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      if (id) {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('drainCount', data.drainCount)
        formData.append('depth', data.depth)
        formData.append('skimmer', data.skimmer)
        formData.append('pumpCapacity', data.pumpCapacity)
        formData.append('volume', data.volume)
        if (selectedFile) {
          formData.append('file', selectedFile)
        }
        // formData.append('imageUrl', data.imageUrl)

        await axios.put(`https://koicaresystemv3.azurewebsites.net/api/koiponds/koipond/${id}/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('drainCount', data.drainCount)
        formData.append('depth', data.depth)
        formData.append('skimmer', data.skimmer)
        formData.append('pumpCapacity', data.pumpCapacity)
        formData.append('volume', data.volume)
        if (selectedFile) {
          formData.append('file', selectedFile)
        }
        await axios.post('https://koicaresystemv3.azurewebsites.net/api/koiponds/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      reset()
      getPond()
      setIsAddFormVisible(false)
      setIsEditFormVisible(false)
    } catch (error) {
      console.log('Error creating/updating pond:', error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBaseImage(reader.result)
      }
      reader.readAsDataURL(file)
      setSelectedFile(file)
    }
  }

  const onSubmit = async (data) => {
    if (currentPond) {
      upDatePond(data, currentPond.id)
    } else {
      upDatePond(data)
    }
  }

  const deletePond = async (id) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/koiponds/koipond/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      reset()
      getPond()
      setIsEditFormVisible(false)
    } catch (error) {
      console.error('Error deleting pond:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getKoi = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/koifishs/koipond/${id}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const koiCount = res.data.data.length
      setKoiCounts((prevCounts) => ({
        ...prevCounts,
        [id]: koiCount
      }))
    } catch (error) {
      console.error(`Error fetching koi for pond ${id}:`, error)
    }
  }

  useEffect(() => {
    if (ponds.length > 0) {
      ponds.forEach((pond) => {
        getKoi(pond.id)
      })
    }
  }, [ponds])

  const sortPonds = (name, sort) => {
    let sortedArray = [...ponds]
    console.log(sortedArray)
    if (sort === 'volume') {
      sortedArray.sort((a, b) => (name === 'asc' ? a.volume - b.volume : b.volume - a.volume))
    } else if (sort === 'name') {
      sortedArray.sort((a, b) => (name === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    } else if (sort === 'koiCount') {
      sortedArray.sort((a, b) =>
        name === 'asc'
          ? (koiCounts[a.id] || 0) - (koiCounts[b.id] || 0)
          : (koiCounts[b.id] || 0) - (koiCounts[a.id] || 0)
      )
    }

    setPonds(sortedArray)
  }

  const sortVolume = (sortType) => {
    sortPonds(sortType, 'volume')
  }

  const sortByKoiCount = (sortType) => {
    sortPonds(sortType, 'koiCount')
  }

  const sortByName = (sortType) => {
    sortPonds(sortType, 'name')
  }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />

          <div className='w-full flex justify-end'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='fixed z-50 bottom-5 right-5 text-lg text-black outline-none rounded-r-xl bg-custom-layout-light shadow-lg size-16 p-2 cursor-pointer'
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
            <Link to='/member/myPond/myPondLog'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='fixed z-50 bottom-5 right-[84px] text-lg shadow-lg text-black rounded-l-xl bg-custom-layout-light size-16 p-2 cursor-pointer'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                />
              </svg>
            </Link>
          </div>

          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='My Pond' links='member/myPond' />
            <div className='w-full flex justify-end relative'>
              <div className='cursor-pointer' onClick={toggleButtons}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={`${isDarkMode ? ' text-custom-layout-light' : 'text-custom-layout-dark'} w-8 h-8 mb-4`}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
                  />
                </svg>

                <div
                  className={`absolute right-0 transition-all duration-500 -mt-3 border z-10 ease-in-out overflow-hidden ${
                    showButtons ? 'max-h-50 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className={`${
                      isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                    } flex flex-col space-y-2 shadow-lg rounded-lg p-4`}
                  >
                    <button
                      className={`${
                        isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                      } btn py-2 px-4 rounded `}
                      onClick={() => sortByKoiCount('desc')}
                    >
                      Sorted by Number of Fish (desc)
                    </button>
                    <button
                      className={`${
                        isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                      } btn py-2 px-4 rounded `}
                      onClick={() => sortByKoiCount('asc')}
                    >
                      Sorted by Number of Fish (asc)
                    </button>
                    <button
                      className={`${
                        isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                      } btn py-2 px-4 rounded `}
                      onClick={() => sortByName('desc')}
                    >
                      Sorted by Name (Z-A)
                    </button>
                    <button
                      className={`${
                        isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                      } btn py-2 px-4 rounded `}
                      onClick={() => sortByName('asc')}
                    >
                      Sorted by Name (A-Z)
                    </button>
                    <button
                      className={`${
                        isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                      } btn py-2 px-4 rounded `}
                      onClick={() => sortVolume('asc')}
                    >
                      Sorted by Volume (asc)
                    </button>
                    <button
                      className={`${
                        isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                      } btn py-2 px-4 rounded `}
                      onClick={() => sortVolume('desc')}
                    >
                      Sorted by Volume (desc)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial='hidden'
              animate='visible'
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3'
            >
              {ponds.map((pond, index) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 100 },
                    visible: { opacity: 1, x: 0, transition: { delay: index * 0.3 } }
                  }}
                  key={pond.id}
                  className={`${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } rounded-xl cursor-pointer border hover:scale-[102%] duration-300`}
                  onClick={() => {
                    toggleEditFormVisibility(pond)
                    reset(pond)
                  }}
                >
                  <img
                    src={pond.imageUrl}
                    alt={pond.name}
                    className='w-full h-60 object-cover rounded-t-xl overflow-hidden'
                    style={{ objectFit: 'cover', filter: 'brightness(1.1) contrast(1.1)' }}
                  />
                  <div className='p-4'>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Pond:</h3>
                      <h3 className='text-base font-semibold'>{pond.name}</h3>
                    </div>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Number of fish:</h3>
                      <h3 className='text-base font-semibold'>
                        {koiCounts[pond.id] !== undefined ? koiCounts[pond.id] : 'Loading...'}
                      </h3>{' '}
                    </div>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Volume:</h3>
                      <h3 className='text-base font-semibold'>{pond.volume} l</h3>
                    </div>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Drain Count:</h3>
                      <h3 className='text-base font-semibold'>{pond.drainCount}</h3>
                    </div>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Depth:</h3>
                      <h3 className='text-base font-semibold'>{pond.depth} m</h3>
                    </div>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Skimmer Count:</h3>
                      <h3 className='text-base font-semibold'>{pond.skimmer}</h3>
                    </div>
                    <div className='flex w-full pl-3'>
                      <h3 className='text-base w-56'>Pump Capacity:</h3>
                      <h3 className='text-base font-semibold'>{pond.pumpCapacity} L/min</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {isAddFormVisible && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                <div
                  className={` ${
                    isDarkMode ? 'bg-custom-dark' : 'bg-white'
                  }  min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
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
                          setBaseImage(null)
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
                    <h3 className='mb-5 text-2xl font-bold'>Add a Pond</h3>
                    <div className='grid grid-cols-2 grid-rows-4 gap-4'>
                      <div
                        id='imageSingle'
                        className='mb-6 col-span-1 row-span-2 h-full w-full flex rounded-lg  items-center justify-center border border-black'
                      >
                        {baseImage ? (
                          <div className='pre-upload max-w-[40vw] relative max-h-[154px] w-full h-full'>
                            <img src={baseImage} alt='Preview' className='absolute w-full h-full object-cover' />
                            <input
                              type='file'
                              id='upload-input'
                              className='absolute h-full w-full opacity-0 object-cover'
                              accept='image/*'
                              {...register('file')}
                              onChange={handleImageChange}
                            />

                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='size-5 absolute text-white -top-3 -right-2 rounded-full bg-red-500'
                              onClick={() => setBaseImage(null)}
                            >
                              <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                            </svg>
                          </div>
                        ) : (
                          <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
                            <div className='relative'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width={16}
                                height={16}
                                fill='currentColor'
                                className='mx-auto text-gray-500 inline-block w-10 h-10'
                                viewBox='0 0 16 16'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z'
                                />
                                <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
                              </svg>
                              <div className='py-3'>
                                <span>Choose images here</span>
                              </div>
                            </div>

                            <input
                              type='file'
                              id='upload-input'
                              className='absolute ml-20 opacity-0'
                              accept='image/*'
                              {...register('file')}
                              onChange={handleImageChange}
                            />
                          </label>
                        )}
                      </div>

                      {/* {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>} */}

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='name'
                          className={`absolute block -top-[12px] ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } left-3 text-red-500 font-semibold`}
                        >
                          Name:
                        </label>
                        <input
                          type='text'
                          id='name'
                          placeholder='Enter name'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('name', { required: 'Name is required' })}
                        />
                        {/* {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>} */}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='volume'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Volume:
                        </label>
                        <input
                          type='text'
                          id='volume'
                          placeholder='Enter volume'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('volume')}
                        />
                        {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='depth'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Depth (m):
                        </label>
                        <input
                          type='text'
                          id='depth'
                          placeholder='Enter depth in meters'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('depth')}
                        />
                        {errors.depth && <p className='text-red-500 text-sm'>{errors.depth.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Drain Count:
                        </label>
                        <input
                          type='text'
                          id='drainCount'
                          placeholder='Enter drain count'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('drainCount')}
                        />
                        {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='skimmerCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Skimmer Count:
                        </label>
                        <input
                          type='text'
                          id='skimmerCount'
                          placeholder='Enter skimmer count'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('skimmer')}
                        />
                        {errors.skimmer && <p className='text-red-500 text-sm'>{errors.skimmer.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='pumpCapacity'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Pumping Capacity (l/h):
                        </label>
                        <input
                          type='text'
                          id='pumpCapacity'
                          placeholder='Enter pumping capacity in l/h'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('pumpCapacity')}
                        />
                        {errors.pumpCapacity && <p className='text-red-500 text-sm'>{errors.pumpCapacity.message}</p>}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isEditFormVisible && currentPond && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                <div
                  className={`${
                    isDarkMode ? 'bg-custom-dark' : 'bg-white'
                  } min-w-[80vh] m-auto p-6 rounded-lg shadow-lg`}
                >
                  {/* Form for editing pond */}
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className='flex justify-between mb-5'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        onClick={toggleCloseForm}
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
                    <h3 className='mb-5 text-2xl font-bold'>Edit Pond</h3>
                    <div className='grid grid-cols-2 grid-rows-4 gap-4'>
                      <div
                        id='imageSingle'
                        className='mb-6 col-span-1 row-span-2 h-full w-full flex  items-center justify-center border border-black'
                      >
                        {baseImage ? (
                          <div className='pre-upload max-w-[40vw] relative max-h-[154px] w-full h-full'>
                            <img src={baseImage} alt='Preview' className='absolute w-full h-full object-cover' />
                            <input
                              type='file'
                              id='upload-input'
                              className='absolute top-10 h-20 opacity-0'
                              accept='image/*'
                              {...register('file')}
                              onChange={handleImageChange}
                            />

                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='size-5 absolute text-white -top-3 -right-2 rounded-full bg-red-500'
                              onClick={() => setBaseImage(null)}
                            >
                              <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                            </svg>
                          </div>
                        ) : (
                          <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
                            <div className='relative'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width={16}
                                height={16}
                                fill='currentColor'
                                className='mx-auto text-gray-500 inline-block w-10 h-10'
                                viewBox='0 0 16 16'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z'
                                />
                                <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
                              </svg>
                              <div className='py-3'>
                                <span>Choose images here</span>
                              </div>
                            </div>

                            <input
                              type='file'
                              id='upload-input'
                              className='absolute ml-20 opacity-0'
                              accept='image/*'
                              {...register('file')}
                              onChange={handleImageChange}
                            />
                          </label>
                        )}
                      </div>

                      {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>}

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='name'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Name:
                        </label>
                        <input
                          type='text'
                          id='name'
                          placeholder='Enter volume'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none  transition-colors duration-200`}
                          {...register('name')}
                        />
                        {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='volume'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Volume:
                        </label>
                        <input
                          type='text'
                          id='volume'
                          placeholder='Enter volume'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('volume')}
                        />
                        {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='depth'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Depth (m):
                        </label>
                        <input
                          type='text'
                          id='depth'
                          placeholder='Enter depth in meters'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('depth')}
                        />
                        {errors.depth && <p className='text-red-500 text-sm'>{errors.depth.message}</p>}
                      </div>

                      {/* Second row with 3 inputs, full width */}
                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Drain Count:
                        </label>
                        <input
                          type='text'
                          id='drainCount'
                          placeholder='Enter drain count'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('drainCount')}
                        />
                        {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='skimmerCount'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Skimmer Count:
                        </label>
                        <input
                          type='text'
                          id='skimmerCount'
                          placeholder='Enter skimmer count'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('skimmer')}
                        />
                        {errors.skimmer && <p className='text-red-500 text-sm'>{errors.skimmer.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='pumpCapacity'
                          className={`absolute -top-[12px] left-3 text-red-500 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } font-semibold`}
                        >
                          Pumping Capacity (l/h):
                        </label>
                        <input
                          type='text'
                          id='pumpCapacity'
                          placeholder='Enter pumping capacity in l/h'
                          className={`w-full p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          {...register('pumpCapacity')}
                        />
                        {errors.pumpCapacity && <p className='text-red-500 text-sm'>{errors.pumpCapacity.message}</p>}
                      </div>
                    </div>
                  </form>
                  <div className='w-full flex flex-col justify-center'>
                    <button className='mx-auto' onClick={() => deletePond(currentPond.id)}>
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

                    <p className='text-center font-semibold'>Delete this pond</p>
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

export default MyPond
