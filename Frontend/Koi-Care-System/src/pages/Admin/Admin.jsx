import { useDarkMode } from '../../components/DarkModeContext'
import Header from '../../components/Admin/HeaderAdmin'
import LeftSideBar from '../../components/Admin/LeftSideBarAdmin'

function Admin() {
  const { isDarkMode } = useDarkMode()

  return (
    <div>
      {/* Admin page */}
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
        </div>
      </div>
    </div>
  )
}

export default Admin
