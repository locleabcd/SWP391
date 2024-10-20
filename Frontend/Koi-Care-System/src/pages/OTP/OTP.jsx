/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import backgroundVideo from '../../assets/0917(1).mp4'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaSpinner } from 'react-icons/fa'

function OTP() {
  const [OTPinput, setOTPinput] = useState([0, 0, 0, 0, 0, 0])
  const [timerCount, setTimer] = useState(60)
  const [disable, setDisable] = useState(true)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const email = localStorage.getItem('email')

  const resendOTP = () => {
    if (disable) return
    setLoading(true)
    axios
      .post(`https://koicaresystemv4.azurewebsites.net/api/auth/forgotPassword/${email}`)
      .then(() => {
        setDisable(true)
        setTimer(60)
        toast.success('A new OTP has been sent to your email.')
      })
      .finally(() => setLoading(false))
  }

  const verifyOTP = async () => {
    const otp = OTPinput.join('')
    localStorage.setItem('otp', otp)
    axios
      .post(`https://koicaresystemv4.azurewebsites.net/api/auth/verifyOtp/${email}/${otp}`)
      .then(() => {
        navigate('/resetPassword')
        toast.success('input OTP success')
      })
      .catch(() => toast.error('input OTP fail !!'))
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval)
        if (lastTimerCount <= 1) setDisable(false)
        if (lastTimerCount <= 0) return lastTimerCount
        return lastTimerCount - 1
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
          <div className='w-16 h-16'>
            <input
              maxLength='1'
              className='w-full font-bold h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
              type='text'
              onChange={(e) => {
                setOTPinput([e.target.value, OTPinput[1], OTPinput[2], OTPinput[3], OTPinput[4], OTPinput[5]])
              }}
            />
          </div>
          <div className='w-16 h-16'>
            <input
              maxLength='1'
              className='w-full font-bold h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
              type='text'
              onChange={(e) => {
                setOTPinput([OTPinput[0], e.target.value, OTPinput[2], OTPinput[3], OTPinput[4], OTPinput[5]])
              }}
            />
          </div>
          <div className='w-16 h-16'>
            <input
              maxLength='1'
              className='w-full font-bold h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
              type='text'
              onChange={(e) => {
                setOTPinput([OTPinput[0], OTPinput[1], e.target.value, OTPinput[3], OTPinput[4], OTPinput[5]])
              }}
            />
          </div>
          <div className='w-16 h-16'>
            <input
              maxLength='1'
              className='w-full font-bold h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
              type='text'
              onChange={(e) => {
                setOTPinput([OTPinput[0], OTPinput[1], OTPinput[2], e.target.value, OTPinput[4], OTPinput[5]])
              }}
            />
          </div>
          <div className='w-16 h-16'>
            <input
              maxLength='1'
              className='w-full font-bold h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
              type='text'
              onChange={(e) => {
                setOTPinput([OTPinput[0], OTPinput[1], OTPinput[2], OTPinput[3], e.target.value, OTPinput[5]])
              }}
            />
          </div>
          <div className='w-16 h-16'>
            <input
              maxLength='1'
              className='w-full font-bold h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border text-lg bg-gray-700 bg-transparent focus:ring-1 ring-red-600 border-gray-500 placeholder-gray-500'
              type='text'
              onChange={(e) => {
                setOTPinput([OTPinput[0], OTPinput[1], OTPinput[2], OTPinput[3], OTPinput[4], e.target.value])
              }}
            />
          </div>
        </div>

        <button
          onClick={() => verifyOTP()}
          className='w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold mb-6'
        >
          <div className='flex items-center space-x-2'>
            {loading && <FaSpinner className='animate-spin' />}
            <span>Verify Account</span>
          </div>
        </button>

        <div className='flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-black'>
          <p className='text-black'>Didn't receive the code?</p>
          <Link
            className='flex flex-row items-center font-bold'
            style={{
              color: disable ? 'black' : 'blue',
              cursor: disable ? 'not-allowed' : 'pointer',
              textDecoration: disable ? 'none' : 'underline'
            }}
            onClick={() => resendOTP()}
          >
            {disable ? `Resend OTP in ${timerCount}s` : 'Resend OTP'}
          </Link>
        </div>

        {/* <div className='text-black font-bold mt-2 text-center'>
          <Link to='/email' className='text-black ml-1 font-bold'>
            Back to input email
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default OTP
