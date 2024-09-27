import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import HeaderAdmin from '../../../components/Admin/HeaderAdmin'
import LeftSideBarAdmin from '../../../components/Admin/LeftSideBarAdmin'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayout'
import { FaSpinner } from 'react-icons/fa'
import { useForm } from 'react-hook-form'

function News() {
    const { isDarkMode } = useDarkMode()
    const [blogs, setBlogs] = useState([])
    const [showButtons, setShowButtons] = useState(false)
    const [filterData, setFilterData] = useState([])
    const [setTags] = useState([])
    const [isAddFormVisible, setIsAddFormVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [baseImage, setBaseImage] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)


    const toggleAddFormVisibility = () => {
        setIsAddFormVisible(!isAddFormVisible)
        reset()
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

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
          // Append all fields to formData
          formData.append('blogTitle', data.blogTitle)
          formData.append('blogContent', data.blogContent)
          formData.append('blogImage', data.blogImage)
          formData.append('file', selectedFile);
          
          if (data.tagIds && Array.isArray(data.tagIds)) {
            data.tagIds.forEach(tagId => {
                formData.append('tagIds', tagId);
            });
        }
   
          const res = await axios.post(`https://koicaresystem.azurewebsites.net/api/blog/create`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          })
          setIsAddFormVisible(false)
          getBlog()
          reset()
        } catch (error) {
          console.log(error)
        } finally {
          setIsSubmitting(false)
          setIsLoading(false)
        }
      }

    const navigate = useNavigate()
  
    const toggleButtons = () => {
      setShowButtons(!showButtons)
    }

    const getTag = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            throw new Error('No token found')
          }
    
          const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/tag`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
    
          setTags(res.data.data)
          console.log(res.data.data)
        } catch (error) {
          console.log('Error fetching tags:', error)
        }
    }

    useEffect(() => {
        getTag()
      }, [])


  
    const getBlog = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }
  
        const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/blog`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
  
        setBlogs(res.data.data)
        console.log(res.data.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error('Unauthorized access - Token expired or invalid. Logging out...')
            localStorage.removeItem('token')
            localStorage.removeItem('id')
            toast.error('Token expired navigate to login')
            navigate('/login')
          } else {
            console.error('Error fetching blogs:', error.response?.status, error.message)
          }
        } else {
          console.error('An unexpected error occurred:', error)
        }
      }
    }
  
    useEffect(() => {
      getBlog()
    }, [])

    // useEffect(() => {
    //     fetch('https://koicaresystem.azurewebsites.net/api/blog/search').then((data) => {
    //       // setBlogs(data)
    //       // setFilterData(data)
    //     })
    //   })
  
    return (
      <div>
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='fixed bottom-7 right-5 text-lg hover:bg-blue-600  rounded-full shadow-lg size-12 cursor-pointer z-30'
            onClick={toggleAddFormVisibility}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
        </svg>

        <div className='h-screen flex'>
          <LeftSideBarAdmin />
  
          <div
            className={`relative ${
              isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
            } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
          >
            <HeaderAdmin />
            <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='News' />
              <div className='w-full flex justify-end relative'>
                <div className='search'>
                  <input type='text' placeholder='Search Here ...' />
                </div>
                <div className='cursor-pointer' onClick={toggleButtons}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8 mb-4 text-red-500'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M10.5 6h9.75M10.5 6a1.5 1.5 1 0-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 1 0-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
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
                      >
                        Sorted by Name (A-Z)
                      </button>
                      <button
                        className={`${
                          isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'
                        } btn py-2 px-4 rounded `}
                      >
                        Sorted by Name (Z-A)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className='py-3 grid grid-cols-3 gap-6 mt-2'>
                {blogs.map((blog, index) => (
                  <div
                    key={index}
                    className={`${
                      isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                    } mb-4 border rounded-lg shadow-sm`}
                  >
                    {/* <div className='flex border-b px-5 py-4 border-gray-300 items-center gap-2'>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzWqYhEAvpn3JMQViAxdbz4ZAM9wW1AfQMQ&s'
                      className='w-10 h-10 rounded-full border border-gray-300'
                    />
                    <div>
                      <p>{blog.user.username}</p>
                      <div className='flex justify-center items-center'>
                        {blog.tags.map((tag) => (
                          <span key={tag.tagId} className='text-sm font-semibold mr-1'>
                            {tag.tagName}
                          </span>
                        ))}
                        <p className='font-semibold text-sm'>
                          &bull;{' '}
                          {formatDistanceToNow(new Date(blog.blogDate), { addSuffix: true }).replace(/^about /, '')}
                        </p>
                      </div>
                    </div>
                  </div> */}
                    <Link to={`/admin/news/${blog.blogId}`}>
                      <div className='relative'>
                        <img
                          src={blog.blogImage}
                          alt={blog.blogTitle}
                          className='w-full h-72 object-cover relative rounded-t-lg'
                          style={{ objectFit: 'cover', filter: 'brightness(1.1) contrast(1.1)' }}
                        />
                        <img
                          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzWqYhEAvpn3JMQViAxdbz4ZAM9wW1AfQMQ&s'
                          className='w-12 h-12 absolute -bottom-[20px] left-8 rounded-full border border-gray-300'
                        />
                        
                      </div>
                      <div className='flex justify-center items-center'>
                        <div className='flex gap-2 justify-between items-center w-full mt-8 px-6'>
                          <div className='flex gap-3'>
                            {blog.tags?.map((tag) => (
                              <span
                                key={tag.tagId}
                                className='text-lg flex justify-start px-2 py-1 rounded-xl bg-gray-200'
                              >
                                {tag.tagName}
                              </span>
                            ))}
                          </div>

                          <p className='font-semibold text-sm'>
                            {formatDistanceToNow(new Date(blog.blogDate), { addSuffix: true }).replace(/^about /, '')}
                          </p>
                        </div>
                      </div>
  
                      <div className='mt-4 px-5 py-2'>
                        <h2 className='text-xl line-clamp-2'>{blog.blogTitle}</h2>
                      </div>
                    </Link>
  
                    <div className='p-3 flex w-full justify-between'>
                      <a className='cursor-pointer flex items-center justify-center p-2 bg-slate-100 flex-none text-black w-10 h-10 rounded-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-4'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z'
                          />
                        </svg>
                      </a>
  
                      <div className='flex gap-2'>
                        <a className='cursor-pointer flex items-center justify-center p-2 bg-blue-500 flex-none text-white w-10 h-10 rounded-full'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-4'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                            />
                          </svg>
                        </a>
                        <a className='cursor-pointer flex items-center justify-center p-2 bg-blue-500 flex-none text-white w-10 h-10 rounded-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-4'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                          />
                        </svg>
                      </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAddFormVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50 '>
          <div
            className='bg-white min-w-[100vh] mb-auto mt-auto p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto no-scroll-bar'>
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

              <h3 className='mb-5 text-2xl font-bold'>Add Blog</h3>
              <div className='grid grid-cols-2  gap-4'>
                <div id='file' className='mb-6 col-span-1 row-span-2 h-full flex justify-center border border-black'>
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
                        {...register('file', { required: 'image is required' })}
                        onChange={handleImageChange}
                      />
                      {errors.file && <p className='absolute text-red-500 text-md z-30'>{errors.file.message}</p>}
                    </label>
                  )}
                </div>

                <div className='relative col-span-1 '>
                  <label
                    htmlFor='blogTitle'
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                  >
                    BlogTitle
                  </label>
                  <input
                    type='text'
                    id='blogTitle'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('blogTitle', { required: 'BlogTitle is required' })}
                  />
                  {/* {errors.blogTitle && (
                    <p className='absolute -bottom-[-14px] left-3 text-red-500 text-sm'>{errors.blogTitle.message}</p>
                  )} */}
                </div>
                
                <div className='relative col-span-1 '>
                  <label
                    htmlFor='blogContent'
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                  >
                    Blog Content
                  </label>
                  <input
                    type='text'
                    id='blogContent'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('blogContent', { required: 'Blog Content is required' })}
                  />
                  {/* {errors.blogContent && (
                    <p className='absolute -bottom-[-14px] left-3 text-red-500 text-sm'>{errors.blogContent.message}</p>
                  )} */}
                </div>

                <div className='relative col-span-1 '>
                  <label
                    htmlFor='tagIds'
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                  >
                    Tag Id
                  </label>
                  <input
                    type='text'
                    id='tagIds'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('tagIds', { required: 'tagIds is required' })}
                  />
                  {/* {errors.tagIds && (
                    <p className='absolute -bottom-[-14px] left-3 text-red-500 text-sm'>{errors.tagIds.message}</p>
                  )} */}
                </div>

                

                
              </div>
            </form>
          </div>
        </div>
      )}


      </div>
    )
  }

export default News
