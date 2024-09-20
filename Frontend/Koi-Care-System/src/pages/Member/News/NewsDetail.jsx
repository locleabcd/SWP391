import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import Header from '../../../components/Member/Header'
import { useDarkMode } from '../../../components/DarkModeContext'

function NewsDetail() {
  const [newDetail, setNewsDetail] = useState([])
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()

  const getBlogDetail = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koi-care-system.azurewebsites.net/api/blog/getID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setNewsDetail(res.data.data)
    } catch (error) {
      console.log('Error fetching blog detail:', error)
    }
  }

  useEffect(() => {
    getBlogDetail()
  }, [])

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${
          isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-200 text-black'
        } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='row'>
          <div className='col-lg-8'>
            <div className='blog-detail'>
              <div className='blog-detail-title'>
                <h1>{newDetail.blogTitle}</h1>
                <p>{newDetail.blogContent}</p>
              </div>
              <div className='blog-detail-content'>
                <img src={newDetail.blogImage} alt='blog' />
                <p className='font-semibold text-sm'>{newDetail.blogDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetail
