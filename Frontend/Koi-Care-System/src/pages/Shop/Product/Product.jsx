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
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'

const formatPrice = (price) => {
  return price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

function Product() {
  const { isDarkMode } = useDarkMode()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState([]);
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
      console.log(res.data.data);
      
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
        <div className='h-full flex items-center'>
          <img
          src={params.row.images?.[0]?.downloadUrl || fallbackImage}
          alt='Product'
          className='w-24 h-16 object-cover rounded-md '
          />
        </div>     
      )
    },
    { field: 'name', headerName: 'Product Name', flex: 0.5 },
    { field: 'brand', headerName: 'Brand', flex: 0.5 },
    { field: 'price', headerName: 'Price', width: 120, renderCell: (params) => formatPrice(params.row.price),},
    { field: 'inventory', headerName: 'Inventory', width: 150 },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => params.row?.category?.name || 'Unknown'
    },
    {
      field: 'supplier',
      headerName: 'Supplier',
      width: 200,
      renderCell: (params) => params.row?.supplier?.name || 'Unknown'
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <div className='flex h-full justify-center items-center'>
          <Link
            to={`/shop/product/${params.row.id}`}
            className='p-1 hover:bg-green-500 text-green-500 hover:text-white rounded-full'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-5'
            >
              <path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z' />
              <path d='M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z' />
            </svg>
          </Link>
          <Link
            to={`/shop/product/view/${params.row.id} `}
            className=' p-1 hover:bg-blue-500 text-blue-500 hover:text-white  rounded-full'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-5 '
            >
              <path d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' />
              <path
                fillRule='evenodd'
                d='M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
          <button
            className='p-1 hover:bg-red-500 text-red-600 hover:text-white rounded-full'
            onClick={() => deleteProduct(params.row.id)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='size-5'
            >
              <path
                fillRule='evenodd'
                d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005
                  13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0
                  1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 
                  52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0
                  1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428
                  1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75
                  0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      )
    } 
  ]

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
      'ID': product.id,
      'Product Name': product.name,
      'Brand': product.brand,
      'Price': formatPrice(product.price),
      'Inventory': product.inventory,
      'Category': product?.category?.name || 'Unknown',
      'Supplier': product?.supplier?.name || 'Unknown',
      'Decription': product.description,
      'Description detail': product.description_detail,
    })));

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

    XLSX.writeFile(workbook, 'Products.xlsx')
  }

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
          <div className='w-full flex justify-between items-center relative'>
            <div className='cursor-pointer'>
              <button
                className='py-2 mb-4 px-3 bg-blue-500 text-white hover:bg-blue-500 rounded-md'
                onClick={() => navigate('/shop/createProduct')}
              >
                New Product
              </button>
            </div>
            <div className='cursor-pointer'>
              <button onClick={exportToExcel} className="mb-4 ml-3 p-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md">
                Download Excel
              </button>
            </div>           
          </div>
          
          <Paper sx={{ height: 670}}>
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              rowHeight={80}
              checkboxSelection
              disableExtendRowFullWidth
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
