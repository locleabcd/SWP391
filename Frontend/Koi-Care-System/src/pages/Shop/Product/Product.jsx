import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import TopLayout from '../../../layouts/TopLayout'

function Product() {
  const { isDarkMode } = useDarkMode()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const fallbackImage = 'https://5sfashion.vn/storage/upload/images/posts/Z5FgdGRa5ycTaCqcMZnHfZTkb7FyHATji17rlS4q.jpg'

  const getProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const res = await axios.get('https://koicaresystemv3.azurewebsites.net/api/products/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data.data)
    } catch (error) {
      console.log('Error fetching products:', error)
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  const deleteProduct = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this product?')
    if (!isConfirmed) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/products/product/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Product deleted successfully')
      getProduct()
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.row.images?.[0]?.downloadUrl || fallbackImage}
          alt='Product'
          className='w-24 h-16 object-cover rounded-md'
        />
      )
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 100 },
    { field: 'price', headerName: 'Price', width: 100, valueFormatter: ({ value }) => `$${value?.toFixed(2)}` },
    { field: 'inventory', headerName: 'Inventory', width: 100 },
    { field: 'category', headerName: 'Category', width: 120, valueGetter: (params) => params.row?.category?.name },
    { field: 'supplier', headerName: 'Supplier', width: 150, valueGetter: (params) => params.row?.supplier?.name },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <div className='flex gap-2'>
          <button
            className='p-1 hover:bg-green-500 text-green-500 hover:text-white rounded-full'
            onClick={() => navigate(`/shop/product/${params.row.id}`)}
          >
            Edit
          </button>
          <button
            className='p-1 hover:bg-red-500 text-red-600 hover:text-white rounded-full'
            onClick={() => deleteProduct(params.row.id)}
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative flex-1 overflow-y-auto duration-200 ${
          isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
        }`}
      >
        <Header />
        <div className='py-5 px-8 mx-auto'>
          <TopLayout text='Products' />
          <Paper sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={100}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              checkboxSelection
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: isDarkMode ? '#555' : '#e0e0e0'
                }
              }}
            />
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default Product
