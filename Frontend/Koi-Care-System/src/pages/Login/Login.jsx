import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaSpinner } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import backgroundVideo from '../../assets/0917(1).mp4'
import ReCAPTCHA from 'react-google-recaptcha'
import { TextField, InputAdornment } from '@mui/material'
function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storeTokenFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const role = urlParams.get('role')
      const id = urlParams.get('id')
      const name = urlParams.get('username')
      const avt = urlParams.get('avatar')
      console.log(token)
      console.log(id)
      console.log(name)
      console.log(avt)

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('id', id)
        localStorage.setItem('name', name)
        navigate('/member/dashboard')
      }
    }

    storeTokenFromURL()
  }, [navigate])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)

    // if (!captcha) {
    //   toast.warn('Please complete reCAPTCHA')
    //   setLoading(false)
    //   return
    // }

    try {
      const response = await axios.post('https://koicaresystemv2.azurewebsites.net/api/auth/loginKoiCare', {
        username: data.username,
        password: data.password
      })

      const user = response.data.data
      if (user && user.token) {
        localStorage.setItem('token', user.token)
        localStorage.setItem('role', user.role)
        localStorage.setItem('id', user.id)
        localStorage.setItem('name', user.username)
        localStorage.setItem('avt', user.avatar)

        const role = user.role

        switch (role) {
          case 'ADMIN':
            navigate('/admin/dashboard')
            break
          case 'SHOP':
            navigate('/shop/dashboard')
            break
          case 'MEMBER':
            navigate('/member/dashboard')
            break
          default:
            break
        }
      }
    } catch (error) {
      toast.error('Invalid username or password')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />

      <div className='absolute bg-white p-8 rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <h2 className='text-black text-5xl font-bold mb-6 text-center'>Login</h2>

        <form className='relative' onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className='mb-4 relative'>
            <TextField
              id='username'
              label='Username'
              variant='outlined'
              {...register('username', { required: 'Name is required' })}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : ''}
              className='w-full p-3 '
            />
          </div>

          <div className='mb-4 relative'>
            <TextField
              id='password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              variant='outlined'
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <span className='cursor-pointer text-gray-300' onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='size-6'
                        >
                          <path d='M12 4.5C5.25 4.5 1.5 12 1.5 12s3.75 7.5 10.5 7.5S22.5 12 22.5 12 18.75 4.5 12 4.5Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z' />
                        </svg>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='size-6'
                        >
                          <path d='M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z' />
                          <path d='M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z' />
                          <path d='M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z' />
                        </svg>
                      )}
                    </span>
                  </InputAdornment>
                )
              }}
              className='w-full p-3 bg-gray-700 bg-transparent'
            />
            <ErrorMessage errors={errors} name='password' as='p' className='text-red-500 text-sm' />
          </div>

          <ReCAPTCHA sitekey='6Lf_-EUqAAAAACdtnX38OBQj-ok8Kt51EPQQ5cxy' onChange={(cap) => setCaptcha(cap)} />

          <div className='flex items-center justify-between mb-2'>
            <label className='inline-flex items-center text-gray-400'>
              <input type='checkbox' className='form-checkbox text-blue-500 rounded' />
              <span className='ml-2 text-black font-bold'>Remember me</span>
            </label>
            <Link to='/email' className='text-black font-bold cursor-pointer mt-2'>
              Forgot password?
            </Link>
          </div>

          <button
            className={`w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading && !captcha}
          >
            <div className='flex items-center space-x-2'>
              {loading && <FaSpinner className='animate-spin' />}

              <span>Sign in</span>
            </div>
          </button>
        </form>

        <div className='flex items-center mb-2 mt-2'>
          <div className='flex-1 h-1 w-1 bg-gray-300'></div>
          <div className='text-gray-400 font-bold text-lg px-3'>or</div>
          <div className='flex-1 h-1 w-1 bg-gray-300'></div>
        </div>

        <div className='flex items-center justify-between mt-2'>
          <Link
            to='https://koicaresystemv2.azurewebsites.net/api/oauth2/authorization/google?redirect_uri=https://koi-care-system.vercel.app/member/dashboard'
            className='flex items-center justify-center bg-white border hover:bg-gray-100 border-gray-300 text-gray-800 w-full py-3 rounded-lg mr-2'
          >
            <img src='https://www.google.com/favicon.ico' alt='Google' className='h-5 mr-2' />
            Sign in with Google
          </Link>
        </div>

        <div className='text-black font-bold mt-2 text-center'>
          Do not have an account?
          <Link to='/register' className='text-red-500 ml-1 font-bold'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
