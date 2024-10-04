import { useDispatch, useSelector } from 'react-redux'
import { RemoveFromWishlist } from '../../../redux/store/wishList'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useDarkMode } from '../../../components/DarkModeContext'
import TopLayout from '../../../layouts/TopLayout'
import { useState } from 'react'

const WishList = () => {
  const wishlist = useSelector((state) => state.name.wishlist)
  const dispatch = useDispatch()
  const { isDarkMode } = useDarkMode()
  const [count, setCount] = useState(1)

  const increment = () => {
    setCount((prevCount) => prevCount + 1)
  }

  const decrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount))
  }

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

          <div className='py-5 px-[30px] mx-auto '>
            <TopLayout text='Recommendations' textName='Wish List' links='member/recommendations' />
            <div>
              {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
              ) : (
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr className=''>
                      <th
                        scope='col'
                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Product
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-center border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-center border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Price
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-center border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Quantity
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-center border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {wishlist.map((item) => (
                      <tr key={item.id}>
                        {/* Product Image */}
                        <td className='px-6 py-4 text-center border border-gray-200 whitespace-nowrap'>
                          <img
                            src={item.images[0].downloadUrl}
                            alt=''
                            className='mx-auto w-[100px] h-[100px] rounded-lg'
                          />
                        </td>

                        <td className='px-6 py-4 text-center border border-gray-200 whitespace-nowrap'>
                          <div className='font-medium text-gray-900'>{item.name}</div>
                        </td>

                        <td className='px-6 py-4 text-center border border-gray-200 whitespace-nowrap'>
                          <div className='text-gray-600'>${item.price}</div>
                        </td>

                        <td className='px-6 py-4 border border-gray-200 whitespace-nowrap'>
                          <div className='flex gap-5 items-center justify-center mx-auto w-full'>
                            <div className='text-xl font-semibold'>Quantity:</div>
                            <div className='flex border border-blue-400 gap-5 rounded-lg'>
                              <button className='border-blue-400 border-r rounded-lg p-2' onClick={decrement}>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='size-8 text-blue-400'
                                >
                                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                                </svg>
                              </button>
                              <input
                                type='text'
                                value={count}
                                readOnly
                                className={`outline-none w-10 text-center text-xl text-blue-400 ${
                                  isDarkMode ? 'bg-custom-dark' : ''
                                }`}
                              />
                              <button className='border-l border-blue-400 p-2' onClick={increment}>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={1.5}
                                  stroke='currentColor'
                                  className='size-8 text-blue-400'
                                >
                                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-center border border-gray-200'>
                          <button
                            onClick={() => dispatch(RemoveFromWishlist(item))}
                            className='text-red-500 hover:text-red-700 transition duration-200'
                            aria-label={`Remove ${item.name} from wishlist`}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className={`size-11 text-red-500 cursor-pointer`}
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishList
