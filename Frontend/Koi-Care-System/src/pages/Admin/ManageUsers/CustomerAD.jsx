import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../hooks/DarkModeContext';
import Header from '../../../components/Admin/Header';
import LeftSideBar from '../../../components/Admin/LeftSideBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TopLayout from '../../../layouts/TopLayoutAD';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { FaCrown } from "react-icons/fa";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

function CustomerAD() {
  const { isDarkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const fallbackImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8WFhgAAAD...';

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/profile/all/member`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.data);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      renderCell: (params) => (
        <img
          src={params.row.avatar || fallbackImage}
          alt='User'
          className='w-24 h-16 object-cover rounded-md'
        />
      ),
    },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'createdDate', headerName: 'Create Date', width: 120 },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 120 },
    { field: 'bio', headerName: 'Bio', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <div className='h-full flex justify-center items-center'>
          <div
          className={`flex items-center justify-center py-1 px-2 rounded text-sm font-medium
            ${params.value === 'PREMIUM' ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}
          >
            {params.value === 'PREMIUM' ? (
              <div className='flex gap-1'>
                <FaCrown className='w-4 h-4'/> 
                {params.value === 'PREMIUM' ? 'PREMIUM' : 'NORMAL'}
              </div>           
            ) : (
              <div>
                NORMAL
              </div>
            )}       
          </div>
        </div>
      ),
    },
    
    {field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <div className='flex h-full justify-center items-center'>
          <Link
            to={`/admin/user/${params.row.userId}`}
            className=' p-1 hover:bg-green-500 text-green-500 hover:text-white  rounded-full'
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}>
        <Header />
        <div className='py-5 px-[30px] mx-auto'>
          <TopLayout text='Users' />
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Paper sx={{ height: 670 }}>
              <DataGrid
                rows={users}
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
  );
}

export default CustomerAD;
