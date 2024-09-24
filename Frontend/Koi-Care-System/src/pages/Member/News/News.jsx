import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

function News() {
  const { isDarkMode } = useDarkMode()
  const [setTags] = useState([])
  const [blogs, setBlogs] = useState([])

  const getTag = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koi-care-system.azurewebsites.net/api/tag`, {
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

      const res = await axios.get(`https://koi-care-system.azurewebsites.net/api/blog`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBlogs(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching blog:', error)
    }
  }

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
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-200 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='px-4 py-2 grid grid-cols-3 gap-6 mt-2'>
            {blogs.map((blog, index) => (
              <div
                key={index}
                className={`${
                  isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                } mb-4 border rounded-lg shadow-sm`}
              >
                <div className='flex border-b px-5 py-4 border-gray-300 items-center gap-2'>
                  <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzWqYhEAvpn3JMQViAxdbz4ZAM9wW1AfQMQ&s'
                    className='w-10 h-10 rounded-full border border-gray-300'
                  />
                  <div>
                    <p>{blog.user.username}</p>
                    <div className='flex justify-center items-center'>
                      {blog.tags.map((tag) => (
                        <span key={tag.tagId} className='text-sm font-semibold text-gray-700 mr-1'>
                          {tag.tagName}
                        </span>
                      ))}
                      <p className='font-semibold text-sm'>
                        &bull;{' '}
                        {formatDistanceToNow(new Date(blog.blogDate), { addSuffix: true }).replace(/^about /, '')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='p-5 border-b border-gray-300'>
                  <Link to={`/member/news/${blog.blogId}`}>
                    <img src={blog.blogImage} alt={blog.blogTitle} className='w-full h-44 object-cover rounded-md' />
                    <div className='mt-4'>
                      <h2 className='text-xl font-bold'>{blog.blogTitle}</h2>
                      <p className='line-clamp-3 text-justify mt-4 tracking-tighter'>{blog.blogContent}</p>
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
        </div>
      </div>
    </div>
  )
}

export default News