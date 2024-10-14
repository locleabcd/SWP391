/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Admin/Header'
import LeftSideBar from '../../../components/Admin/LeftSideBar'
import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutAD'
 function ShopAD() {
    const { isDarkMode } = useDarkMode()
    const [manageShops, setManageShops] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const getUsers = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            throw new Error('No token found')
          }
    
          const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const shopUsers = res.data.data.filter(user => user.role === 'SHOP');
          console.log(shopUsers)
          setManageShops(shopUsers)
        } catch (error) {
          console.log('Error fetching promotions:', error)
        }
      }
    
      useEffect(() => {
        getUsers()
      }, [])
      
  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${isDarkMode ? 'bg-custom-light text-white' : 'bg-white text-black'} overflow-y-auto flex-1 flex-col overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />
          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='Shop' />
          </div>
          <div className='overflow-x-auto mt-6'>
            <table className='min-w-full border-spacing-x-1 border-gray-200'>
              <thead>
                <tr className='border-b'>
                  <th className='py-3 px-4 text-center text-xs font-bold uppercase'>No</th>
                  <th className='py-3 px-4 text-center text-xs font-bold uppercase'>User Name</th>
                  <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Email</th>
                  <th className='py-3 px-4 text-center text-xs font-bold uppercase'>Role</th>
                  <th className='py-3 px-4 text-center text-xs font-bold uppercase'>action</th>
                </tr>
              </thead>
              <tbody>
                {manageShops.map((manageShops, index) => (
                  <tr key={manageShops.id}>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{index + 1}</td>
                    <td className='py-2 pl-4 text-center border-b border-gray-200'>{manageShops.username}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{manageShops.email}</td>
                    <td className='py-2 px-1 text-center border-b border-gray-200'>{manageShops.role}</td>
                    <td className='py-2 px-2 text-center border-b border-gray-200'>
                      <div className='flex justify-center items-center'>
                        <Link
                          to={`/admin/users/${manageShops.userId}`}
                          className=' p-1 hover:bg-green-500 text-green-500 hover:text-white  rounded-full'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                          </svg>

                        </Link>
                        <button
                            className='p-1 hover:bg-red-500 text-red-600 hover:text-white rounded-full'
                            // onClick={() => (.id)}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='size-5'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ShopAD