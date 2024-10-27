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
import * as XLSX from 'xlsx'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
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
function NewsAD() {
  const { isDarkMode } = useDarkMode()
  // eslint-disable-next-line no-unused-vars
  const [tags, setTags] = useState([])
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const getTag = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`http://68.183.232.120:8080/api/tag`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTags(res.data.data)
      console.log(res.data.data)
    } catch (error) {
      console.log('Error fetching tags:', error)
    }
  }

  useEffect(() => {
    getTag()
  }, [])

  const getBlog = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`http://68.183.232.120:8080/api/blog`, {
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
  useEffect(() => {
    getBlog()
  }, [])

  const deleteBlog = async (blogId) => {
    const isConfirmed = window.confirm('Are you sure to delete blog')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`http://68.183.232.120:8080/api/blog/delete/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Blog deleted successfully')
      getBlog()
    } catch (error) {
      console.error('Error deleting blogs:', error)
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
          <img src={params.row.blogImage} alt='blog' className='w-24 h-16 object-cover rounded-md' />
        </div>
      )
    },
    { field: 'blogTitle', headerName: 'Blog Title', width: 200 },
    { field: 'blogContent', headerName: 'Blog Content', flex: 1 },
    { field: 'blogDate', headerName: 'Date', width: 150 },
    {
      field: 'tags',
      headerName: 'Tag',
      width: 300,
      renderCell: (params) => {
        const tags = params.row.tags || []
        return (
          <>
            {tags.map((tag) => (
              <span key={tag.id} className='bg-blue-200 text-blue-800 py-2 px-3 rounded-full text-xs mr-2'>
                {tag.tagName}
              </span>
            ))}
          </>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <div className='flex h-full justify-center items-center'>
          <Link
            to={`/admin/news/${params.row.blogId} `}
            className=' p-1 hover:bg-blue-500 text-blue-500 hover:text-white  rounded-full'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5 '>
              <path d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' />
              <path
                fillRule='evenodd'
                d='M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z'
                clipRule='evenodd'
              />
            </svg>
          </Link>

          <button
            className=' p-1 hover:bg-red-500 text-red-600 hover:text-white  rounded-full'
            onClick={() => deleteBlog(params.row.blogId)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5 '>
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      blogs.map((blog) => ({
        ID: blog.blogId,
        Image: blog.blogImage,
        Title: blog.blogTitle,
        Content: blog.blogContent,
        Date: blog.blogDate,
        Tags: blog.tags.length > 0 ? blog.tags.map((tag) => tag.tagName).join(', ') : 'Unknown'
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Blogs')

    XLSX.writeFile(workbook, 'blogs.xlsx')
  }

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
          <div className='py-5 px-[30px] mx-auto max-w-[1750px] '>
            <TopLayout text='News' links='admin/news' />

            <div className='w-full flex justify-between items-center relative'>
              <button onClick={exportToExcel} className='mb-4 p-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md'>
                Download Excel
              </button>
            </div>
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
              <CssBaseline />
              <Paper sx={{ height: 670 }}>
                <DataGrid
                  rows={blogs}
                  columns={columns}
                  pageSize={10}
                  pageSizeOptions={[5, 10, 20, 50, 100]}
                  rowHeight={80}
                  checkboxSelection
                  disableExtendRowFullWidth
                  disableSelectionOnClick
                  getRowId={(row) => row.blogId}
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
  )
}
export default NewsAD
