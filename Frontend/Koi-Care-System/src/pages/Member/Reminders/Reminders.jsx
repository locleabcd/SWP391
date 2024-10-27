import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import '../../../index.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Reminders() {
  const { isDarkMode } = useDarkMode()
  const [reminders, setReminders] = useState([])

  const getReminders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('https://koicaresystemv4.azurewebsites.net/api/reminders/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setReminders(res.data.data)
      console.log(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getReminders()
  }, [])

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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px] max-h-[800px]'>
            <TopLayout text='Reminders' links='/member/reminders' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reminders
