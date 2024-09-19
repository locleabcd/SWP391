import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios from 'axios'

function MyPond() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koi-care-system.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(res.data.data)
      setPonds(res.data.data)
    } catch (error) {
      console.error('Error fetching ponds:', error)
    }
  }

  useEffect(() => {
    getPond()
  }, [])

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
          <div className='p-4 w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {ponds.map((pond) => (
                <div key={pond.id} className='border p-4 rounded-lg shadow'>
                  <img src={pond.imageUrl} alt={pond.name} className='w-full h-44 object-cover mb-4 rounded-md' />
                  <div className='flex'>
                    <h3 className='text-base w-36'>Pond:</h3>
                    <h3 className='text-base font-semibold'>{pond.name}</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-36'>Drain Count:</h3>
                    <h3 className='text-base font-semibold'>{pond.drainCount}</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-36'>Depth:</h3>
                    <h3 className='text-base font-semibold'>{pond.depth}m</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-36'>Skimmer:</h3>
                    <h3 className='text-base font-semibold'>{pond.skimmer}</h3>
                  </div>
                  <div className='flex'>
                    <h3 className='text-base w-36'>Pump Capacity:</h3>
                    <h3 className='text-base font-semibold'>{pond.pumpCapacity}L/min</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPond
