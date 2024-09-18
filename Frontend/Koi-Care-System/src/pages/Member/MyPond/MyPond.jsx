import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'

function MyPond() {
  const { isDarkMode } = useDarkMode()

  return (
    <div>
      {/* member page */}
      <Header />
      <div className='min-h-screen flex bg-gray-100'>
        <LeftSideBar />
        <div
          className={`w-5/6 ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          }  shadow-xl flex flex-col`}
        >
          ádasdasdasdsdfsdfsf
        </div>
      </div>
    </div>
  )
}

export default MyPond
