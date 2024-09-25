import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import backgroundVideo from '../../assets/0917(1).mp4'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const changePassword = () => {
    setLoading(true)
    setError(null)

    const email = localStorage.getItem('email')
    const otp = localStorage.getItem('otp')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    axios
      .post(`https://koicaresystem.azurewebsites.net/api/auth/resetPassword`, {
        email: email,
        newPassword: password,
        otp: otp
      })
      .then(() => {
        navigate('/login')
        toast.success('Reset Password successfully!!')
      })
      .catch(() => toast.error('Reset password fail'))
      .finally(() => setLoading(false))
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />

      <div className='absolute bg-white p-8 rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <h2 className='text-black text-3xl font-bold mb-6 text-center'>Reset Password</h2>

        <div className='mb-6 relative'>
          <div className='absolute -top-[12px] left-3 font-semibold bg-custom-Beige'>Password</div>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='*********'
            className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none transition-colors duration-200'
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
          {error && <div className='text-red-500'>{error}</div>}
        </div>

        <div className='mb-6 relative'>
          <div className='absolute -top-[12px] left-3 font-semibold bg-custom-Beige'>Confirm Password</div>
          <input
            type={showPassword ? 'text' : 'password'}
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='*********'
            className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none transition-colors duration-200'
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
        </div>

        <button
          onClick={() => changePassword()}
          className={`w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className='flex items-center space-x-2'>
            {loading && <FaSpinner className='animate-spin' />}
            <span>Change password</span>
          </div>
        </button>

        <div className='text-black font-bold mt-2 text-center'>
          <Link to='/login' className='text-black ml-1 font-bold'>
            Back to input OTP
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
