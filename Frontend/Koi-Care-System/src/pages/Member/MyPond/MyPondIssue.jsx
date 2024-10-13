import TopLayout from '../../../layouts/TopLayout'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

function MyPondIssue() {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const [issue, setIssue] = useState([])
  const [selectCategory, setSelectCategory] = useState('')

  const getIssue = async () => {
    try {
      const token = localStorage.getItem('token')
      const koipondId = id
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/issues/latest/${koipondId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setIssue(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (categoryId) => {
    setSelectCategory(categoryId)
  }

  useEffect(() => {
    getIssue()
  }, [])

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />

          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='My Pond' textName='My Pond Issue' links='member/myPond' />

            <div className='border border-gray-200 mt-10'>
              <div className='flex-none w-[250px] border-r border-gray-200'>
                <div className='px-4 py-5 border-b border-gray-200'>
                  <div className='font-semibold text-xl'>All Issues</div>
                  <div className='border-b-gray-200 mt-5'>
                    {issue.map((issues) => (
                      <div
                        className={`py-3 mt-2 px-6 custom rounded-xl ${
                          selectCategory === issues.id
                            ? `${isDarkMode ? 'bg-custom-layout-dark' : ' bg-custom-layout-light'}`
                            : `${isDarkMode ? 'hover:bg-custom-layout-dark' : 'hover:bg-custom-layout-light'}`
                        }  cursor-pointer`}
                        onClick={() => handleChange(issues.id)}
                        key={issues.id}
                      >
                        {issues.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex-auto px-7 py-7'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPondIssue
