import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import backgroundVideo from '../../assets/0917(1).mp4'

function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const changePassword = () => {
    setLoading(true)
    setError(null)

    // Basic validation
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

    setTimeout(() => {
      // Simulate successful password change
      setLoading(false)
      navigate('/login')
    }, 2000)
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />

      <div className='absolute bg-white p-8 rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <h2 className='text-black text-3xl font-bold mb-6 text-center'>Reset Password</h2>

        {error && <div className='text-red-500 mb-4 text-center'>{error}</div>}

        <div className='mb-4 relative'>
          <div className='absolute -top-[12px] left-3 font-semibold bg-custom-Beige'>Password</div>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='*********'
            className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none transition-colors duration-200'
          />
        </div>

        <div className='mb-4 relative'>
          <div className='absolute -top-[12px] left-3 font-semibold bg-custom-Beige'>Confirm Password</div>
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='*********'
            className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none transition-colors duration-200'
          />
        </div>

        <button
          onClick={changePassword}
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
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
