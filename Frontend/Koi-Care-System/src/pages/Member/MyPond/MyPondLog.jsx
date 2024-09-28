import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'

function MyPondLog() {
  const { isDarkMode } = useDarkMode()
  const [log, setLog] = useState([])

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
              {log.map((logs) => (
                <div key={logs.logId} className='border border-gray-50 shadow-2xl rounded-xl p-4'>
                  <div className='flex justify-between'>
                    <div className='text-xl font-semibold'>{logs.logTitle}</div>
                    <div className='py-1 px-2 bg-blue-400 text-white rounded-xl'>{logs.category}</div>
                  </div>
                  <div className='flex justify-between'>
                    <div>
                      <div className='mt-3 text-lg'>{logs.koiPondName}</div>
                      <div>{formatDate(logs.logDate)}</div>
                      <div>{logs.note}</div>
                    </div>
                    <img src={logs.image} alt='' className='h-48' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPondLog
