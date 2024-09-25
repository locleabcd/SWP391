import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import backgroundVideo from '../../assets/0917(1).mp4'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Email() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const navigateOTP = async () => {
    setLoading(true)
    localStorage.setItem('email', email)
    axios
      .post(`https://koi-care-system.azurewebsites.net/api/auth/forgotPassword/${email}`)
      .then(() => navigate('/otp'))
      .then(() => toast.success('A new OTP has been sent to your email.'))
      .finally(() => setLoading(false))
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />

      <div className='absolute bg-white p-8 rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <h2 className='text-black text-3xl font-bold mb-6 text-center'>Forgot Password</h2>

        <div className='mb-4 relative'>
          <div className='absolute -top-[12px] left-3 font-semibold bg-custom-Beige'>Email</div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            id='username'
            placeholder='abcd@gmail.com'
            className='w-full p-3 bg-gray-700 bg-transparent border border-gray-500 placeholder-gray-500 rounded-lg focus:outline-none transition-colors duration-200'
          />
        </div>

        <button
          onClick={() => navigateOTP()}
          className={`w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className='flex items-center space-x-2'>
            {loading && <FaSpinner className='animate-spin' />}

            <span>Send OTP</span>
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

export default Email
