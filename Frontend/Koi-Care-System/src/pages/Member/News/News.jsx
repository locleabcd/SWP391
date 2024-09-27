import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayout'

function News() {
  const { isDarkMode } = useDarkMode()
  const [setTags] = useState([])
  const [blogs, setBlogs] = useState([])
  const [showButtons, setShowButtons] = useState(false)
  const [search, setSearch] = useState('')

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
          console.error('Error fetching ponds:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  const searchBlog = blogs.filter((blog) => blog.blogTitle.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    getTag()
  }, [])

  useEffect(() => {
    getBlog()
  }, [])

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='News' />

            <div className='w-full flex justify-between relative items-center'>
              <div className='flex relative justify-center items-center border border-gray-300 px-6 py-3  rounded-xl'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search Blog...'
                  className='pl-7 font-light outline-none text-lg'
                />
              </div>
              <div className='cursor-pointer mt-3' onClick={toggleButtons}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-10 h-10 mb-4 text-red-500'
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
            {searchBlog.length > 0 ? (
              <div className='py-3 grid grid-cols-3 gap-6 mt-2'>
                {searchBlog.map((blog, index) => (
                  <div
                    key={index}
                    className={`${
                      isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                    } mb-4 border rounded-lg shadow-sm  hover:scale-105 duration-200`}
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

                    <div className=''>
                      <Link to={`/member/news/${blog.blogId}`}>
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
                    </div>

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
                        <a className='cursor-pointer flex items-center justify-center p-2 bg-slate-200 flex-none text-blue w-10 h-10 rounded-full'>
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
                              d='M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z'
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
            ) : (
              <div className='text-center text-gray-500 text-lg mt-10'>No Blog found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default News