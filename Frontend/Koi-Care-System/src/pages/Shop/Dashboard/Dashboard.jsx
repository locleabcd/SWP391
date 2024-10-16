import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FaRegUser } from "react-icons/fa"
import { FaMoneyCheckAlt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(36 48 63 / var(--tw-bg-opacity))',
      paper: 'rgb(36 48 63 / var(--tw-bg-opacity))',
    },
  },
})

function Dashboard() {
  const { isDarkMode } = useDarkMode()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [payments, setPayments] = useState([])
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const formatCurrency = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ"

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/profile/all/member`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers(res.data.data)
      console.log(res.data.data)
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

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(res.data.data)
      console.log(res.data.data)
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

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/reports/category`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCategories(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching category:', error)
    }
  }

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const res = await axios.get('https://koicaresystemv3.azurewebsites.net/api/reports/product', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data.data)
      console.log(res.data.data);
      
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

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/blog`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBlogs(res.data.data)
      console.log(res.data.data)
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

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/payment/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setPayments(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching Payments:', error)
    }
  }

  const getSupplier = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/suppliers/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuppliers(res.data.data)
      console.log(res.data.data)
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
  }, [])

  const topProducts = products.slice(0, 5);
  const columnsProduct = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <div className='h-full flex items-center'>
          <img
          src={params.row.imageUrl}
          alt='Product'
          className='w-20 h-16 object-cover rounded-md '
          />
        </div>     
      )
    },
    { field: 'productName', headerName: 'Product Name', flex: 1 },
    { field: 'percent', headerName: 'Percent', width:100  },
    { field: 'totalPrice', headerName: 'Total Price', width: 100, renderCell: (params) => params.row.price}
  ]

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
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {/* Display Summary */}
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
                <Paper sx={{ height: 400}}>
                  <DataGrid
                    rows={products}
                    columns={columnsProduct}
                    pageSize={100}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    rowHeight={80}
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
              {/* <table className='min-w-full rounded-lg border overflow-hidden border-separate border-spacing-0'>
                <thead>
                  <tr className=''>
                    <th className='px-4 py-3 border-b'>Image</th>
                    <th className='px-4 py-3 text-start border-b'>Product Name</th>             
                    <th className='px-4 py-3 border-b'>Percent</th>
                    <th className='px-4 py-3 border-b'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className=''>
                      <td className='px-4 py-3 border-b'>
                        <img
                          src={product.imageUrl}
                          alt='Product'
                          className='w-12 h-12 object-cover rounded-md '
                          /></td>
                      <td className='px-4 py-3 border-b'>{product.productName}</td>            
                      <td className='px-4 py-3 border-b'>
                        <div className='relative w-full '>
                          <div className='absolute inset-0 bg-green-300' style={{ width: `${product.percent}%` }}></div>
                          <div className='relative z-10 text-sm border font-semibold text-green-500 text-center'>{product.percent}%</div>
                        </div>
                      </td>
                      <td className='text-center px-2 py-3 border-b'>{product.totalPrice.toLocaleString() + ' đ'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>       */}
            </div>
          </div>
          
        </div>      
      </div>
    </div>
  )
}
export default Dashboard
