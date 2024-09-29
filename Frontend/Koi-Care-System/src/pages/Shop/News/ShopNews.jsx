import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayout'

function ShopNews() {
  const { isDarkMode } = useDarkMode()
  const [setTags] = useState([])
  const [blogs, setBlogs] = useState([])
  const [showButtons, setShowButtons] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    getTag()
  }, [])

  useEffect(() => {
    getBlog()
  }, [])

  const deleteBlog = async (blogId) => {
    const isConfirmed = window.confirm('Are you sure to delete blog')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystem.azurewebsites.net/api/blog/delete/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Blog deleted successfully')
      getBlog()
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setIsLoading(false)
    }
  }

    return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div className={`relative ${
            isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
          } overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}>
          <Header />
          <div className='py-5 px-[30px] mx-auto '>
            <TopLayout text='News' />
            <div className='w-full flex justify-between items-center relative'>
              <div className='cursor-pointer'>
                <button 
                  className='py-2 px-3 bg-custom-left-bar text-white hover:bg-blue-600 rounded-md'
                  onClick={() => navigate('/shop/createNews')}
                  >
                    New Blog
                </button>
              </div>
              <div className='flex items-center'>
                <div className='search p-2 border rounded-md mr-4'>
                  <input type='text'  />
                </div>
                <div className='cursor-pointer'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8  text-red-500'
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
              
              
            </div>
            {/* Blog Table */}
            <div className='overflow-x-auto mt-6'>
              <table className='min-w-full bg-white border-spacing-x-1 border-gray-200'>
                <thead className='border-gray-200'>
                  <tr>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                       ID
                    </th>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                      Image
                    </th>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                      Title
                    </th>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                      Content
                    </th>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                      Tags
                    </th>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                      Date
                    </th>
                    <th className='py-3 px-5 text-left text-xs font-bold text-black uppercase'>
                      Action
                    </th>

                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.blogId}>
                      <td className='py-2 px-3 border-b border-gray-200'>{blog.blogId}</td>
                      <td className='py-2 px-3 border-b border-gray-200'>
                        <img
                          src={blog.blogImage}
                          alt='Blog'
                          className='w-40 h-20 object-cover rounded-md'
                        />
                      </td>
                      <td className='py-2 px-3 border-b border-gray-200'>
                        {blog.blogTitle}
                      </td>
                      <td className='py-2 px-3 border-b border-gray-200'>
                        {blog.blogContent.substring(0, 100)}...
                      </td>
                      <td className='py-2 px-3 border-b border-gray-200'>
                        {blog.tags?.map((tag) => (
                          <span
                            key={tag.tagId}
                            className='bg-blue-200 text-blue-800 py-2 px-3 rounded-full text-xs mr-2'
                          >
                            {tag.tagName}
                          </span>
                        ))}
                      </td>
                      <td className='py-2 px-3 border-b border-gray-200 text-nowrap'>{blog.blogDate}</td>
                      <td className='py-2 px-3 border-b border-gray-200'>
                        <div className='flex justify-center items-center'>
                          <Link to={`/shop/shopNews/update/${blog.blogId}`} className=' p-1 hover:bg-green-500 text-green-500 hover:text-white  rounded-full'>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="currentColor" 
                              className="size-5   ">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 
                              2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 
                              2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" 
                            />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 
                              3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 
                              1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                            />
                            </svg>
                          </Link>

                          <Link to={`/shop/shopNews/${blog.blogId} `} className=' p-1 hover:bg-blue-500 text-blue-500 hover:text-white  rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 ">
                              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                            </svg>
                          </Link>

                          <button className=' p-1 hover:bg-red-500 text-red-600 hover:text-white  rounded-full' onClick={() => deleteBlog(blog.blogId)}>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="currentColor" 
                              className="size-5 ">
                              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>             
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>           
          </div>
        </div>
      </div>
      
    </div>
    )
  }
  
  export default ShopNews