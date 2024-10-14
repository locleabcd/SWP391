import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { GiAquarium } from 'react-icons/gi'
import { IoFishOutline } from 'react-icons/io5'
import { IoIosWater } from 'react-icons/io'
import { LuAlarmClock } from 'react-icons/lu'
import { MdOutlinePayments } from 'react-icons/md'

function Dashboard() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])
  const [koi, setKoi] = useState([])
  const [parameters, setParameters] = useState([])
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/orders/user/${userId}/order`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(res.data.data)
    } catch (error) {
      console.error('Error fetching water parameters:', error)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const getParameter = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(
        `https://koicaresystemv3.azurewebsites.net/api/water-parameters/getByUserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setParameters(res.data.data)
    } catch (error) {
      console.error('Error fetching water parameters:', error)
    }
  }
  useEffect(() => {
    getParameter()
  }, [])

  const getKoi = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/koifishs/user/${id}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(res.data.data)
      setKoi(res.data.data)
    } catch (error) {
      console.error('Error fetching koi:', error)
    }
  }

  useEffect(() => {
    setKoi()
  }, [])

  useEffect(() => {
    getKoi()
  }, [])

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setPonds(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPond()
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

          <div className='py-5 px-[30px] mx-auto '>
            <TopLayout text='Dashboard' links='member/dashboard' />

            <div className='grid grid-cols-5 mt-10 px-2 gap-10'>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-yellow-100'>
                <GiAquarium className='size-20 p-5 rounded-full text-white bg-yellow-500' />
                <div className='text-2xl mt-3'>Ponds</div>
                <div className='text-2xl mt-1'>{ponds.length}</div>
              </div>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-gray-100'>
                <IoFishOutline className='size-20 p-5 rounded-full bg-blue-400 text-white' />
                <div className='text-2xl mt-3'>Koi</div>
                <div className='text-2xl mt-1'>{koi?.length}</div>
              </div>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-pink-100'>
                <IoIosWater className='size-20 p-5 rounded-full bg-pink-500 text-white' />
                <div className='text-2xl mt-3'>Parameters</div>
                <div className='text-2xl mt-1'>{parameters?.length}</div>
              </div>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-orange-100'>
                <LuAlarmClock className='size-20 p-5 rounded-full text-white bg-orange-500' />
                <div className='text-2xl mt-3'>Reminders</div>
                <div className='text-2xl mt-1'>0</div>
              </div>

              <div className='flex flex-col rounded-lg border border-gray-200 bg-green-100 items-center py-8 justify-center'>
                <MdOutlinePayments className='size-20 rounded-full text-white bg-green-500 p-5' />
                <div className='text-2xl mt-3'>Orders</div>
                <div className='text-2xl mt-1'>{orders?.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
