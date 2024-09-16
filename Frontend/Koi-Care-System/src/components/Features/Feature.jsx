import demo from '../../assets/left_login.png'

function Feature() {
  return (
    <div className='flex h-[90vh] '>
      {/* left content */}
      <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
        <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
          <h className='text-3xl text-center font-bold mb-12'>Keep an eye on your water parameters!</h>
          <p className='text-justify text-gray-600'>
            As a pond owner, regular water measurements are part of everyday life . Keep track and store your water
            parameters in KoiControl. The app analyzes your water parameters and gives you suggestions on how to improve
            them if necessary. This way you can offer your fish optimal conditions.
          </p>
        </div>
      </div>
      {/* right content */}
      <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
        <img className='' src={demo} alt='img' />
      </div>
    </div>
  )
}

export default Feature
