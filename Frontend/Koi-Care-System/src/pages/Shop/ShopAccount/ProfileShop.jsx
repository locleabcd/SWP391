/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from 'axios'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDarkMode } from '../../../hooks/DarkModeContext'

function ProfileShop() {
  const { isDarkMode } = useDarkMode()
  const [users, setUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // State for password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  // Fetch user data
  const getUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const userData = res.data.data
      // Replace null values with an empty string
      Object.keys(userData).forEach((key) => {
        if (userData[key] === null) {
          userData[key] = ''
        }
      })

      setUsers(userData)
      setAvatarPreview(userData.avatar) // Set avatar preview
      reset(userData) // Reset form with user data
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Update user profile
  const updateUser = async (data) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('gender', data.gender)
      formData.append('bio', data.bio)
      formData.append('address', data.address)
      formData.append('dateOfBirth', data.dateOfBirth)
      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      const res = await axios.put(`https://koicaresystemv2.azurewebsites.net/api/profile/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Profile updated successfully!')
      setIsEditing(false)
      getUser() // Fetch updated user data
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Change user password
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.patch(
        'https://koicaresystemv2.azurewebsites.net/api/users/changePassword',
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmationPassword: confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsChangingPassword(false)
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password.')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    if (file) {
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  // Separate submit function for profile update
  const onSubmit = (data) => {
    updateUser(data)
  }

  // Separate submit function for changing password
  const onSubmitPassword = (e) => {
    e.preventDefault()
    changePassword() // Call the changePassword function separately
  }

  useEffect(() => {
    getUser()
  }, [])

  // Get today's date in yyyy-mm-dd format for date input max value
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 15)
  const formattedMaxDate = maxDate.toISOString().split('T')[0]
  return (
    <div className='h-screen flex'>
      <LeftSideBar />
      <div
        className={`relative ${
          isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
        } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
      >
        <Header />
        <div>
          <div className='gap-8 p-4 flex justify-center items-center flex-col  '>
            <h1 className='text-2xl font-bold'>Profile Information</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-4 w-2/3 '>
              <div className='grid grid-cols-3'>
                <div className='flex items-center justify-center h-full pr-20 '>
                  {!isEditing ? (
                    avatarPreview && (
                      <div className='relative w-60 h-60'>
                        <img
                          src={avatarPreview}
                          alt='Avatar'
                          className='object-cover w-full h-full rounded-full border-2 border-gray-300 shadow-lg'
                        />
                      </div>
                    )
                  ) : (
                    <div className='flex flex-col items-center col-span-1'>
                      <input
                        type='file'
                        onChange={handleFileChange}
                        className='border rounded p-2 mb-2 border-blue-500'
                      />
                      {avatarPreview && (
                        <div className='relative w-60 h-60'>
                          <img
                            src={avatarPreview}
                            alt='Avatar Preview'
                            className='object-cover w-full h-full rounded-full border-2 border-gray-300 shadow-lg'
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-4 col-span-2'>
                  <div>
                    <label className='block'>Name:</label>
                    <input
                      type='text'
                      {...register('name')}
                      disabled
                      className={`border rounded p-2 w-full  cursor-not-allowed ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                  </div>
                  <div>
                    <label className='block'>Email:</label>
                    <input
                      type='text'
                      {...register('email')}
                      disabled
                      className={`border rounded p-2 w-full  cursor-not-allowed ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                  </div>
                  <div>
                    <label className='block'>Phone:</label>
                    <input
                      type='text'
                      {...register('phone', {
                        pattern: {
                          value: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                          message: 'Invalid phone number format'
                        }
                      })}
                      disabled={!isEditing}
                      className={`border rounded p-2 w-full ${isEditing ? 'border' : 'bg-white'}, ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                    {errors.phone && <span className='text-red-500'>{errors.phone.message}</span>}
                  </div>
                  <div>
                    <label className='block'>Gender:</label>
                    <select
                      {...register('gender')}
                      disabled={!isEditing}
                      className={`border rounded p-2 w-full ${isEditing ? 'border' : 'bg-white'}, ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }
                      `}
                    >
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className='block'>Date of Birth:</label>
                    <input
                      type='date'
                      {...register('dateOfBirth')}
                      disabled={!isEditing}
                      max={today}
                      className={`border rounded p-2 w-full ${isEditing ? 'border' : 'bg-white'}, ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                  </div>
                  <div>
                    <label className='block'>Created Date:</label>
                    <input
                      type='text'
                      value={new Date(users.createdDate).toLocaleDateString()}
                      disabled
                      className={`border rounded p-2 w-full  cursor-not-allowed ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                  </div>

                  <div className='col-span-2'>
                    <label className='block'>Address:</label>
                    <input
                      type='text'
                      {...register('address')}
                      disabled={!isEditing}
                      className={`border rounded p-2 w-full ${isEditing ? 'border' : 'bg-white'}, ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                  </div>
                  <div className='col-span-2'>
                    <label className='block'>Bio:</label>
                    <textarea
                      {...register('bio')}
                      disabled={!isEditing}
                      className={`border rounded p-2 w-full ${isEditing ? 'border' : 'bg-white'}, ${
                        isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className='mt-4 flex justify-end'>
                <button
                  type='button'
                  onClick={() => {
                    setIsEditing(!isEditing)
                    if (!isEditing) reset(users) // Reset form to current user data when editing starts
                  }}
                  className='bg-blue-500 text-white p-2 rounded mr-2 w-20'
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                  <button
                    type='submit'
                    className={`px-4 py-2 bg-green-500 text-white rounded-md ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Update Profile'}
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className='bg-yellow-500 text-white p-2 rounded ml-2 w-70'
                >
                  {isChangingPassword ? 'Hide Password Form' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
          <div className='gap-4 p-4 flex justify-center items-center flex-col'>
            {isChangingPassword && (
              <div className='w-2/3 mt-4 border rounded p-4 shadow-lg'>
                <h2 className='text-xl font-bold'>Change Password</h2>
                <div className=' gap-4 mt-4'>
                  <div>
                    <label className='block'>Current Password:</label>
                    <input
                      type='password'
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`border rounded p-2 w-full ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'}`}
                    />
                  </div>
                  <div>
                    <label className='block'>New Password:</label>
                    <input
                      type='password'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`border rounded p-2 w-full ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'}`}
                    />
                  </div>
                  <div>
                    <label className='block'>Confirm New Password:</label>
                    <input
                      type='password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`border rounded p-2 w-full ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'}`}
                    />
                  </div>
                </div>
                <button
                  type='button'
                  onClick={changePassword}
                  className='mt-4 px-4 py-2 bg-green-500 text-white rounded-md'
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileShop
