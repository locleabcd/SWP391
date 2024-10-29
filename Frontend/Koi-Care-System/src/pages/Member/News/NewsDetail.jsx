import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import Header from '../../../components/Member/Header'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayout'

function NewsDetail() {
  const [newDetail, setNewsDetail] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const getBlogDetail = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/blog/getID/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setNewsDetail(res.data.data)
      const userId = res.data.data.user.id // Lấy userId từ chi tiết bài viết

      // Gọi hàm lấy thông tin profile với userId
      getProfile(userId)
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
  const getProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUserProfile(res.data.data) // Lưu thông tin profile của user vào state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - Token expired or invalid. Logging out...')
          localStorage.removeItem('token')
          localStorage.removeItem('id')
          toast.error('Token expired navigate to login')
          navigate('/login')
        } else {
          console.error('Error fetching profile:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  useEffect(() => {
    getBlogDetail()
    getProfile()
  }, [])

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
        } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
          <TopLayout text='News' textName='News Detail' links='member/news' />
          <div className=' flex flex-col justify-center items-center border border-gray-200'>
            <div
              className={`${
                isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
              } shadow-sm rounded-lg w-full`}
            >
              <img
                src={newDetail.blogImage}
                alt='blog'
                className='lg:h-[70vh] h-[50vh] w-full object-cover rounded-lg'
                style={{ objectFit: 'cover', filter: 'brightness(1.1) contrast(1.1)' }}
              />
            </div>
            <div className='flex gap-2 justify-start w-full mt-10 mb-10 px-6'>
              {newDetail.tags?.map((tag) => (
                <span
                  key={tag.tagId}
                  className={`lg:text-lg text-sm  px-2 py-1 rounded-xl ${
                    isDarkMode ? 'bg-custom-layout-dark' : 'bg-custom-layout-light'
                  } `}
                >
                  {tag.tagName}
                </span>
              ))}
            </div>
            <h1 className='lg:text-3xl text-xl font-semibold text-justify flex justify-start px-6'>
              {newDetail.blogTitle}
            </h1>
            <div className='flex items-center mt-5'>
              <div>
                <p className='lg:text-xl text-sm'> {newDetail.blogDate}</p>
              </div>
            </div>
            <div className='w-full mt-5 '>
              <div className='py-5 flex w-full justify-between border-b border-gray-300 px-6'>
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

                <div className='flex gap-2 '>
                  <a className='cursor-pointer flex items-center justify-center p-2 bg-slate-100 text-black flex-none text-blue w-10 h-10 rounded-full'>
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

              <p className='py-5 indent-8 lg:text-lg text-sm text-justify px-6'>{newDetail.blogContent}</p>
              <p className='py-5 border-b lg:text-lg text-sm border-gray-300 indent-8 text-justify px-6'>
                Koi fish are longer so they are less suitable for aquariums and more suitable for ponds. Goldfish with
                their shorter size are more compatible for aquariums though they live well in ponds as well. Koi fish
                are bred to look beautiful when being seen from the top because they are intended as pond fish. Earlier
                goldfish were bred as pond fish but they were later bred to look beautiful from side view because they
                are meant to be kept in aquarium. Most types of fancy goldfish have abnormal body structure that make
                them prone to get swim bladder disease while none of the koi bred have this abnormality. Both are carps
                but belong to different species. Both specieses can produce hybrid offsprings but the offsprings are
                infertile/sterile (Unable to reproduce.). Both fish can live together with no problem. Koi will migrate
                significant distances to reach their preferred spawning grounds — flooded meadows and stagnant marshy
                areas. The breeding season is in the spring, around May or June. Females reproduce for the first time
                when they are between 4 and 6 years old, males when they are between 3 and 5 years old. Once they reach
                sexual maturity, they will breed every year. They attach their sticky eggs to water plants or any object
                submerged in the water. The young hatch as larvae and stay in warm, shallow flooded areas until they are
                large enough to brave more open waterways.
              </p>

              <div className='flex border-b py-4 border-gray-300 items-center gap-2 px-6'>
                <img
                  src={userProfile?.avatar || 'default-avatar.png'}
                  alt='Author Avatar'
                  className='w-10 h-10 rounded-full border border-gray-300'
                />
                <div className='w-full'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-end'>
                      <p>{newDetail?.user?.username}</p>
                    </div>

                    <div className='lg:flex items-center mt-5 sm:ml-auto sm:mt-0 hidden'>
                      Share this post:
                      <a
                        className='cursor-pointer flex items-center justify-center w-8 h-8 ml-2 border rounded-full sm:w-10 sm:h-10 dark:border-darkmode-400 text-slate-400 zoom-in'
                        href
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='lucide lucide-facebook-icon stroke-1.5 w-3 h-3 fill-current '
                        >
                          <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                        </svg>
                      </a>
                      <a
                        className='cursor-pointer flex items-center justify-center w-8 h-8 ml-2 border rounded-full sm:w-10 sm:h-10 dark:border-darkmode-400 text-slate-400 zoom-in'
                        href
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='lucide lucide-twitter-icon stroke-1.5 w-3 h-3 fill-current '
                        >
                          <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                        </svg>
                      </a>
                      <a
                        className='cursor-pointer flex items-center justify-center w-8 h-8 ml-2 border rounded-full sm:w-10 sm:h-10 dark:border-darkmode-400 text-slate-400 zoom-in'
                        href
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='lucide lucide-linkedin-icon stroke-1.5 w-3 h-3 fill-current '
                        >
                          <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                          <rect width={4} height={12} x={2} y={9} />
                          <circle cx={4} cy={4} r={2} />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetail
