/* eslint-disable react/no-unescaped-entities */
import demo from '../../assets/left_login.png'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

function Feature() {
  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, delay: 300 })
  })
  return (
    <div>
      <div className='flex h-[90vh] ' data-aos='fade-up'>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Keep an eye on your water parameters!</h>
            <p className='text-justify text-gray-600'>
              As a pond owner, regular water measurements are part of everyday life . Keep track and store your water
              parameters in KoiControl. The app analyzes your water parameters and gives you suggestions on how to
              improve them if necessary. This way you can offer your fish optimal conditions.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>
      {/* homepage content */}
      <div className='flex h-[90vh] ' data-aos='fade-up'>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Manage and track your koi!</h>
            <p className='text-justify text-gray-600'>
              With many koi in the pond, it's easy to lose track. With KoiControl you won't! You can save all important
              information about your fish, such as name, variety, age, size, weight and much more. Additionally, you can
              track the growth of your fish exactly and thus make your success measurable.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>

      {/* homepage content */}
      <div className='flex h-[90vh]' data-aos='fade-up'>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Determine the ideal amount of food!</h>
            <p className='text-justify text-gray-600'>
              How much food do your koi need to grow ideally? Our integrated food calculator provides you with the
              answer. Based on your koi population and the water temperature, our food calculator automatically
              calculates the recommended amount of food for your growth ambitions. You don't even need to know the
              weight of your koi. KoiControl can determine the weight very accurately based on the length of the fish.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>

      {/* homepage content */}
      <div className='flex h-[90vh]' data-aos='fade-up'>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Recognize trends early!</h>
            <p className='text-justify text-gray-600'>
              As a koi owner, the growth of your fish and the quality of your water are paramount. With our
              automatically generated charts you can see trends and correlations in your water parameters and the
              potential of your koi at a glance. Would you like to share your success with others or record it in a
              seasonal report? Use the integrated PDF export of your statistics.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>

      {/* homepage content */}
      <div className='flex h-[90vh]' data-aos='fade-up'>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Manage your ponds!</h>
            <p className='text-justify text-gray-600'>
              All important information such as volume, circulation rate, depth and many more can be stored for a pond.
              Do you have several ponds? No problem, fish and water parameters can be clearly assigned to the
              corresponding pond.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>

      {/* homepage content */}
      <div className='flex h-[90vh]' data-aos='fade-up'>
        {/* left content */}
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Calculate the correct amount of salt for treatments!</h>
            <p className='text-justify text-gray-600'>
              Salt is a popular tool for treating koi diseases, as it is both cheap and effective against some parasites
              or algae. However, meticulous care must be taken to achieve the correct concentration. With the salt
              calculator you can calculate the correct dosage for each of your managed ponds without errors and without
              calculators.
            </p>
          </div>
        </div>
        {/* right content */}
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={demo} alt='img' />
        </div>
      </div>
    </div>
  )
}

export default Feature
