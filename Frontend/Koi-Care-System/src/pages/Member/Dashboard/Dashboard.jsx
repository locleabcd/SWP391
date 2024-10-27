/* eslint-disable no-unused-vars */
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

      const res = await axios.get(`http://146.190.84.154:8080/api/payment/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const topPayments = res.data.data.slice(0, 5)
      setPayment(topPayments)
      console.log(topPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
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
        const res = await axios.get('http://146.190.84.154:8080/api/reports/FishPondWater', {
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
      const res = await axios.get(`http://146.190.84.154:8080/api/orders/${orderId}/order`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(res.data.data.items)
      console.log(res.data.data.items)
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
      const res = await axios.get(`http://146.190.84.154:8080/api/water-parameters/getByUserId/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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

      const res = await axios.get(`http://146.190.84.154:8080/api/koifishs/user/${id}/allKoi`, {
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
      const res = await axios.get(`http://146.190.84.154:8080/api/koiponds/user/${id}/koiponds`, {
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

  useEffect(() => {
    if (orders.length === 1) {
      setSelectedOrder(ponds[0])
    }
  }, [orders])

  const handleChange = (e) => {
    const orderId = e.target.value
    setSelectedOrder(orderId)
    getOrders(orderId)
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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px] '>
            <TopLayout text='Dashboard' links='member/dashboard' />

            <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 mt-10 px-2 gap-10'>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-yellow-100'>
                <GiAquarium
                  className={`size-20 p-5 rounded-full ${isDarkMode ? 'text-black' : 'text-white'} bg-yellow-500`}
                />
                <div className={`${isDarkMode ? 'text-black' : ''} text-2xl mt-3`}>Ponds</div>
                <div className={`text-2xl mt-1 ${isDarkMode ? 'text-black' : ''}`}>{ponds.length}</div>
              </div>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-gray-100'>
                <IoFishOutline className='size-20 p-5 rounded-full bg-blue-400 text-white' />
                <div className={`${isDarkMode ? 'text-black' : ''} text-2xl mt-3`}>Koi</div>
                <div className={`text-2xl mt-1 ${isDarkMode ? 'text-black' : ''}`}>{koi?.length}</div>
              </div>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-pink-100'>
                <IoIosWater className='size-20 p-5 rounded-full bg-pink-500 text-white' />
                <div className={`${isDarkMode ? 'text-black' : ''} text-2xl mt-3`}>Parameters</div>
                <div className={`text-2xl mt-1 ${isDarkMode ? 'text-black' : ''}`}>{parameters?.length}</div>
              </div>
              <div className='flex flex-col rounded-lg items-center py-8 justify-center bg-orange-100'>
                <LuAlarmClock className='size-20 p-5 rounded-full text-white bg-orange-500' />
                <div className={`${isDarkMode ? 'text-black' : ''} text-2xl mt-3`}>Reminders</div>
                <div className={`text-2xl mt-1 ${isDarkMode ? 'text-black' : ''}`}>0</div>
              </div>

              <div className='flex flex-col rounded-lg border border-gray-200 bg-green-100 items-center py-8 justify-center'>
                <MdOutlinePayments className='size-20 rounded-full text-white bg-green-500 p-5' />
                <div className={`${isDarkMode ? 'text-black' : ''} text-2xl mt-3`}>Orders</div>
                <div className={`text-2xl mt-1 ${isDarkMode ? 'text-black' : ''}`}>{orders?.length}</div>
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

            <div className='mt-10 grid lg:grid-cols-7 grid-cols-1 gap-14'>
              <div className='lg:col-span-3 border border-gray-200 px-6 py-6'>
                <div className='lg:text-2xl text-lg font-semibold mb-3'>Recent Transaction</div>
                <div className='flex justify-center flex-col lg:px-10 px-5'>
                  {payment.map((payments, index) => (
                    <div className='flex lg:gap-7 gap-3 mt-4' key={payments.orderId}>
                      <div className='flex lg:text-lg text-sm'>{date[index]}</div>
                      <div className='flex flex-col gap-3 items-center'>
                        {index === 0 && <span className='size-6 border-4 border-blue-500 rounded-full' />}
                        {index === 1 && <span className='size-6 border-4 border-purple-500 rounded-full' />}
                        {index === 2 && <span className='size-6 border-4 border-red-500 rounded-full' />}
                        {index === 3 && <span className='size-6 border-4 border-green-500 rounded-full' />}
                        {index === 4 && <span className='size-6 border-4 border-purple-500 rounded-full' />}
                        {index !== payment.slice(0, 5).length - 1 && <span className='w-0.5 h-12 bg-gray-300' />}
                      </div>
                      <div className='flex flex-col'>
                        <div className='lg:text-lg text-xs'>Transaction Code: {payments.transactionCode}</div>
                        <div className='lg:text-lg text-xs'>
                          Amount:{' '}
                          {(payments?.amount ?? 0).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='lg:col-span-4 border border-gray-200 px-5 py-6'>
                <div className='flex flex-col items gap-4 lg:flex-row justify-between'>
                  <div className='lg:text-2xl text-xl font-semibold'>Payment Details</div>
                  <select
                    className={`${isDarkMode ? 'bg-custom-dark' : 'bg-white'} lg:text-xl text-base border lg:p-3 px-3 py-2 border-gray-200 rounded-lg`}
                    onChange={handleChange}
                  >
                    <option value=''>Transaction Code</option>
                    {payment.map((payments) => (
                      <option key={payments.orderId} value={payments.orderId}>
                        {payments.transactionCode}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mt-10'>
                  <table className='min-w-full'>
                    <thead className=''>
                      <tr className=''>
                        <th
                          scope='col'
                          className='px-8 py-3 text-start text-gray-500 lg:text-xl text-basefont-bold uppercase tracking-wider'
                        >
                          Product
                        </th>

                        <th
                          scope='col'
                          className='lg:inline-block hidden px-6 py-3 text-start text-xl font-bold text-gray-500 uppercase tracking-wider'
                        >
                          Quantity
                        </th>
                        <th
                          scope='col'
                          className='lg:inline-block hidden px-6 py-3 text-start text-xl font-bold text-gray-500 uppercase tracking-wider'
                        >
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {orders.map((order) => (
                        <tr className='' key={order.productId}>
                          <td className='px-6 py-4 text-center whitespace-nowrap flex gap-5'>
                            <div className=''>
                              <img
                                src={order.imageUrl}
                                alt=''
                                className='mx-auto lg:w-[120px] lg:h-[120px] w-[90px] h-[90px] rounded-lg border border-gray-200'
                              />
                            </div>
                            <div className='flex flex-col lg:m-0 justify-start items-start'>
                              <div className='text-start sm:text-wrap font-semibold lg:text-xl text-base sm:w-40 lg:border-none border-r border-gray-200'>
                                {order.productName}
                              </div>
                              <div className='mt-2 lg:text-xl text-xs'>{order.category}</div>
                            </div>
                          </td>

                          <td className='px-6 py-4 text-center whitespace-nowrap'>
                            <div className='lg:flex hidden gap-5 items-center justify-start w-full'>
                              <div className='text-xl'>{order.quantity}</div>
                            </div>
                          </td>

                          <td className='px-6 py-4 lg:flex hidden text-xl text-start whitespace-nowrap'>
                            {order.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
      </div>
    </div>
  )
}

export default Dashboard
