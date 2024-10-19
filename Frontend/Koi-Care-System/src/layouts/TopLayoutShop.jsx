import { Link } from 'react-router-dom'
import { useDarkMode } from '../hooks/DarkModeContext'

// eslint-disable-next-line react/prop-types
function TopLayout({ text, textName, links }) {
  const { isDarkMode } = useDarkMode()

  return (
    <div
      className={`${
        isDarkMode ? 'bg-custom-layout-dark text-white' : 'bg-custom-layout-light '
      }  flex w-full rounded-xl py-[30px] px-[25px] mb-[30px] relative`}
    >
      <div>
        <div className='text-3xl mb-2'>{text}</div>
        <div className='flex gap-3 items-center'>
          <Link to='/shop/dashboard' className='text-gray-400'>
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
            className='tabler-icon tabler-icon-chevron-down opacity-40 lg:size-4 size-3'
            transform='rotate(-90)'
          >
            <path d='M6 9l6 6l6 -6' />
          </svg>
          <Link to={`/${links}`} className={textName ? 'text-gray-400 lg:text-lg text-sm' : 'lg:text-lg text-sm'}>
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
              <div className='lg:text-lg text-sm'>{textName}</div>
            </>
          )}
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default TopLayout
