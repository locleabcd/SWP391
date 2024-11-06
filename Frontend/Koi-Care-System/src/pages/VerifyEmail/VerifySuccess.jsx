import { Link, useLocation } from 'react-router-dom'
import backgroundVideo from '../../assets/0917(1).mp4'

function VerifySuccess() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const status = queryParams.get('status')

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' src={backgroundVideo} autoPlay loop muted />
      <div className='absolute bg-white px-8 py-14 rounded-3xl shadow-md w-full max-w-md bg-opacity-30 backdrop-blur-0 border border-gray-300'>
        <p
          className={`text-center text-xl font-medium p-6 rounded-lg ${status === 'success' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}
        >
          {status === 'success'
            ? 'Thanks for your registration. Verify email successfully'
            : 'Verification failed. Please try again.'}
        </p>
        <Link to='/login' className='block bg-white px-3 py-2 text-center text-black hover:text-gray-900 mt-8 text-lg'>
          Back to login page
        </Link>
      </div>
    </div>
  )
}

export default VerifySuccess
