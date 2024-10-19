/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../hooks/DarkModeContext';
import Header from '../../../components/Admin/Header';
import LeftSideBar from '../../../components/Admin/LeftSideBar';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopLayout from '../../../layouts/TopLayoutShop';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function UpdateUserAD() {
  const { isDarkMode } = useDarkMode();
  const animatedComponents = makeAnimated();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch user data
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(
        `https://koicaresystemv3.azurewebsites.net/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.data);  // Set user data from response
      reset({
        username: res.data.data.username,
        email: res.data.data.email,
        password: '',  // Password is set to an empty string or null
      });
      console.log(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Update user function
  const updateUser = async (data) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    // Prepare the data to send
    const updatedData = {
      username: data.username,
      role: data.role,  
      status: data.status,   
    };
  
    // Only include password if it's not empty
    if (data.password) {
      updatedData.password = data.password;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const res = await axios.put(
        `https://koicaresystemv3.azurewebsites.net/api/users/update/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success('User updated successfully!');
      navigate('/admin/shop');
    } catch (error) {
      console.log(error.response?.data);  // Log the detailed error response
      toast.error('Failed to update user.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Submit handler
  const onSubmit = (data) => {
    updateUser(data);
  };

  return (
    <div className='h-screen flex'>
  <LeftSideBar />
  <div className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}>
    <Header />
    <div className='py-5 px-[30px] mx-auto'>
      <TopLayout text='Shop' textName='Update Shop' links='admin/shop'/>
      <div className='bg-white p-6 rounded-md border'>
        {/* Form for updating user */}
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Username Input */}
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Username
            </label>
            <input
              id='username'
              type='text'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              {...register('username', { required: true })}
            />
            {errors.username && <p className='text-red-500 text-xs italic'>Please enter a username.</p>}
          </div>

          {/* Email Input */}
          

          {/* Password Input (optional) */}
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password (Leave empty if not changing)
            </label>
            <input
              id='password'
              type='password'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              {...register('password')}
            />
          </div>

          {/* Hidden Fields for Role and Status */}
          <input type='hidden' value='SHOP' {...register('role')} />
          <input type='hidden' value={true} {...register('status')} />

          {/* Submit Button */}
          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
}

export default UpdateUserAD;
