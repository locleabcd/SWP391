import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import TopLayout from '../../../layouts/TopLayout'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Chat from '../../../components/Chat/Chat'

function MyKoi() {
  const { isDarkMode } = useDarkMode()
  const [kois, setKois] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ponds, setPonds] = useState([])
  const [baseImage, setBaseImage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [koiCounts, setKoiCounts] = useState({})
  const [showButtons, setShowButtons] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm()

  const toggleButtons = () => {
    setShowButtons(!showButtons)
  }

  const length = watch('length')
  const physique = watch('physique')

  useEffect(() => {
    if (length && physique) {
      let calculatedWeight = 0
      const lengthCubed = Math.pow(length, 3)

      if (physique === 'Slim') {
        calculatedWeight = (1.5 * lengthCubed) / 100
      } else if (physique === 'Normal') {
        calculatedWeight = (1.7 * lengthCubed) / 100
      } else if (physique === 'Corpulent') {
        calculatedWeight = (2 * lengthCubed) / 100
      }

      setValue('weight', calculatedWeight.toFixed(2))
    }
  }, [length, physique, setValue])

  useEffect(() => {
    AOS.init({ duration: 500, offset: 500 })
  }, [])

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

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
    reset()
  }

  const onSubmit = async (data) => {
    console.log('onSubmit:', data)
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const formData = new FormData()

      formData.append('name', data.name)
      formData.append('physique', data.physique)
      formData.append('age', data.age)
      formData.append('length', data.length)
      formData.append('weight', data.weight)
      formData.append('gender', data.gender)
      formData.append('variety', data.variety)
      formData.append('pondDate', data.pondDate)
      formData.append('breeder', data.breeder)
      formData.append('price', data.price)
      formData.append('koiPondId', data.pondId)
      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      console.log(data)
      const res = await axios.post(`https://koicaresystemv2.azurewebsites.net/api/koifishs/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setIsAddFormVisible(false)
      getKoi()
      toast.success('Create Koi Successfully!')
    } catch (error) {
      console.log(error)
      toast.error('Create Koi Fail!')
    } finally {
      setIsSubmitting(false)
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
      setPonds(res.data.data)
    } catch (error) {
      console.error('Error fetching ponds:', error)
    }
  }

  const getKoi = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/koifishs/user/${id}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const sortedKois = res.data.data.sort((a, b) => a.id - b.id)
      const koiCount = sortedKois.length
      setKoiCounts((prevCounts) => ({
        ...prevCounts,
        [id]: koiCount
      }))
      setKois(sortedKois)
    } catch (error) {
      console.error('Error fetching koi:', error)
    }
  }

  useEffect(() => {
    getKoi()
  }, [])

  useEffect(() => {
    getPond()
  }, [])

  const sortKois = (name, sort) => {
    let sortedArray = [...kois]
    console.log(sortedArray)
    if (sort === 'name') {
      sortedArray.sort((a, b) => (name === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    } else if (sort === 'age') {
      sortedArray.sort((a, b) => (name === 'asc' ? a.age - b.age : b.age - a.age))
    } else if (sort === 'length') {
      sortedArray.sort((a, b) => (name === 'asc' ? a.length - b.length : b.length - a.length))
    }
    setKois(sortedArray)
  }

  const sortAge = (sortType) => {
    sortKois(sortType, 'age')
  }

  const sortLength = (sortType) => {
    sortKois(sortType, 'length')
  }

  const sortByName = (sortType) => {
    sortKois(sortType, 'name')
  }

  const isNameDuplicate = (name) => {
    return kois.some((koi) => koi.name.toLowerCase() === name.toLowerCase())
  }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} 
           shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
          <Chat />
          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <div className=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='fixed lg:bottom-7 bottom-[22px] right-5 text-lg hover:bg-blue-600 text-white rounded-full shadow-lg lg:size-12 size-8 cursor-pointer z-30'
                onClick={toggleAddFormVisibility}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
              <div className='fixed lg:w-[140px] w-[100px] lg:h-12 h-9 lg:bottom-7 bottom-5 right-5 rounded-3xl text-white bg-custom-left-bar z-20'>
                <p className='lg:text-3xl text-xl font-semibold pt-1 pl-3'>
                  {koiCounts[localStorage.getItem('id')] !== undefined ? koiCounts[localStorage.getItem('id')] : '...'}{' '}
                  Koi
                </p>
              </div>
            </div>
            <TopLayout text='My Koi' links='member/myKoi' />
            <div>
              <div className='w-full flex justify-end relative'>
                <div className='cursor-pointer' onClick={toggleButtons}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`${isDarkMode ? ' text-custom-layout-light' : 'text-custom-layout-dark'} size-6 lg:size-8 mb-4`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
                    />
                  </svg>

                  <div
                    className={`absolute right-0 transition-all duration-500 -mt-3 border z-10 ease-in-out overflow-hidden ${showButtons ? 'max-h-50 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div
                      className={`${isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'} flex flex-col space-y-2 shadow-lg rounded-lg p-4`}
                    >
                      <button
                        className={`${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'} btn py-2 px-4 rounded lg:text-xl text-xs `}
                        onClick={() => sortByName('desc')}
                      >
                        Sorted by Name (Z-A)
                      </button>
                      <button
                        className={`${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'} btn py-2 px-4 rounded lg:text-xl text-xs `}
                        onClick={() => sortByName('asc')}
                      >
                        Sorted by Name (A-Z)
                      </button>
                      <button
                        className={`${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'} btn py-2 px-4 rounded lg:text-xl text-xs `}
                        onClick={() => sortLength('asc')}
                      >
                        Sorted by Length (asc)
                      </button>
                      <button
                        className={`${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'} btn py-2 px-4 rounded lg:text-xl text-xs `}
                        onClick={() => sortLength('desc')}
                      >
                        Sorted by Length (desc)
                      </button>
                      <button
                        className={`${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'} btn py-2 px-4 rounded lg:text-xl text-xs `}
                        onClick={() => sortAge('asc')}
                      >
                        Sorted by Age (asc)
                      </button>
                      <button
                        className={`${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'} btn py-2 px-4 rounded lg:text-xl text-xs `}
                        onClick={() => sortAge('desc')}
                      >
                        Sorted by Age (desc)
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
                      staggerChildren: 0.01
                    }
                  }
                }}
                className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 py-3'
              >
                {kois.map((koi, index) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 100 },
                      visible: { opacity: 1, x: 0, transition: { delay: index * 0.05 } }
                    }}
                    key={koi.id}
                    className={`${
                      isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                    }  rounded-xl border cursor-pointer`}
                  >
                    <Link to={`/member/myKoi/${koi.id}`}>
                      <div className='flex gap-3 '>
                        <div className='w-[48%] '>
                          <img
                            src={koi.imageUrl}
                            alt={koi.name}
                            className='w-full h-32 object-cover rounded-s-xl overflow-hidden'
                            style={{ objectFit: 'cover', filter: 'brightness(1.1)' }}
                          />
                        </div>
                        <div className=' w-[52%] flex mt-1  '>
                          <div className='grid grid-rows-4 w-[30%]'>
                            <h3 className='text-sm '>Name:</h3>
                            <h3 className='text-sm '>Age: </h3>
                            <h3 className='text-sm '>Variety:</h3>
                            <h3 className='text-sm '>Length:</h3>
                          </div>
                          <div className='grid grid-rows-4'>
                            <p className='ml-2 text-sm font-semibold text-nowrap z-50'>{koi.name}</p>
                            <p className='ml-2 text-sm font-semibold '>{koi.age} years</p>
                            <p className='ml-2 text-sm font-semibold '>{koi.variety}</p>
                            <p className='ml-2 text-sm font-semibold '>{koi.length} cm</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {isAddFormVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50 '>
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
                      d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                </button>
              </div>

              <h3 className='mb-5 lg:text-2xl text-xl font-bold'>Add a Koi</h3>
              <div className='grid grid-cols-2 grid-rows-4 gap-4'>
                <div id='file' className='lg:mb-6 col-span-1 row-span-2 h-full flex justify-center border border-black'>
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
                        className='size-5 absolute text-white cursor-pointer -top-2 -right-2 rounded-full bg-red-500'
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

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    htmlFor='name'
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                  >
                    Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    placeholder='Enter Name'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('name', {
                      required: 'Name is required',
                      maxLength: {
                        value: 20,
                        message: 'Name must be at most 50 characters long'
                      },
                      validate: (value) => !isNameDuplicate(value) || 'Name already exists'
                    })}
                  />
                  {errors.name && (
                    <p className='absolute -bottom-[3px] left-3 lg:-bottom-[22px] lg:left-3 text-red-500 text-sm'>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    htmlFor='physique'
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                  >
                    Physique
                  </label>
                  <select
                    id='physique'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('physique')}
                  >
                    <option value='Normal'>Normal</option>
                    <option value='Slim'>Slim</option>
                    <option value='Corpulent'>Corpulent</option>
                  </select>
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    htmlFor='age'
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                  >
                    Age
                  </label>
                  <div className='h-10'>
                    <select
                      id='age'
                      className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                        isDarkMode ? 'bg-custom-dark' : 'bg-white'
                      } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                      {...register('age')}
                    >
                      <option value={0}>0 years</option>
                      <option value={1}>Tosai (1 year)</option>
                      <option value={2}>Nisai (2 years)</option>
                      <option value={3}>Sansai (3 years)</option>
                      <option value={4}>Yonsai (4 years)</option>
                      <option value={5}>Gosai (5 years)</option>
                      <option value={6}>Rokusai (6 years)</option>
                      <option value={7}>Nanasai (7 years)</option>
                      {[...Array(95)].map((_, i) => (
                        <option key={i + 6} value={i + 6}>
                          {i + 6} years
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='length'
                  >
                    Length
                  </label>
                  <input
                    type='number'
                    id='length'
                    placeholder='cm'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('length', {
                      required: 'Length is required',
                      min: { value: 1, message: 'Length must greater than 0 cm' },
                      max: { value: 150, message: 'Length must not exceed 150 cm' }
                    })}
                  />
                  {errors.length && (
                    <p className='absolute -bottom-[8px] left-3 lg:-bottom-[20px] lg:left-3 text-red-500 text-sm'>
                      {errors.length.message}
                    </p>
                  )}
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='weight'
                  >
                    Weight
                  </label>
                  <input
                    type='number'
                    id='weight'
                    placeholder='g'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('weight', {
                      required: 'Weight is required',
                      min: { value: 0.0000000001, message: 'Weigth must greater than 0 g' },
                      max: { value: 60000, message: 'Weigth must not exceed 60000 g' }
                    })}
                  />
                  {errors.weight && (
                    <p className='absolute -bottom-[8px] lg:-bottom-[20px] lg:left-3 left-3 text-red-500 text-sm'>
                      {errors.weight.message}
                    </p>
                  )}
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='gender'
                  >
                    Gender
                  </label>
                  <select
                    id='gender'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('gender')}
                  >
                    <option value='Undefined'>Select Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Undefined'>Undefined</option>
                  </select>
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='variety'
                  >
                    Variety
                  </label>
                  <input
                    type='text'
                    id='variety'
                    placeholder='Enter Variety'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('variety', { required: false })}
                  />
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='pondDate'
                  >
                    In Pond Date
                  </label>
                  <input
                    type='date'
                    id='pondDate'
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('pondDate')}
                  />
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='breeder'
                  >
                    Breeder
                  </label>
                  <input
                    type='text'
                    id='breeder'
                    placeholder='Enter Breeder'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('breeder', { required: false })}
                  />
                </div>

                <div className='relative col-span-1 lg:mb-4'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='price'
                  >
                    Price
                  </label>
                  <input
                    type='number'
                    id='price'
                    placeholder='VND'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be greater than 0' }
                    })}
                  />
                  {errors.price && (
                    <p className='absolute -bottom-4 left-4 lg:-bottom-6 lg:left-4 text-red-500 text-sm'>
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className='relative col-span-1 lg:mb-4 mt-2'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='pondId'
                  >
                    Pond
                  </label>
                  <select
                    id='pondId'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    {...register('pondId', { required: 'Please select a pond' })}
                  >
                    {ponds.map((pond) => (
                      <option key={pond.id} value={pond.id}>
                        {pond.name}
                      </option>
                    ))}
                  </select>
                  {errors.pondId && (
                    <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.pondId.message}</p>
                  )}
                </div>

                <div className='relative col-span-1 lg:mb-4 mt-2'>
                  <label
                    className={`absolute block -top-[12px] ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } left-3 lg:text-lg text-sm text-red-500 font-semibold`}
                    htmlFor='price'
                  >
                    Status
                  </label>
                  <input
                    type='text'
                    id='status'
                    value='Alive'
                    className={`w-full lg:p-3 px-2 py-1 lg:text-lg text-sm ${
                      isDarkMode ? 'bg-custom-dark' : 'bg-white'
                    } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {isLoading && (
        <div className='fixed inset-0 px-4 py-2 flex items-center justify-center z-50'>
          <FaSpinner className='animate-spin text-green-500 text-6xl' />
        </div>
      )}
    </div>
  )
}

export default MyKoi
