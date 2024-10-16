/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../hooks/DarkModeContext';
import Header from '../../../components/Admin/Header';
import LeftSideBar from '../../../components/Admin/LeftSideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopLayout from '../../../layouts/TopLayoutAD';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Modal, Button, TextField, Box } from '@mui/material';
import { FaUser, FaMoneyBillWave, FaEdit, FaTrash, FaInfoCircle, FaEye } from "react-icons/fa"

function ShopAD() {
  const { isDarkMode } = useDarkMode();
  const [manageShops, setManageShops] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false)
  const [username, setUsername] = useState(''); // Declare username state
  const [password, setPassword] = useState('defaultpassword'); // Set default password
  const [email, setEmail] = useState(''); // Optional email
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: 'rgb(36 48 63 / var(--tw-bg-opacity))',
        paper: 'rgb(36 48 63 / var(--tw-bg-opacity))',
      },
    },
  });

  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const shopUsers = res.data.data.filter((user) => user.role === 'SHOP');
      setManageShops(shopUsers);
      
    } catch (error) {
      console.log('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    getUsers(); 
  }, []);
  const handleDeleteStaff = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      // Gắn API xóa staff ở đây
      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Staff deleted successfully');
      getUsers(); // Cập nhật danh sách sau khi xóa
  
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete staff');
    }
  };
  const columns = [
    { field: 'username', headerName: 'Username', width: 120 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center', // Center vertically
            height: '100%', // Ensure it spans the entire cell height
          }}
        >
          {/* Icon Edit */}
          <button
            className='p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full mx-2'
            onClick={() => {
              navigate(`/admin/updateShop/${params.row.id}`);
            }}
          >
            <FaEdit className='size-5' />
          </button>
          {/* Icon Delete */}
          <button
            className='p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full'
            onClick={() => handleDeleteStaff(params.row.id)}
          >
            <FaTrash className='size-5' />
          </button>
        </div>
      ),
    }
  ];
  const handleCreateStaff = async () => {
    console.log('onSubmit:', { username, email });
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      if (!username) {
        throw new Error('Username is required');
      }
      const requestBody = {
        username: username,
        password: 'defaultpassword', // Bổ sung lại mật khẩu mặc định nếu cần
      };
      if (email) {
        requestBody.email = email;
      }
      const res = await axios.post(`https://koicaresystemv3.azurewebsites.net/api/users/register/staff`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Staff created successfully!');
      setIsFormOpen(false);
      
      // Gọi lại danh sách user để cập nhật
      getUsers();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed to create staff: ${error.response.data.message}`);
      } else {
        toast.error('Failed to create staff.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

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
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
              <CssBaseline />
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
                  height: '100vh', // Căn giữa theo chiều dọc
                }}
              >
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: isDarkMode ? '#333' : '#fff',
                    width: '400px', // Độ rộng của form
                    borderRadius: '8px', // Bo góc cho form
                  }}
                >
                  <h2>Create Staff</h2>
                  <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginBottom: '20px', width: '100%' }}
                  />
                  <TextField
                    label="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '20px', width: '100%' }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCreateStaff}
                    style={{ marginRight: '10px' }}
                  >
                    Create
                  </Button>
                  <Button variant="outlined" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </Box>
            </Modal>

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
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: isDarkMode
                      ? 'rgb(36 48 63 / var(--tw-bg-opacity))'
                      : '#e0e0e0',
                  },
                }}
              />
              </Paper>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopAD;
