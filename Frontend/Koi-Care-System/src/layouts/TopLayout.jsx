import { Link } from 'react-router-dom'
import { useDarkMode } from '../hooks/DarkModeContext'
import { motion } from 'framer-motion'
import { FadeRight } from '../utils/animation'

// eslint-disable-next-line react/prop-types
function TopLayout({ text, textName, links }) {
  const { isDarkMode } = useDarkMode()

  return (
    <motion.div
      variants={FadeRight(0.3)}
      initial='hidden'
      animate='visible'
      className={`${
        isDarkMode ? ' bg-custom-layout-dark text-white' : 'bg-custom-layout-light '
      }  flex w-full rounded-xl py-[30px] px-[25px] mb-[30px] relative`}
    >
      <div>
        {textName ? <div className='text-3xl mb-2'>{textName}</div> : <div className='text-3xl mb-2'>{text}</div>}
        <div className='flex gap-3 items-center justify-center'>
          <Link to='/member' className='text-gray-400'>
            Home
          </Link>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1rem'
            height='1rem'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            className='tabler-icon tabler-icon-chevron-down opacity-40'
            transform='rotate(-90)'
          >
            <path d='M6 9l6 6l6 -6' />
          </svg>
          <Link to={`/${links}`} className={textName ? 'text-gray-400' : ''}>
            {text}
          </Link>
          {textName && (
            <>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1rem'
                height='1rem'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                className='tabler-icon tabler-icon-chevron-down opacity-40'
                transform='rotate(-90)'
              >
                <path d='M6 9l6 6l6 -6' />
              </svg>{' '}
              <div className=''>{textName}</div>
            </>
          )}
        </div>
      </div>
      <div></div>
    </motion.div>
  )
}

export default TopLayout
