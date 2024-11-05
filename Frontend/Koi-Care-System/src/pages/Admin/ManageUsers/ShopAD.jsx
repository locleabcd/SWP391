/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutAD'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'

import {
  Modal,
  Button,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { FaUser, FaMoneyBillWave, FaEdit, FaTrash, FaInfoCircle, FaEye, FaCircle } from 'react-icons/fa'

function ShopAD() {
  const { isDarkMode } = useDarkMode()
  const [manageShops, setManageShops] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [username, setUsername] = useState('') // Declare username state
  const [password, setPassword] = useState('defaultpassword') // Set default password
  const [email, setEmail] = useState('') // Optional email
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // Dialog state
  const [selectedUserId, setSelectedUserId] = useState(null) // Store ID for deletion
  const navigate = useNavigate()

  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const shopUsers = res.data.data.filter((user) => user.role === 'SHOP')
      setManageShops(shopUsers)
      console.log('Updated shop users:', shopUsers)
    } catch (error) {
      console.log('Error fetching promotions:', error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])
  const handleOpenDeleteDialog = (id) => {
    setSelectedUserId(id)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedUserId(null)
  }

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false)
    if (selectedUserId) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }
        await axios.put(
          `https://koicaresystemv2.azurewebsites.net/api/users/delete/${selectedUserId}`,
          { status: false },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('User deactivated successfully')
        await getUsers()
      } catch (error) {
        console.error(error)
        toast.error('Failed to deactivate user')
      } finally {
        setSelectedUserId(null)
      }
    }
  }
  const columns = [
    { field: 'username', headerName: 'Username', width: 120 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            padding: '0'
          }}
        >
          <FaCircle
            color={params.row.status ? 'green' : 'red'}
            className={`status-icon ${params.row.status ? 'active' : 'inactive'}`}
          />
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center', // Center vertically
            height: '100%' // Ensure it spans the entire cell height
          }}
        >
          {/* Icon Edit */}
          <button
            className='p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full mx-2'
            onClick={() => {
              navigate(`/admin/updateShop/${params.row.id}`)
            }}
          >
            <FaEdit className='size-5' />
          </button>
          {/* Icon Delete */}
          <button
            className='p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full'
            onClick={() => handleOpenDeleteDialog(params.row.id)}
          >
            <FaTrash className='size-5' />
          </button>
        </div>
      )
    }
  ]
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleCreateStaff = async () => {
    if (!username) {
      toast.error('Username is required')
      return
    }

    // Validate email only if it is provided
    if (email && !isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const requestBody = { username, password: 'defaultpassword' }
      if (email) {
        requestBody.email = email
      }
      await axios.post(`https://koicaresystemv2.azurewebsites.net/api/users/register/staff`, requestBody, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Staff created successfully!')
      setIsFormOpen(false)
      getUsers()
    } catch (error) {
      console.log(error)
      toast.error('Failed to create staff.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'
          } overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <TopLayout text='Shop' />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Button variant='contained' onClick={() => setIsFormOpen(true)}>
                Create Staff
              </Button>
            </Box>

            <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh' // Căn giữa theo chiều dọc
                }}
              >
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    width: '400px', // Độ rộng của form
                    borderRadius: '8px' // Bo góc cho form
                  }}
                >
                  <h2>Create Staff</h2>
                  <TextField
                    label='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginBottom: '20px', width: '100%' }}
                  />
                  <TextField
                    label='Email (optional)'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '20px', width: '100%' }}
                  />
                  <Button variant='contained' onClick={handleCreateStaff} style={{ marginRight: '10px' }}>
                    Create
                  </Button>
                  <Button variant='outlined' onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </Box>
            </Modal>
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to deactivate this user? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color='primary'>
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color='error'>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Paper sx={{ height: 670 }}>
              <DataGrid
                rows={manageShops}
                columns={columns}
                pageSize={10}
                rowHeight={80}
                getRowId={(row) => row._id || row.id} // Sử dụng đúng thuộc tính id
                checkboxSelection
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

export default ShopAD
