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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Dashboard() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])
  const [koi, setKoi] = useState([])
  const [parameters, setParameters] = useState([])
  const [orders, setOrders] = useState([])
  const [report, setReport] = useState([])
  const [payment, setPayment] = useState([])
  const [selectedorder, setSelectedOrder] = useState(null)

  const getPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/payment/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPayment(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.error('Error fetching water parameters:', error)
    }
  }

  useEffect(() => {
    getPayments()
  }, [])

  function getSurroundingDates() {
    const currentDate = new Date()

    const dates = []
    for (let i = -3; i <= 3; i++) {
      const tempDate = new Date(currentDate)
      tempDate.setDate(currentDate.getDate() + i)
      const formattedDate = tempDate.toISOString().slice(0, 10)
      dates.push(formattedDate)
    }

    return dates
  }

  const getReport = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      const surroundingDates = getSurroundingDates()
      const allReports = []

      for (const date of surroundingDates) {
        const res = await axios.get('https://koicaresystemv3.azurewebsites.net/api/reports/FishPondWater', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            userId: userId,
            date: date
          }
        })

        allReports.push({
          date: date,
          koiFishs: res.data.data.koiFishs?.length,
          koiPonds: res.data.data.koiPonds?.length,
          waterParameters: res.data.data.waterParameters?.length
        })
      }
      setReport(allReports)
    } catch (error) {
      console.error('Error fetching water parameters:', error)
    }
  }

  useEffect(() => {
    getReport()
  }, [])

  const getOrders = async (orderId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/orders/${orderId}/order`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(res.data.data)
      console.log(res.data.data)
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
      setPonds(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPond()
  }, [])

  const date = payment.map((payments) => payments.createDate.slice(0, 10))

  const handleChange = (e) => {
    const orderId = e.target.value
    const order = orders.find((p) => p.id === parseInt(orderId))

    if (order) {
      setSelectedOrder(order)
      getOrders(orderId)
    }
  }

  useEffect(() => {
    if (orders.length === 1) {
      setSelectedOrder(ponds[0])
    }
  }, [orders])

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

            <div className='mt-10 py-5 px-2 border border-gray-200'>
              <h3 className='text-center text-2xl mb-6'>Report Overview</h3>
              <ResponsiveContainer width='100%' height={600}>
                <BarChart data={report} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='koiFishs' fill='#8884d8' />
                  <Bar dataKey='koiPonds' fill='#82ca9d' />
                  <Bar dataKey='waterParameters' fill='#ffc658' />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className='mt-10 flex gap-14'>
              <div className='flex-none border border-gray-200 w-[550px] px-14 py-6'>
                <div className='text-2xl font-semibold mb-3'>Recent Transaction</div>
                <div className='flex flex-col '>
                  {payment.map((payments, index) => (
                    <div className='flex gap-7 mt-4' key={payments.orderId}>
                      <div className='flex'>{date[index]}</div>
                      <div className='flex flex-col gap-3 items-center'>
                        {index === 0 && <span className='size-6 border-4 border-blue-500 rounded-full' />}
                        {index === 1 && <span className='size-6 border-4 border-purple-500 rounded-full' />}
                        {index === 2 && <span className='size-6 border-4 border-red-500 rounded-full' />}
                        {index === 3 && <span className='size-6 border-4 border-green-500 rounded-full' />}
                        {index === 4 && <span className='size-6 border-4 border-purple-500 rounded-full' />}

                        {index !== payment.length - 1 && <span className='w-0.5 h-12 bg-gray-300' />}
                      </div>
                      <div className='flex flex-col'>
                        <div className=''>Transaction Code: {payments.transactionCode}</div>
                        <div className=''>
                          Amount:{' '}
                          {(payments?.amount ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex-auto border border-gray-200 px-5 py-6'>
                <div className='flex justify-between'>
                  <div className='text-2xl font-semibold'>Payment Details</div>
                  <select className='text-xl' onChange={handleChange}>
                    <option value=''>Transaction Code</option>
                    {payment.map((payments) => (
                      <option key={payments.orderId} value={payments.orderId}>
                        {payments.transactionCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
