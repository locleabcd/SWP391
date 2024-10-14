import { useDarkMode } from '../../hooks/DarkModeContext'
import Header from '../../components/Member/Header'
import LeftSideBar from '../../components/Member/LeftSideBar'

function Member() {
  const { isDarkMode } = useDarkMode()

  // eslint-disable-next-line no-undef
  const token = response.headers['authorization']
  if (token) {
    localStorage.setItem('token', token.replace('Bearer ', ''))
  }

  return (
    <div>
      {/* member page */}
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

export default Member
