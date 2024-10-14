import { useDarkMode } from '../../hooks/DarkModeContext'
import Header from '../../components/Member/Header'
import LeftSideBar from '../../components/Member/LeftSideBar'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

function Member() {
  const { isDarkMode } = useDarkMode()
  const [searchParams] = useParams()
  const token = searchParams.get('token')
  useEffect(() => {
    localStorage.setItem('token', token)
  }, [])

  return (
    <div>
      {/* member page */}
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
        </div>
      </div>
    </div>
  )
}

export default Member
