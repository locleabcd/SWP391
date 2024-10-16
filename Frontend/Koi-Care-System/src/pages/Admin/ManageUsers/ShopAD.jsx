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
import { Modal, Button, TextField } from '@mui/material';

function ShopAD() {
  const { isDarkMode } = useDarkMode();
  const [manageShops, setManageShops] = useState([]);
  const [username, setUsername] = useState(''); // Declare username state
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
          Authorization: `Bearer ${token}`
        }
      });
      const shopUsers = res.data.data.filter(user => user.role === 'SHOP');
      setManageShops(shopUsers);
    } catch (error) {
      console.log('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    { field: 'username', headerName: 'Username', width: 120 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', width: 120 },
  ];

  const handleCreateStaff = async () => {
    try {
      await axios.post('https://koicaresystemv3.azurewebsites.net/api/users/register/staff', { username });
      await getUsers(); // Refresh the list of users
      toast.success('Staff created successfully!');
      setUsername(''); // Clear the input field
      setIsFormOpen(false); // Close the form
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast.error('Failed to create staff member.');
    }
  };

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='py-5 px-[30px] mx-auto max-w-[1750px]'>
            <TopLayout text='Shop' />
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
              <CssBaseline />
              <Button variant="contained" onClick={() => setIsFormOpen(true)}>
                Create Staff
              </Button>
              
              <Modal open={isFormOpen} onClose={() => setIsFormOpen(false)}>
                <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#333' : '#fff' }}>
                  <h2>Create Staff</h2>
                  <TextField
                    label="Username"
                    value={username} // Use value to control input
                    onChange={(e) => setUsername(e.target.value)} // Update state on input change
                    required
                    style={{ marginBottom: '20px', width: '100%' }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleCreateStaff} // Call the function without passing username as argument
                    style={{ marginRight: '10px' }}
                  >
                    Create
                  </Button>
                  <Button variant="outlined" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </Modal>

              <Paper sx={{ height: 670 }}>
                <DataGrid
                  rows={manageShops}
                  columns={columns}
                  pageSize={10}
                  rowHeight={80}
                  getRowId={(row) => row.id}
                  checkboxSelection
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: isDarkMode ? 'rgb(36 48 63 / var(--tw-bg-opacity))' : '#e0e0e0',
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
