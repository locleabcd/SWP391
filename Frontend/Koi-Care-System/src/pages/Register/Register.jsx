import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { FaSpinner } from 'react-icons/fa'
import backgroundVideo from '../../assets/0917(1).mp4'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    console.log('Submitting data:', data)

    try {
      const response = await axios.post('https://koi-care-system.azurewebsites.net/api/users/register', {
        username: data.username,
        email: data.email,
        password: data.password
      })

      if (response.status === 200) {
        navigate('/verifyPending')
      } else {
        toast.error('Registration failed')
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const password = watch('password')

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />

      <div className='absolute bg-white p-8 rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <h2 className='text-black text-5xl font-bold font-dancing mb-6 text-center'>Register</h2>

        <form className='relative' onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className='mb-4'>
            <div className='absolute -top-[12px] left-3 font-dancing'>Email</div>
            <input
              type='email'
              id='email'
              placeholder='acd@gmail.com'
              className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email format'
                }
              })}
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
          </div>

          <div className='mb-4 relative'>
            <div className='absolute -top-[12px] left-3 font-dancing'>Username</div>
            <input
              type='text'
              id='name'
              placeholder='Name'
              className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200'
              {...register('username', { required: 'Name is required' })}
            />
            {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
          </div>

          <div className='mb-4 relative'>
            <div className='absolute -top-[12px] left-3 font-dancing'>Password</div>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              placeholder='***********'
              className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 7 characters'
                }
              })}
            />
            <span
              className='absolute right-3 top-[0.7rem] cursor-pointer text-gray-300'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                  <path d='M12 4.5C5.25 4.5 1.5 12 1.5 12s3.75 7.5 10.5 7.5S22.5 12 22.5 12 18.75 4.5 12 4.5Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                  <path d='M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z' />
                  <path d='M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z' />
                  <path d='M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z' />
                </svg>
              )}
            </span>
            {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
          </div>

          <div className='mb-4 relative'>
            <div className='absolute -top-[12px] left-3 font-dancing'>Confirm Password</div>
            <input
              type={showPassword ? 'text' : 'password'}
              id='confirm_password'
              placeholder='***********'
              className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200'
              {...register('confirm_password', {
                required: 'Confirm password is required',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
            <span
              className='absolute right-3 top-[0.7rem] cursor-pointer text-gray-300'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                  <path d='M12 4.5C5.25 4.5 1.5 12 1.5 12s3.75 7.5 10.5 7.5S22.5 12 22.5 12 18.75 4.5 12 4.5Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                  <path d='M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z' />
                  <path d='M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z' />
                  <path d='M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z' />
                </svg>
              )}
            </span>
            {errors.confirm_password && <p className='text-red-500 text-sm'>{errors.confirm_password.message}</p>}
          </div>

          <button
            className={`w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            <div className='flex items-center space-x-2'>
              {loading && <FaSpinner className='animate-spin' />}
              <span>Register</span>
            </div>
          </button>
        </form>

        <div className='text-black font-bold mt-6 text-center'>
          If you have an account?
          <Link to='/login' className='text-red-500 font-bold ml-2'>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
