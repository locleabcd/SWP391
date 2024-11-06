import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Swal from 'sweetalert2'

function Supplier() {
  const { isDarkMode } = useDarkMode()
  const [suppliers, setSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const getSupplier = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/suppliers/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuppliers(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching suppliers:', error)
    }
  }

  useEffect(() => {
    getSupplier()
  }, [])

  const deleteSupplier = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystemv2.azurewebsites.net/api/suppliers/supplier/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Supplier deleted successfully')
      getSupplier()
    } catch (error) {
      console.error('Error deleting Supplier:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 200 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <div className='flex h-full justify-center items-center'>
          <Link
            to={`/shop/supplier/${params.row.id}`}
            className='p-1 hover:bg-green-500 text-green-500 hover:text-white rounded-full'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
              <path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z' />
              <path d='M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z' />
            </svg>
          </Link>
          <button
            className='p-1 hover:bg-red-500 text-red-600 hover:text-white rounded-full'
            onClick={() => deleteSupplier(params.row.id)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
              <path
                fillRule='evenodd'
                d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
          } overflow-y-auto flex-1 flex-col  overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <TopLayout text='Supplier' links='shop/supplier' />
            <div className='w-full flex justify-between items-center relative'>
              <button
                className='py-2 mb-4 px-3 bg-custom-left-bar text-white hover:bg-blue-600 rounded-md'
                onClick={() => navigate('/shop/createSupplier')}
              >
                New Supplier
              </button>
            </div>

            <Paper sx={{ height: 670 }}>
              <DataGrid
                rows={suppliers}
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
                    backgroundColor: isDarkMode ? 'rgb(36 48 63 / var(--tw-bg-opacity))' : '#e0e0e0'
                  }
                }}
              />
            </Paper>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Supplier
