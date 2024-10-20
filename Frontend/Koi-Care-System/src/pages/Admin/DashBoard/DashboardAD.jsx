/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutAD'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { FaRegUser } from 'react-icons/fa'
import { FaMoneyCheckAlt } from 'react-icons/fa'
import { FaCartArrowDown } from 'react-icons/fa'
import { FaProductHunt } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'
import { FaNewspaper } from 'react-icons/fa6'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import dayjs from 'dayjs'

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(36 48 63 / var(--tw-bg-opacity))',
      paper: 'rgb(36 48 63 / var(--tw-bg-opacity))'
    }
  }
})

function DashboardAD() {
  const [premier, setPremier] = useState([])
  const [monthlyTotals, setMonthlyTotals] = useState({ labels: [], data: [] })
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0)
  const [previousTotal, setPreviousTotal] = useState(0) // Giá trị tổng thanh toán của tháng trước
  const [percentageChange, setPercentageChange] = useState(0) // Phần trăm thay đổi
  const [lineChartData, setLineChartData] = useState([])
  const [todayOrders, setTodayOrders] = useState(0) // State lưu số lượng đơn hàng hôm nay
  const [todayTotalAmount, setTodayTotalAmount] = useState(0) // State lưu tổng số tiền hôm nay
  const { isDarkMode } = useDarkMode()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [usersData, setUsersData] = useState([])
  const [blogs, setBlogs] = useState([])
  const [payments, setPayments] = useState([])
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const formatCurrency = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'
  const [view, setView] = useState('day')
  const getUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/profile/all/member`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Grouping users by createdDate
      const groupedData = {}
      res.data.data.forEach((user) => {
        const date = user.createdDate
        if (!groupedData[date]) {
          groupedData[date] = { date, users: 0, usersPremium: 0 }
        }
        groupedData[date].users += 1
        if (user.status === 'PREMIUM') {
          groupedData[date].usersPremium += 1
        }
      })

      const chartData = Object.values(groupedData)
      setUsersData(chartData)
      setUsers(res.data.data)
    } catch (error) {
      console.log('Error fetching users:', error)
    }
  }

  const getOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const orders = res.data.data

      setOrders(orders)
      // Tạo dữ liệu cho 7 ngày gần nhất
      const today = dayjs()
      const recent7Days = []

      for (let i = 0; i < 7; i++) {
        const currentDate = today.subtract(i, 'day').format('YYYY-MM-DD')
        const ordersForDay = orders.filter((order) => dayjs(order.orderDate).format('YYYY-MM-DD') === currentDate)
        const totalAmount = ordersForDay.reduce((sum, order) => sum + order.totalAmount, 0)
        recent7Days.unshift({ name: `Day ${7 - i}`, value: totalAmount })
      }

      setLineChartData(recent7Days) // Cập nhật state cho biểu đồ
    } catch (error) {
      console.log('Error fetching Orders:', error)
    }
  }
  const getTodayOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const today = dayjs().format('YYYY-MM-DD') // Lấy ngày hiện tại

      const todayOrdersData = res.data.data.filter((order) => dayjs(order.orderDate).format('YYYY-MM-DD') === today)

      const totalOrders = todayOrdersData.length
      const totalAmount = todayOrdersData.reduce((sum, order) => sum + order.totalAmount, 0)

      setTodayOrders(totalOrders) // Cập nhật số đơn hàng hôm nay
      setTodayTotalAmount(totalAmount) // Cập nhật tổng số tiền hôm nay
    } catch (error) {
      console.log('Error fetching Orders:', error)
    }
  }
  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/reports/category`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCategories(res.data.data)
    } catch (error) {
      console.log('Error fetching category:', error)
    }
  }
  const getPremier = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/subscribe/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setPremier(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching category:', error)
    }
  }
  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const res = await axios.get('https://koicaresystemv4.azurewebsites.net/api/reports/product', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data.data)
    } catch (error) {
      console.log('Error fetching products:', error)
    }
  }

  const getBlog = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/blog`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBlogs(res.data.data)
    } catch (error) {
      console.log('Error fetching blogs:', error)
    }
  }

  const getPayment = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/payment/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const paymentsData = res.data.data
      setPayments(paymentsData)

      // Tính tổng số tiền thanh toán
      const totalAmount = paymentsData.reduce((sum, payment) => sum + payment.amount, 0)
      setTotalPaymentAmount(totalAmount)

      // Tính phần trăm tăng giảm
      if (previousTotal !== 0) {
        const change = ((totalAmount - previousTotal) / previousTotal) * 100
        setPercentageChange(change)
      }
      setPreviousTotal(totalAmount)

      // Tính tổng số tiền theo tháng
      const monthlyTotals = {}
      paymentsData.forEach((payment) => {
        const monthYear = dayjs(payment.date).format('YYYY-MM') // Giả sử mỗi thanh toán có thuộc tính 'date'
        if (!monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] = 0
        }
        monthlyTotals[monthYear] += payment.amount // Cộng dồn số tiền theo tháng
      })

      // Chuyển đổi dữ liệu thành mảng để biểu đồ
      const labels = Object.keys(monthlyTotals)
      const dataValues = Object.values(monthlyTotals)
      setMonthlyTotals({ labels, data: dataValues })
      const data = Object.keys(monthlyTotals).map((monthYear) => ({
        name: monthYear,
        uv: monthlyTotals[monthYear]
      }))
      setMonthlyTotals(data)
      // Kiểm tra dữ liệu cuối cùng cho biểu đồ
    } catch (error) {
      console.log('Error fetching Payments:', error)
    }
  }

  // Định dạng phần trăm
  const formatPercentage = (percentage) => {
    return percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`
  }

  const getSupplier = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv4.azurewebsites.net/api/suppliers/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuppliers(res.data.data)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getUser()
    getOrder()
    getCategory()
    getProduct()
    getPayment()
    getBlog()
    getSupplier()
    getTodayOrders()
    getPremier()
  }, [])

  const columnsProduct = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <div className='h-full flex items-center'>
          <img src={params.row.imageUrl} alt='Product' className='w-20 h-16 object-cover rounded-md ' />
        </div>
      )
    },
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    {
      field: 'percent',
      headerName: 'Percent',
      width: 100,
      renderCell: (params) => (
        <div className='relative w-full mt-6'>
          <div className='absolute inset-0 bg-green-300' style={{ width: `${params.row.percent}%` }} />
          <div className='relative z-10 text-sm border font-semibold text-green-500 text-center'>
            {params.row.percent}%
          </div>
        </div>
      )
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      width: 100,
      renderCell: (params) => formatCurrency(params.row.totalPrice)
    }
  ]

  const formatDateTime = (inputDate) => {
    const date = new Date(inputDate)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
  }

  const columnsOrder = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'orderDate', headerName: 'Date', flex: 1, renderCell: (params) => formatDateTime(params.row.orderDate) },
    { field: 'recipientName', headerName: 'Name', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const status = params.value
        let statusClasses = 'border-2 text-sm font-medium py-1 px-2 rounded text-center'

        switch (status) {
          case 'PENDING':
            statusClasses += ' border-yellow-500 text-yellow-500'
            break
          case 'PROCESSING':
            statusClasses += ' border-blue-500 text-blue-500'
            break
          case 'DELIVERED':
            statusClasses += ' border-green-500 text-green-500'
            break
          case 'CANCELLED':
            statusClasses += ' border-red-500 text-red-500'
            break
          default:
            statusClasses += ' border-gray-500 text-gray-500' // Default case for unexpected status
        }

        return (
          <div className='h-full flex justify-center items-center'>
            <div className={statusClasses}>{status}</div>
          </div>
        )
      }
    },
    {
      field: 'totalPrice',
      headerName: 'Total Price',
      width: 100,
      renderCell: (params) => formatCurrency(params.row.totalAmount)
    }
  ]

  const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

  const formatChartData = () => {
    const data = []
    const groupedData = {}
    const formatDate = (date) => {
      if (view === 'day') return dayjs(date).format('YYYY-MM-DD')
      if (view === 'month') return dayjs(date).format('YYYY-MM')
      return dayjs(date).format('YYYY')
    }
    payments.forEach((payment) => {
      const date = formatDate(payment.createDate)
      if (!groupedData[date]) {
        groupedData[date] = { date, paymentAmount: 0, orderAmount: 0 }
      }
      groupedData[date].paymentAmount += payment.amount
    })
    orders.forEach((order) => {
      const date = formatDate(order.orderDate)
      if (!groupedData[date]) {
        groupedData[date] = { date, paymentAmount: 0, orderAmount: 0 }
      }
      groupedData[date].orderAmount += order.totalAmount
    })

    for (const key in groupedData) {
      data.push(groupedData[key])
    }

    return data.sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))
  }

  const chartData = formatChartData()

  const ColorsCategory = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733']

  const renderCustomizedLabel = ({ percent }) => {
    return ` ${percent.toFixed(2)}%`
  }

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
        } overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div className='py-5 px-[30px] mx-auto'>
          <TopLayout text='Dashboard' />
          <div className='flex space-x-4 '>
            {/* Card 1: Order Today */}
            <div className='bg-indigo-500 text-white rounded-lg shadow-lg p-4 w-1/4'>
              <h2 className='text-3xl font-semibold'>{formatCurrency(todayTotalAmount)}</h2>
              <p className='text-lg mb-2'>{todayOrders} </p>

              <p className='text-m flex items-center'>
                <span className='mr-1'>Order Today</span>
              </p>
              <div className='h-16 mt-4  rounded-lg'>
                {/* Biểu đồ dạng LineChart */}
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={lineChartData}>
                    <Line type='monotone' dataKey='value' stroke='#F8F8FF' strokeWidth={2} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Income */}
            <div className='bg-blue-500 text-white rounded-lg shadow-lg p-4 w-1/4'>
              <h2 className='text-2xl font-semibold'>$6.200</h2>
              <p className='text-sm flex items-center'>
                <span className='mr-1'>(40.9%)</span>
                <span className='text-green-300'>&#x2191;</span>
              </p>
              <p className='text-sm mt-2'>Income</p>
              <div className='h-16 mt-4 bg-blue-700 rounded-lg'>{/* Placeholder for line chart */}</div>
            </div>

            {/* Card 3: Conversion Rate */}
            <div className='bg-yellow-500 text-white rounded-lg shadow-lg p-4 w-1/4'>
              <h2 className='text-2xl font-semibold'>2.49%</h2>
              <p className='text-sm flex items-center'>
                <span className='mr-1'>(84.7%)</span>
                <span className='text-green-300'>&#x2191;</span>
              </p>
              <p className='text-sm mt-2'>Conversion Rate</p>
              <div className='h-16 mt-4 bg-yellow-700 rounded-lg'>{/* Placeholder for line chart */}</div>
            </div>

            {/* Card 4: Sessions */}
            <div className='bg-red-500 text-white rounded-lg shadow-lg p-4 w-1/4'>
              <h2 className='text-3xl font-semibold'>{totalPaymentAmount}</h2>
              <p className='text-sm flex items-center'>
                <span className='text-lg  mr-1'>{formatPercentage(percentageChange)}</span>
                <span className={`text-${percentageChange > 0 ? 'green' : 'red'}-300`}>
                  {percentageChange > 0 ? '↑' : '↓'}
                </span>
              </p>
              <p className='text-m mt-2'>Revenue</p>

              <div className='h-20 w-10 mt-4'>
                {/* Hiển thị tiny bar chart */}
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={monthlyTotals}>
                    <Bar dataKey='uv' fill='#F8F8FF' />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/*Summary */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
              <div className='border flex flex-col justify-center items-center p-6 shadow rounded-lg bg-blue-100'>
                <FaRegUser className='w-12 h-12 text-blue-700' />
                <h2 className='text-xl text-blue-700 font-semibold pt-4'>Total Users</h2>
                <p className='text-2xl text-blue-700'>{users.length}</p>
              </div>

              <div className='border flex flex-col justify-center items-center p-6 shadow rounded-lg bg-green-100'>
                <FaCartArrowDown className='w-16 h-12 text-green-600' />
                <h2 className='text-xl font-semibold pt-4 text-green-600'>Total Orders</h2>
                <p className='text-2xl text-green-600'>{orders.length}</p>
                {/* <p className='text-sm'>Total Amount: {formatCurrency(orders.length)}</p> */}
              </div>

              <div className='border flex flex-col justify-center items-center p-6 shadow rounded-lg bg-yellow-100'>
                <FaMoneyCheckAlt className='w-16 h-12 text-yellow-500' />
                <h2 className='text-xl font-semibold pt-4 text-yellow-500'>Total Payments</h2>
                <p className='text-2xl text-yellow-500'>{payments.length}</p>
                {/* <p className='text-sm'>Total Amount: {formatCurrency(payments.length)}</p> */}
              </div>

              <div className='border flex flex-col justify-center items-center p-6 shadow rounded-lg bg-purple-100'>
                <MdCategory className='w-16 h-12 text-purple-600' />
                <h2 className='text-xl font-semibold pt-4 text-purple-600'>Total Supplier</h2>
                <p className='text-2xl text-purple-600'>{suppliers.length}</p>
              </div>

              <div className='border flex flex-col justify-center items-center p-6 shadow rounded-lg bg-red-100'>
                <FaProductHunt className='w-16 h-12 text-red-700' />
                <h2 className='text-xl font-semibold pt-4 text-red-700'>Total Products</h2>
                <p className='text-2xl text-red-700'>{products.length}</p>
              </div>

              <div className='border flex flex-col justify-center items-center p-6 shadow rounded-lg bg-teal-100'>
                <FaNewspaper className='w-16 h-12 text-teal-700' />
                <h2 className='text-xl font-semibold pt-4 text-teal-700'>Total Blogs</h2>
                <p className='text-2xl text-teal-700'>{blogs.length}</p>
              </div>
            </div>
            {/* Top 5 product  */}
            <div className='p-6 shadow border rounded-lg mt-6'>
              <h2 className='text-2xl font-semibold mb-4'>Top Products</h2>
              <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <Paper sx={{ height: 400 }}>
                  <DataGrid
                    rows={products}
                    columns={columnsProduct}
                    pageSize={100}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    rowHeight={73}
                    checkboxSelection
                    disableExtendRowFullWidth
                    getRowId={(row) => row.id}
                    sx={{
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                      },
                      '& .MuiDataGrid-row:hover': {
                        backgroundColor: isDarkMode ? 'rgb(36 48 63 / var(--tw-bg-opacity))' : '#e0e0e0'
                      }
                    }}
                  />
                </Paper>
              </ThemeProvider>
            </div>
          </div>
          {/* row 2 */}
          <div className='grid grid-cols-1 lg:grid-cols-8 gap-10'>
            {/* areachart  */}
            <div className='col-span-5 flex flex-col  mt-6 border rounded-md'>
              <div className='my-4 px-6 flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Orders and Payments Analytics</h1>
                <select
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  className={`px-4 py-2 border rounded-md ${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  }`}
                >
                  <option value='day'>Day</option>
                  <option value='month'>Month</option>
                  <option value='year'>Year</option>
                </select>
              </div>
              <ResponsiveContainer className={`p-6`} width='100%' height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                      <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                      <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    type='monotone'
                    dataKey='paymentAmount'
                    stroke='#8884d8'
                    fillOpacity={1}
                    fill='url(#colorUv)'
                    name='Payments'
                  />
                  <Area
                    type='monotone'
                    dataKey='orderAmount'
                    stroke='#82ca9d'
                    fillOpacity={1}
                    fill='url(#colorPv)'
                    name='Orders'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className='col-span-3 grid grid-cols-1 lg:grid-cols-1 gap-10'>
              {/* pie chart  */}
              <div className='p-6 shadow border rounded-lg mt-6'>
                <h2 className='text-2xl font-semibold mb-4'>Earning by Category</h2>
                <ResponsiveContainer width='100%' height={400}>
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey='totalPrice'
                      nameKey='categoryName'
                      cx='50%'
                      cy='50%'
                      outerRadius={150} // Larger outer radius for a bigger pie
                      innerRadius={80} // Add inner radius for a donut chart effect
                      fill='#8884d8'
                      label={renderCustomizedLabel}
                      labelLine={false} // Remove label lines
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ColorsCategory[index % ColorsCategory.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)} đ`} />
                    <Legend verticalAlign='bottom' height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* row 3 */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/* bar chart  */}
            <div className='flex flex-col  mt-6 border rounded-md'>
              <div className='my-3 px-5 pt-4 flex justify-between items-center'>
                <h1 className='text-start font-bold text-2xl'>User Report</h1>
              </div>
              <ResponsiveContainer className={`p-2`} width='100%' height={450}>
                <BarChart data={usersData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='users' fill='#8884d8' name='Total Users' animationKey='users' />
                  <Bar dataKey='usersPremium' fill='#82ca9d' name='Premium Users' animationKey='usersPremium' />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* order table  */}
            <div className='p-6 shadow border rounded-lg mt-6'>
              <h2 className='text-2xl font-semibold mb-4'>New Orders</h2>
              <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <Paper sx={{ height: 450 }}>
                  <DataGrid
                    rows={sortedOrders}
                    columns={columnsOrder}
                    pageSize={100}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    rowHeight={68}
                    checkboxSelection
                    disableExtendRowFullWidth
                    getRowId={(row) => row.id}
                    sx={{
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                      },
                      '& .MuiDataGrid-row:hover': {
                        backgroundColor: isDarkMode ? 'rgb(36 48 63 / var(--tw-bg-opacity))' : '#e0e0e0'
                      }
                    }}
                  />
                </Paper>
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DashboardAD
