/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios from 'axios'
import { set, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import AOS from 'aos'

function MyPond() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [currentPond, setCurrentPond] = useState(null)
  const [baseImage, setBaseImage] = useState('')

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm()

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koi-care-system.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPonds(res.data.data)
    } catch (error) {
      console.error('Error fetching ponds:', error)
    }
  }

  useEffect(() => {
    getPond()
  }, [])

  const upDatePond = async (data, id) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.put(
        `https://koi-care-system.azurewebsites.net/api/koiponds/koipond/${id}/update`,
        {
          name: data.name,
          drainCount: data.drainCount,
          depth: data.depth,
          skimmer: data.skimmer,
          pumpCapacity: data.pumpCapacity,
          imageUrl: data.imageUrl,
          volume: data.volume
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      setIsEditFormVisible(false)
      reset()
      getPond()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const deletePond = async (id) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koi-care-system.azurewebsites.net/api/koiponds/koipond/${id}/delete`, {
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

  const onSubmit = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const formData = {
        name: data.name,
        drainCount: data.drainCount,
        depth: data.depth,
        skimmer: data.skimmer,
        pumpCapacity: data.pumpCapacity,
        file: data.file[0], // Send base64 image
        volume: data.volume
      }

      // console.log('Sending formData:', formData)

      if (currentPond) {
        await upDatePond(data, currentPond.id)
        reset()
      } else {
        await axios.post('https://koi-care-system.azurewebsites.net/api/koiponds/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }
      setIsAddFormVisible(false)
      getPond()
      reset()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-200 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='fixed bottom-5 right-5 text-lg text-red-500 rounded-full shadow-lg size-12 cursor-pointer'
            onClick={() => {
              toggleAddFormVisibility()
            }}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
          </svg>

          <div className='p-4 w-full mt-2 ml-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {ponds.map((pond) => (
                <div
                  key={pond.id}
                  className={`${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } border p-4 rounded-lg shadow cursor-pointer`}
                  onClick={() => {
                    toggleEditFormVisibility(pond)
                    reset(pond)
                  }}
                >
                  <img src={pond.imageUrl} alt={pond.name} className='w-full h-44 object-cover mb-4 rounded-md' />
                  <div className='flex w-full'>
                    <h3 className='text-base w-40'>Pond:</h3>
                    <h3 className='text-base font-semibold'>{pond.name}</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-40'>Volume:</h3>
                    <h3 className='text-base font-semibold'>{pond.volume} l</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-40'>Drain Count:</h3>
                    <h3 className='text-base font-semibold'>{pond.drainCount}</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-40'>Depth:</h3>
                    <h3 className='text-base font-semibold'>{pond.depth} m</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-40'>Skimmer Count:</h3>
                    <h3 className='text-base font-semibold'>{pond.skimmer}</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-40'>Pump Capacity:</h3>
                    <h3 className='text-base font-semibold'>{pond.pumpCapacity} L/min</h3>
                  </div>
                </div>
              ))}
            </div>

            {isAddFormVisible && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40'>
                <div className='bg-white min-w-[80vh] m-auto p-6 rounded-lg shadow-lg'>
                  {/* Form for adding pond */}
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className='flex justify-between mb-5'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        onClick={toggleAddFormVisibility}
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
                        className='mb-6 col-span-1 row-span-2 h-full flex justify-center border border-black'
                      >
                        <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
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

                          <input type='file' id='upload-input' className='' accept='image/*' {...register('file')} />
                          {/* <img src={baseImage} alt='Preview' className='w-full h-40 object-cover' /> */}
                        </label>
                      </div>

                      {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>}

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='name'
                          className='absolute block -top-[12px] bg-white left-3 text-red-500 font-semibold'
                        >
                          Name:
                        </label>
                        <input
                          type='text'
                          id='name'
                          placeholder='Enter name'
                          className='w-full p-3 bg-white border border-black  rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('name')}
                        />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='volume'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Volume:
                        </label>
                        <input
                          type='text'
                          id='volume'
                          placeholder='Enter volume'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('volume')}
                        />
                        {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='depth'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Depth (m):
                        </label>
                        <input
                          type='text'
                          id='depth'
                          placeholder='Enter depth in meters'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('depth')}
                        />
                        {errors.depth && <p className='text-red-500 text-sm'>{errors.depth.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Drain Count:
                        </label>
                        <input
                          type='text'
                          id='drainCount'
                          placeholder='Enter drain count'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('drainCount')}
                        />
                        {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='skimmerCount'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Skimmer Count:
                        </label>
                        <input
                          type='text'
                          id='skimmerCount'
                          placeholder='Enter skimmer count'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('skimmer')}
                        />
                        {errors.skimmer && <p className='text-red-500 text-sm'>{errors.skimmer.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='pumpCapacity'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Pumping Capacity (l/h):
                        </label>
                        <input
                          type='text'
                          id='pumpCapacity'
                          placeholder='Enter pumping capacity in l/h'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
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
                <div className='bg-white min-w-[80vh] m-auto p-6 rounded-lg shadow-lg'>
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
                        className='mb-6 col-span-1 row-span-2 h-full flex justify-center border border-black'
                      >
                        <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
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

                          <input type='file' ref={register} className='hidden' {...register('file')} />
                        </label>
                      </div>

                      {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>}

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='name'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Name:
                        </label>
                        <input
                          type='text'
                          id='name'
                          placeholder='Enter volume'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none  transition-colors duration-200'
                          {...register('name')}
                        />
                        {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='volume'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Volume:
                        </label>
                        <input
                          type='text'
                          id='volume'
                          placeholder='Enter volume'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('volume')}
                        />
                        {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='depth'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Depth (m):
                        </label>
                        <input
                          type='text'
                          id='depth'
                          placeholder='Enter depth in meters'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('depth')}
                        />
                        {errors.depth && <p className='text-red-500 text-sm'>{errors.depth.message}</p>}
                      </div>

                      {/* Second row with 3 inputs, full width */}
                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='drainCount'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Drain Count:
                        </label>
                        <input
                          type='text'
                          id='drainCount'
                          placeholder='Enter drain count'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('drainCount')}
                        />
                        {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='skimmerCount'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Skimmer Count:
                        </label>
                        <input
                          type='text'
                          id='skimmerCount'
                          placeholder='Enter skimmer count'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('skimmer')}
                        />
                        {errors.skimmer && <p className='text-red-500 text-sm'>{errors.skimmer.message}</p>}
                      </div>

                      <div className='mb-4 relative col-span-1'>
                        <label
                          htmlFor='pumpCapacity'
                          className='absolute -top-[12px] left-3 text-red-500 bg-white font-semibold'
                        >
                          Pumping Capacity (l/h):
                        </label>
                        <input
                          type='text'
                          id='pumpCapacity'
                          placeholder='Enter pumping capacity in l/h'
                          className='w-full p-3 bg-white border border-black rounded-lg focus:outline-none transition-colors duration-200'
                          {...register('pumpCapacity')}
                        />
                        {errors.pumpCapacity && <p className='text-red-500 text-sm'>{errors.pumpCapacity.message}</p>}
                      </div>
                    </div>
                  </form>
                  <div>
                    <button className='mx-auto w-full' onClick={() => deletePond(currentPond.id)}>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPond
