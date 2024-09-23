/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import backgroundVideo from '../../assets/0917(1).mp4'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function OTP() {
  const [loading, setLoading] = useState(false)
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0, 0, 0])
  const [timerCount, setTimer] = useState(60)
  const [otp, setOtp] = useState('')
  const [disable, setDisable] = useState(true)
  const navigate = useNavigate()

  const email = localStorage.getItem('email')

  const resendOTP = () => {
    setLoading(true)
    if (disable) return
    axios
      .post(`https://koi-care-system.azurewebsites.net/api/auth/forgotPassword/${email}/${otp}`)
      .then(() => {
        setDisable(true)
        alert('A new OTP has been sent to your email.')
        setTimer(60)
      })
      .catch(console.log)
      .finally(() => setLoading(false))
  }

  const verifyOTP = () => {
    if (otp === OTPinput.join('')) {
      navigate('/resetPassword')
      toast.success('Navigate to reset password')
    } else {
      alert('The code you entered is incorrect. Please try again or resend the OTP.')
    }
  }

  useEffect(() => {
    setOtp(OTPinput.join(''))
  }, [OTPinput])

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval)
          setDisable(false)
        }
        return lastTimerCount > 0 ? lastTimerCount - 1 : 0
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [disable])

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />

      <div className='absolute bg-white p-8 min-w-[65vh] rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <h2 className='text-black text-3xl font-bold mb-6 text-center'>Email Verification</h2>
        <h5 className='text-black text-xl font-bold mb-6 text-center'>We have sent a code to your email {email}</h5>

        <div className='flex flex-row items-center justify-between mx-auto w-full mb-6'>
          {OTPinput.map((_, index) => (
            <div className='w-16 h-16' key={index}>
              <input
                maxLength='1'
                className='w-full h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
                type='text'
                onChange={(e) => {
                  const updatedOtp = [...OTPinput]
                  updatedOtp[index] = e.target.value
                  setOTPinput(updatedOtp)
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={verifyOTP}
          className={`w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold mb-6 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className='flex items-center space-x-2'>
            {loading && <FaSpinner className='animate-spin' />}
            <span>Verify Account</span>
          </div>
        </button>

        <div className='flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500'>
          <p className='text-black'>Didn't receive the code?</p>
          <a
            className='flex flex-row items-center'
            style={{
              color: disable ? 'gray' : 'blue',
              cursor: disable ? 'not-allowed' : 'pointer',
              textDecoration: disable ? 'none' : 'underline'
            }}
            onClick={resendOTP}
          >
            {disable ? `Resend OTP in ${timerCount}s` : 'Resend OTP'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default OTP
