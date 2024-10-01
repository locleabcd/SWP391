import { Link } from 'react-router-dom'
import { useDarkMode } from '../components/DarkModeContext'

// eslint-disable-next-line react/prop-types
function TopLayout({ text, textName, links }) {
  const { isDarkMode } = useDarkMode()

  return (
    <div
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
          <div className='text-2xl mb-1'> &gt; </div>
          <Link to={`/${links}`} className={textName ? 'text-gray-400' : ''}>
            {text}
          </Link>
          {textName && (
            <>
              <div className='text-xl mb-1'>&gt;</div>
              <div className=''>{textName}</div>
            </>
          )}
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default TopLayout
