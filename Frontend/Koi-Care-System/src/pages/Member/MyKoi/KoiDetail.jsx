/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { MdSystemUpdateAlt } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'
import { IoMdMale } from 'react-icons/io'
import { IoMdFemale } from 'react-icons/io'
import { FaQuestion } from 'react-icons/fa'
import TopLayout from '../../../layouts/TopLayout'

function KoiDetails() {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [koi, setKoi] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [ponds, setPonds] = useState([])
  const navigate = useNavigate()
  const [baseImage, setBaseImage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatISOToYYYYMMDD = (isoDate) => {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}` // Returns date in yyyy-mm-dd format
  }

  const toggleCloseForm = () => {
    setIsEditFormVisible(false)
  }

  const toggleEditFormVisibility = (koi) => {
    setIsEditFormVisible(true)
    reset(koi)
  }

  const getKoi = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koifishs/user/${userId}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const allKois = res.data.data
      const koiDetails = allKois.find((koi) => koi.id.toString() === id)
      setKoi(koiDetails)
    } catch (error) {
      console.error('Error fetching koi:', error)
      alert('Failed to load koi details, please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getKoi()
  }, [])

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('data', res.data)
      setPonds(res.data.data)
    } catch (error) {
      console.error('Error fetching ponds:', error)
      alert('Failed to load ponds, please try again later.')
    }
  }

  useEffect(() => {
    getPond()
  }, [])

  const updateKoi = async (data, id) => {
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
      formData.append('gender', data.gender)
      formData.append('variety', data.variety)
      formData.append('pondDate', data.pondDate)
      formData.append('breeder', data.breeder)
      formData.append('price', data.price)
      formData.append('koiPondId', data.pondId)
      formData.append('status', data.status)
      formData.append('imageUrl', data.status)

      // Append the image file if a file is selected
      if (selectedFile) {
        formData.append('file', selectedFile)
      }
      // else {
      //   formData.append('imageUrl', koi.imageUrl) // Append the existing imageUrl if no new image is uploaded
      // }
      const res = await axios.put(
        `https://koicaresystem.azurewebsites.net/api/koifishs/koifish/${id}/update`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setIsEditFormVisible(false)
      reset()
      getKoi()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const [fishes, setFishes] = useState([])

  const getFishes = async () => {
    try {
      const token = localStorage.getItem('token')
      const pondId = ponds.map((pond) => pond.id)
      console.log(pondId)
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koifishs/koipond/${pondId}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('API Fish Response:', res)
      console.log('API Fish Data:', res.data.data)
      setFishes(res.data.data)
    } catch (error) {
      console.error('Error fetching fish:', error)
    }
  }

  useEffect(() => {
    getFishes()
  })

  const deleteKoi = async (id) => {
    const isConfirmed = window.confirm('Are you sure to delete koi')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystem.azurewebsites.net/api/koifishs/koifish/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      reset()
      getPond()
      setIsEditFormVisible(false)
      navigate('/member/myKoi')
    } catch (error) {
      console.error('Error deleting pond:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateKoi(data, id)
  }

  if (isLoading) {
    return (
      <div className='fixed inset-0 px-4 py-2 flex items-center justify-center z-50'>
        <FaSpinner className='animate-spin text-green-500 text-4xl' />
      </div>
    )
  }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-light text-white' : 'bg-gray-200 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
          <div className='py-5 pb-0 px-[30px] mx-auto'>
            <TopLayout text='My Koi' textName='My Koi Detail' links='member/myKoi' />
          </div>
          <div className='flex items-center justify-end pr-12'>
              <button>
                <MdSystemUpdateAlt className='size-7 ' onClick={() => toggleEditFormVisibility(koi)} />
              </button>
            </div>

          {isEditFormVisible && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40 '>
              <div className='bg-white min-w-[80vh] m-auto p-6 rounded-lg shadow-lg'>
                {/* Form for editing koi */}
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

                    <button type='submit' disabled={isSubmitting}>
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
                  {/* Koi Edit Form Fields */}
                  <div className='grid grid-cols-2 grid-rows-6 gap-4'>
                    <div
                      id='file'
                      className='mb-6  col-span-1 row-span-2 h-full flex justify-center border border-black'
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
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='name'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('name')}
                      />
                    </div>
                    <div className='relative col-span-1 mb-4'>
                      <label
                        htmlFor='physique'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Physique
                      </label>
                      <select
                        id='physique'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('physique')}
                      >
                        {/* <option value=""></option> */}
                        <option value='Normal'>Normal</option>
                        <option value='Slim'>Slim</option>
                        <option value='Corpulent'>Corpulent</option>
                      </select>
                    </div>
                    <div className='relative col-span-1 mb-2 mt-2'>
                      <label
                        htmlFor='age'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Age
                      </label>
                      <select
                        id='age'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
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
                        {[...Array(93)].map((_, i) => (
                          <option key={i + 8} value={i + 8}>
                            {i + 8} years
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='relative col-span-1 mb-2 mt-2'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='gender'
                      >
                        Gender
                      </label>
                      <select
                        id='gender'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('gender')}
                      >
                        {/* <option value=""></option> */}
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Undefined'>Undefined</option>
                      </select>
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='variety'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Variety
                      </label>
                      <input
                        type='text'
                        id='variety'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('variety')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='pondDate'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        In pond since
                      </label>

                      <input
                        type='date'
                        id='pondDate'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        defaultValue={formatISOToYYYYMMDD(koi.pondDate)}
                        {...register('pondDate')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='breeder'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Breeder
                      </label>
                      <input
                        type='text'
                        id='breeder'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('breeder')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='price'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Price
                      </label>
                      <input
                        type='text'
                        id='price'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('price')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='status'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Status
                      </label>
                      <select
                        id='status'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('status')}
                        defaultValue={koi.status}
                      >
                        <option>Alive</option>
                        <option>Dead</option>
                      </select>
                    </div>
                    <div className='relative col-span-1 mt-[1.5px]'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='pondId'
                      >
                        Pond
                      </label>
                      <select
                        id='pondId'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('pondId')}
                        defaultValue={koi.koiPond.id}
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
                  </div>
                </form>
                <div className='flex justify-center items-center'>
                  <button className='mx-auto ' onClick={() => deleteKoi(koi.id)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-10 mx-auto p-2 rounded-full bg-red-500 text-white cursor-pointer mt-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className='flex justify-around py-5'>
            {/* Left content */}
            <div
              className={`${
                isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
              }  flex rounded-xl shadow-lg w-[45%]`}
            >
              {/* Image section */}
              <div className='h-full w-[45%] rounded-l-xl overflow-hidden'>
                <img
                  className='w-full h-full object-fill transition-transform duration-300 transform hover:scale-105'
                  // style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                  src={koi.imageUrl}
                  alt={koi.name}
                />
              </div>
              {/* right content  */}
              <div className='w-[55%] pl-4 pr-3 py-4 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center'>
                    <h2 className='w-[90%] font-semibold text-3xl text-start text-nowrap'> {koi.name}</h2>
                    <div className=''>
                      {koi.gender == 'Male' && (
                        <span className='flex items-center'>
                          <IoMdMale className='text-blue-500 size-7' />
                        </span>
                      )}
                      {koi.gender == 'Female' && (
                        <span className='flex items-center'>
                          <IoMdFemale className='text-pink-500 size-7' />
                        </span>
                      )}
                      {koi.gender == 'Undefined' && (
                        <span>
                          <FaQuestion className='text-red-500 size-7' />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className='text-start my-2'>
                    Variety: <strong>{koi.variety}</strong>
                  </p>
                  <p className='text-start mb-3'>
                    Pond: <strong>{koi.koiPond.name}</strong>
                  </p>
                </div>
                <div className='flex justify-between gap-4 bg-gray-400 rounded-2xl p-3 '>
                  <div className='text-center'>
                    <h1 className='text-red-500 font-semibold'>Age</h1>
                    <p className='text-sm'>{koi.age} years</p>
                  </div>
                  <div className='text-center'>
                    <h1 className='text-red-500 font-semibold'>Length</h1>
                    <p className='text-sm'>{koi.length} cm</p>
                  </div>
                  <div className='text-center'>
                    <h1 className='text-red-500 font-semibold'>Weight</h1>
                    <p className='text-sm'>{koi.weight} g</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
              } text-start p-4 rounded-xl shadow-lg w-[40%]`}
            >
              <h2 className='font-bold text-center text-xl mb-2'>Koi Description</h2>
              <p className='mb-4'>
                <strong>{koi.name}</strong> has been swimming in the pond "<strong>{koi.koiPond.name}</strong>" since{' '}
                <strong>{formatDate(koi.pondDate)}</strong>.
              </p>
              <p className='mb-4'>
                <strong>{koi.name}</strong> was bought for <strong>{koi.price}€</strong> and was bred by{' '}
                <strong>{koi.breeder}</strong>.
              </p>
              <p className='mb-2'>
                <strong>{koi.name}</strong> was <strong>{koi.status}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KoiDetails