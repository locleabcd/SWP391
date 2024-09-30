import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import TopLayout from '../../../layouts/TopLayout'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar
} from 'recharts'

function Statistics() {
  const { isDarkMode } = useDarkMode()
  const [water, setWater] = useState([])
  const [ponds, setPonds] = useState([])
  const navigate = useNavigate()
  const [selectedPond, setSelectedPond] = useState(null)
  const [dateFilter, setDateFilter] = useState('Day')
  const [opacity, setOpacity] = useState({
    nitrite: 1,
    nitrate: 1,
    phosphate: 1,
    ammonium: 1,
    oxygen: 1,
    carbonHardness: 1,
    phValue: 1,
    hardness: 1,
    totalChlorine: 1,
    carbonDioxide: 1,
    temperature: 1,
    temp: 1,
    amountFed: 1
  })

  const handlePondChange = (e) => {
    const pondId = e.target.value
    localStorage.setItem('pondId', pondId)
    const pond = ponds.find((p) => p.id === parseInt(pondId))

    if (pond) {
      setSelectedPond(pond)
      getWater()
    } else {
      setSelectedPond(null)
    }
  }

  useEffect(() => {
    if (ponds.length === 1) {
      setSelectedPond(ponds[0])
    }
  }, [ponds])

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setPonds(res.data.data)
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
    getPond()
  }, [])

  const getWater = async () => {
    try {
      const token = localStorage.getItem('token')
      const koiPondId = localStorage.getItem('pondId')

      const res = await axios.get(
        `https://koicaresystem.azurewebsites.net/api/water-parameters/getByKoiPondId/${koiPondId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setWater(res.data.data)
      console.log(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getWater()
  }, [])

  const handleMouseEnter = useCallback(
    (o) => {
      const { dataKey } = o
      setOpacity({ ...opacity, [dataKey]: 0.5 })
    },
    [opacity, setOpacity]
  )

  const handleMouseLeave = useCallback(
    (o) => {
      const { dataKey } = o
      setOpacity({ ...opacity, [dataKey]: 1 })
    },
    [opacity, setOpacity]
  )

  const formatDate = (date) => {
    const parsedDate = new Date(date)
    if (dateFilter === 'Day') {
      return parsedDate.toLocaleString() // Full date and time
    } else if (dateFilter === 'Last month') {
      return parsedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) // Month and year
    } else if (dateFilter === 'Last year') {
      return parsedDate.getFullYear() // Year only
    }
  }

  // Aggregate water data based on the selected filter (group by day, month, or year)
  const aggregateWaterData = (data) => {
    const dateMap = {}

    data.forEach((entry) => {
      const date = formatDate(entry.createDateTime)

      if (!dateMap[date]) {
        dateMap[date] = {
          name: date,
          nitrite: 0,
          nitrate: 0,
          phosphate: 0,
          carbonHardness: 0,
          phValue: 0,
          hardness: 0,
          count: 0,
          totalChlorine: 0,
          oxygen: 0,
          carbonDioxide: 0,
          temperature: 0,
          temp: 0,
          amountFed: 0
        }
      }

      dateMap[date].nitrite += entry.nitrite
      dateMap[date].nitrate += entry.nitrate
      dateMap[date].oxygen += entry.oxygen
      dateMap[date].carbonDioxide += entry.carbonDioxide
      dateMap[date].totalChlorine += entry.totalChlorine
      dateMap[date].phosphate += entry.phosphate
      dateMap[date].carbonHardness += entry.carbonHardness
      dateMap[date].phValue += entry.phValue
      dateMap[date].hardness += entry.hardness
      dateMap[date].temp += entry.temp
      dateMap[date].temperature += entry.temperature
      dateMap[date].amountFed += entry.amountFed
      dateMap[date].count += 1
    })

    return Object.values(dateMap).map((entry) => ({
      name: entry.name,
      nitrite: entry.nitrite / entry.count,
      nitrate: entry.nitrate / entry.count,
      phosphate: entry.phosphate / entry.count,
      carbonHardness: entry.carbonHardness / entry.count,
      phValue: entry.phValue / entry.count,
      hardness: entry.hardness / entry.count,
      totalChlorine: entry.totalChlorine / entry.count,
      oxygen: entry.oxygen / entry.count,
      carbonDioxide: entry.carbonDioxide / entry.count,
      temperature: entry.temperature / entry.count,
      temp: entry.temp / entry.count,
      amountFed: entry.amountFed / entry.count
    }))
  }

  // Event handler for changing the time filter (Day, Month, Year)
  const handleFilterChange = (e) => {
    setDateFilter(e.target.value)
  }

  const sortedWaterData = aggregateWaterData(
    [...water].sort((a, b) => new Date(a.createDateTime) - new Date(b.createDateTime))
  )

  const formatTooltipValue = (value) => {
    return value ? value.toFixed(2) : value
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
            <TopLayout text='Statistics' links='member/statistics' />

            <div className='p-4 text-lg flex justify-between items-center'>
              <select id='ponds' className='border rounded p-2' onChange={handlePondChange}>
                {ponds.length > 0 ? (
                  ponds.map((pond) => (
                    <option key={pond.id} value={pond.id}>
                      {pond.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading ponds...</option>
                )}
              </select>

              <select onChange={handleFilterChange} className='border rounded p-2 outline-none'>
                <option value='Day'>Day</option>
                <option value='Last month'>Last month</option>
                <option value='Last year'>Last year</option>
              </select>
            </div>

            <div className='grid grid-cols-3 gap-7'>
              <div className='border py-5 px-6 border-gray-200 shadow-lg'>
                <div className='text-xl mb-4 text-center'>Nitrite - Phosphate - Ammonium (mg/l)</div>
                <LineChart
                  width={400}
                  height={300}
                  data={sortedWaterData}
                  margin={{
                    top: 5,
                    right: 30
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip formatter={(value) => formatTooltipValue(value)} />
                  <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                  <Line
                    type='monotone'
                    dataKey='nitrite'
                    strokeOpacity={opacity.nitrite}
                    stroke='#8884d8'
                    activeDot={{ r: 6, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='phosphate'
                    strokeOpacity={opacity.phosphate}
                    stroke='#ff7300'
                    activeDot={{ r: 6, fill: '#ff7300', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='totalChlorine'
                    strokeOpacity={opacity.totalChlorine}
                    stroke='#387908'
                    activeDot={{ r: 6, fill: '#387908', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </div>
              <div className='py-5 px-6 border border-gray-200 shadow-lg'>
                <div className='text-xl mb-4 text-center'>Carbon - PH - Hardness (dH)</div>
                <LineChart
                  width={400}
                  height={300}
                  data={sortedWaterData}
                  margin={{
                    top: 5,
                    right: 30
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip formatter={(value) => formatTooltipValue(value)} />
                  <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                  <Line
                    type='monotone'
                    dataKey='carbonHardness'
                    strokeOpacity={opacity.carbonHardness}
                    stroke='#8884d8'
                    activeDot={{ r: 6, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='phValue'
                    strokeOpacity={opacity.phValue}
                    stroke='#82ca9d'
                    activeDot={{ r: 6, fill: '#82ca9d', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='hardness'
                    strokeOpacity={opacity.hardness}
                    stroke='#ff7300'
                    activeDot={{ r: 6, fill: '#ff7300', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </div>
              <div className='py-5 px-6 border border-gray-200 shadow-lg'>
                <div className='text-xl mb-4 text-center'>Temperature - Temp (C)</div>
                <LineChart
                  width={400}
                  height={300}
                  data={sortedWaterData}
                  margin={{
                    top: 5,
                    right: 30
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                  <Line
                    type='monotone'
                    dataKey='temperature'
                    strokeOpacity={opacity.temperature}
                    stroke='#8884d8'
                    activeDot={{ r: 6, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='temp'
                    strokeOpacity={opacity.temp}
                    stroke='#82ca9d'
                    activeDot={{ r: 6, fill: '#82ca9d', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-7 mt-10'>
              <div className='py-5 px-2 border border-gray-200 shadow-lg'>
                <div className='text-xl mb-4 text-center'>CO₂ - O₂ - Total Chlorine (mg/l)</div>
                <ResponsiveContainer width='100%' height={300}>
                  <AreaChart
                    data={sortedWaterData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip formatter={(value) => formatTooltipValue(value)} />
                    <Area type='monotone' dataKey='nitrate' stackId='1' stroke='#ff7300' fill='#ff7300' />
                    <Area type='monotone' dataKey='carbonDioxide' stackId='1' stroke='#8884d8' fill='#8884d8' />
                    <Area type='monotone' dataKey='oxygen' stackId='1' stroke='#82ca9d' fill='#82ca9d' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className='py-5 px-2 border border-gray-200 shadow-lg'>
                <div className='text-xl mb-4 text-center'>Amount fed (g)</div>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={sortedWaterData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='amountFed' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
