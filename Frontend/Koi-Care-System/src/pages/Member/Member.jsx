import { useDarkMode } from '../../components/DarkModeContext'
import Header from '../../components/Member/Header'
import LeftSideBar from '../../components/Member/LeftSideBar'

function Member() {
  const { isDarkMode } = useDarkMode()

  return (
    <div>
      {/* member page */}
      <div className='min-h-screen flex'>
        <LeftSideBar />

        {/* dashboard page  */}
        <div
          className={`w-5/6 ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'
          }  shadow-xl flex flex-col`}
        >
          <Header />
        </div>
      </div>
    </div>
  )
}

export default Member
