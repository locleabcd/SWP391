import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'

function MyPondLog() {
  const { isDarkMode } = useDarkMode()
  const [log, setLog] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [currentLog, setCurrentLog] = useState(null)

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
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
      if (!token) {
        console.log('not found token')
      }

      const res = await axios.get('https://koicaresystem.azurewebsites.net/api/log', {
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

  const deleteLog = async (logId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('not found token')
      }

      await axios.delete(`https://koicaresystem.azurewebsites.net/api/log/delete/${logId}`, {
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

          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='My Pond' textName='My Pond Log' links='member/myPond' />

            <div className='grid grid-cols-2 gap-10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='fixed bottom-5 right-5 text-lg text-black outline-none rounded-r-xl bg-custom-layout-light shadow-lg size-16 p-2 cursor-pointer'
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
                  onClick={() => toggleEditFormVisibility(logs)}
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
                    <div className='flex-auto mt-4'>
                      <img src={logs.image} alt='' className='h-44' />
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
                    <form
                      // onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <div className='flex justify-between mb-5'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          onClick={() => {
                            // reset()
                            // setBaseImage(null)
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
                      <h3 className='mb-5 text-2xl font-bold'>Add a Log</h3>
                      <div className='grid grid-cols-2 grid-rows-3 gap-4'>
                        <div
                          id='imageSingle'
                          className='mb-6 col-span-1 row-span-2 h-full w-full flex rounded-lg  items-center justify-center border border-black'
                        >
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
                              // {...register('file')}
                              // onChange={handleImageChange}
                            />
                          </label>
                        </div>

                        {/* {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>} */}

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
                            id='name'
                            placeholder='Enter title'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('name')}
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
                            Date & time:
                          </label>
                          <input
                            type='datetime-local'
                            id='volume'
                            placeholder='Enter volume'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('volume')}
                          />
                          {/* {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>} */}
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
                          <input
                            type='text'
                            id='depth'
                            placeholder='Enter depth in meters'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('depth')}
                          />
                          {/* {errors.depth && <p className='text-red-500 text-sm'>{errors.depth.message}</p>} */}
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
                          <input
                            type='text'
                            id='drainCount'
                            placeholder='Enter drain count'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('drainCount')}
                          />
                          {/* {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>} */}
                        </div>
                      </div>
                      <div className='mb-4 relative w-full'>
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
                          id='drainCount'
                          placeholder='Note'
                          className={`w-full h-32 p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          // {...register('drainCount')}
                        />
                        {/* {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>} */}
                      </div>
                    </form>
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
                    <form
                      // onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <div className='flex justify-between mb-5'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          onClick={() => {
                            // reset()
                            // setBaseImage(null)
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
                      <h3 className='mb-5 text-2xl font-bold'>Add a Log</h3>
                      <div className='grid grid-cols-2 grid-rows-3 gap-4'>
                        <div
                          id='imageSingle'
                          className='mb-6 col-span-1 row-span-2 h-full w-full flex rounded-lg  items-center justify-center border border-black'
                        >
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
                              // {...register('file')}
                              // onChange={handleImageChange}
                            />
                          </label>
                        </div>

                        {/* {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>} */}

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
                            id='name'
                            placeholder='Enter title'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black  rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('name')}
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
                            Date & time:
                          </label>
                          <input
                            type='datetime-local'
                            id='volume'
                            placeholder='Enter volume'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('volume')}
                          />
                          {/* {errors.volume && <p className='text-red-500 text-sm'>{errors.volume.message}</p>} */}
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
                          <input
                            type='text'
                            id='depth'
                            placeholder='Enter depth in meters'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('depth')}
                          />
                          {/* {errors.depth && <p className='text-red-500 text-sm'>{errors.depth.message}</p>} */}
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
                          <input
                            type='text'
                            id='drainCount'
                            placeholder='Enter drain count'
                            className={`w-full p-3 ${
                              isDarkMode ? 'bg-custom-dark' : 'bg-white'
                            } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                            // {...register('drainCount')}
                          />
                          {/* {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>} */}
                        </div>
                      </div>
                      <div className='mb-4 relative w-full'>
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
                          placeholder='Note'
                          className={`w-full h-32 p-3 ${
                            isDarkMode ? 'bg-custom-dark' : 'bg-white'
                          } border border-black rounded-lg focus:outline-none transition-colors duration-200`}
                          // {...register('drainCount')}
                        />
                        {/* {errors.drainCount && <p className='text-red-500 text-sm'>{errors.drainCount.message}</p>} */}
                      </div>
                    </form>

                    <div className='w-full flex flex-col justify-center'>
                      <button className='mx-auto' onClick={() => deleteLog(currentLog.logId)}>
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

export default MyPondLog
