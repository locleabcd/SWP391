/* eslint-disable react/no-unescaped-entities */
import pond from '../../assets/KoiPond.png'
import food from '../../assets/FoodCalculator.png'
import statistics from '../../assets/Statistic.png'
import { motion } from 'framer-motion'
import { FadeRight } from '../../utils/animation'

function Feature() {
  return (
    <div>
      <div className='flex h-[90vh] bg-custom-dark text-white'>
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={FadeRight(1)}
              className='text-3xl text-center font-bold mb-12'
            >
              Keep an eye on your water parameters!
            </motion.div>
            <motion.div initial='hidden' animate='visible' variants={FadeRight(1.2)} className='text-justify '>
              As a pond owner, regular water measurements are part of everyday life . Keep track and store your water
              parameters in KoiControl. The app analyzes your water parameters and gives you suggestions on how to
              improve them if necessary. This way you can offer your fish optimal conditions.
            </motion.div>
          </div>
        </div>
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={pond} alt='img' />
        </div>
      </div>
      <div className='flex h-[90vh] bg-custom-dark text-white'>
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Manage and track your koi!</h>
            <p className='text-justify '>
              With many koi in the pond, it's easy to lose track. With KoiControl you won't! You can save all important
              information about your fish, such as name, variety, age, size, weight and much more. Additionally, you can
              track the growth of your fish exactly and thus make your success measurable.
            </p>
          </div>
        </div>
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={food} alt='img' />
        </div>
      </div>

      <div className='flex h-[90vh] bg-custom-dark text-white'>
        <div className='w-2/5 flex flex-col items-center justify-center h-full py-10'>
          <div className='flex flex-col justify-center ml-10 py-10 px-5 font-medium'>
            <h className='text-3xl text-center font-bold mb-12'>Determine the ideal amount of food!</h>
            <p className='text-justify '>
              How much food do your koi need to grow ideally? Our integrated food calculator provides you with the
              answer. Based on your koi population and the water temperature, our food calculator automatically
              calculates the recommended amount of food for your growth ambitions. You don't even need to know the
              weight of your koi. KoiControl can determine the weight very accurately based on the length of the fish.
            </p>
          </div>
        </div>
        <div className='w-3/5 flex flex-col items-center justify-center min-h-full '>
          <img className='' src={statistics} alt='img' />
        </div>
      </div>
    </div>
  )
}

export default Feature
