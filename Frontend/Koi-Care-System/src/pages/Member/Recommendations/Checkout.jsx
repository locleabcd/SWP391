import { Link, useNavigate } from 'react-router-dom'
import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Checkout() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [cart, setCart] = useState([])
  const { isDarkMode } = useDarkMode()
  const [tinh, setTinh] = useState([])
  const [selectedTinh, setSelectedTinh] = useState('0')
  const [quan, setQuan] = useState([])
  const [selectedQuan, setSelectedQuan] = useState('0')
  const [phuong, setPhuong] = useState([])
  const [selectedPhuong, setSelectedPhuong] = useState('0')
  const [destination, setDestination] = useState('')
  const [addressError, setAddressError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [nameError, setNameError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const selectedProvince = tinh.find((item) => item.id === selectedTinh)?.full_name || ''

    const selectedDistrict = quan.find((item) => item.id === selectedQuan)?.full_name || ''

    const selectedWard = phuong.find((item) => item.id === selectedPhuong)?.full_name || ''

    setDestination(`${address}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`.trim())
  }, [address, selectedTinh, selectedQuan, selectedPhuong, tinh, quan, phuong])

  const addAddress = async () => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')

      if (!destination || destination.trim() === '') {
        setAddressError('Address cannot be empty')
        return
      } else {
        setAddressError('')
      }

      if (!name || name.trim() === '') {
        setNameError('Name cannot be empty')
        return
      } else {
        setNameError('')
      }

      const phoneRegex = /^0\d{8,9}$/
      if (!phoneRegex.test(phone)) {
        setPhoneError('Phone number must be 9 or 10 digits and start with 0')
        return
      } else {
        setPhoneError('')
      }

      await axios.post(
        'https://koicaresystemv2.azurewebsites.net/api/orders/order',
        {
          userId: userId,
          address: destination,
          phone: phone,
          recipientName: name,
          note: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      navigate('/member/payment')
      setAddress('')
      setPhone('')
      setName('')
      setAddressError('')
      setPhoneError('')
    } catch (error) {
      console.log(error)
    }
  }

  const getCartId = async () => {
    try {
      const token = localStorage.getItem('token')
      const cartId = localStorage.getItem('cartId')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`https://koicaresystemv2.azurewebsites.net/api/carts/cart/${cartId}/my-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCart(response.data.data)
      console.log(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCartId()
  }, [])

  useEffect(() => {
    axios
      .get('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then((response) => {
        if (response.data.error === 0) {
          setTinh(response.data.data)
        }
      })
      .catch((error) => console.error('Error fetching provinces:', error))
  }, [])

  useEffect(() => {
    if (selectedTinh !== '0') {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${selectedTinh}.htm`)
        .then((response) => {
          if (response.data.error === 0) {
            setQuan(response.data.data)
            setPhuong([])
          }
        })
        .catch((error) => console.error('Error fetching districts:', error))
    }
  }, [selectedTinh])

  useEffect(() => {
    if (selectedQuan !== '0') {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${selectedQuan}.htm`)
        .then((response) => {
          if (response.data.error === 0) {
            setPhuong(response.data.data)
          }
        })
        .catch((error) => console.error('Error fetching wards:', error))
    }
  }, [selectedQuan])

  const subTotal = Number(localStorage.getItem('totalPrice') || 0)
  const promotionTotal = Number(localStorage.getItem('promotionTotal') || 0)

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

          <div className='py-5 px-[30px] mx-auto max-w-[1750px] '>
            <TopLayout text='Recommendations' textName='Checkout' links='member/recommendations' />

            <div className='lg:border lg:border-gray-200 lg:px-10 lg:py-5 rounded-xl'>
              <ol className='items-center lg:flex hidden w-full px-52 pb-20 pt-14 justify-center text-center text-sm font-medium text-gray-700'>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400'>
                  <span className='flex flex-col'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-10 bg-blue-400 rounded-full text-white'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <div className='mt-4'>Cart</div>
                  </span>
                </li>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400 dark:text-primary-500'>
                  <span className='flex flex-col'>
                    <div className='w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white '>
                      2
                    </div>
                    <div className='mt-4'>Address</div>
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='fpalex flex-col'>
                    <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white '>
                      3
                    </div>
                    <div className='mt-4'>Payment</div>
                  </span>
                </li>
              </ol>

              <div className='lg:border lg:border-gray-200 lg:px-10 lg:py-5 lg:mt-10 rounded-xl'>
                <div className='lg:text-2xl text-xl font-semibold'>Address</div>
                <div className='flex flex-col lg:flex-row lg:mt-7 mt-3 text-xl lg:gap-24 justify-between items-center w-full'>
                  <div className='flex flex-col w-full'>
                    <input
                      type='text'
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Name'
                      className='border lg:px-4 px-3 lg:mt-3 lg:text-lg text-base mt-5 rounded-lg lg:py-3 py-1 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                    ></input>
                    {nameError && <p className='text-red-500 lg:text-base text-xs mt-3'>{nameError}</p>}
                  </div>
                  <div className='flex flex-col w-full'>
                    <input
                      type='text'
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder='Phone'
                      className='border lg:px-4 px-3 lg:mt-3 lg:text-lg text-base mt-5 rounded-lg lg:py-3 py-1 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                    ></input>
                    {phoneError && <p className='text-red-500 lg:text-base text-xs'>{phoneError}</p>}
                  </div>
                </div>
                <div className='flex flex-col lg:flex-row lg:gap-7 gap-2 lg:mt-7 mt-5'>
                  <select
                    className='border border-gray-200 lg:py-3 lg:px-4 px-3 py-1 rounded-lg'
                    id='tinh'
                    name='tinh'
                    value={selectedTinh}
                    onChange={(e) => setSelectedTinh(e.target.value)}
                    title='Chọn Tỉnh Thành'
                  >
                    <option value='0'>Province</option>
                    {tinh.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>

                  <select
                    className='border border-gray-200 lg:py-3 lg:px-4 px-3 py-1 lg:mt-0 mt-3 rounded-lg'
                    id='quan'
                    name='quan'
                    value={selectedQuan}
                    onChange={(e) => setSelectedQuan(e.target.value)}
                    title='Chọn Quận Huyện'
                    disabled={selectedTinh === '0'}
                  >
                    <option value='0'>District</option>
                    {quan.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>

                  <select
                    className='border border-gray-200 lg:py-3 lg:px-4 px-3 py-1 lg:mt-0 mt-3 rounded-lg'
                    id='phuong'
                    name='phuong'
                    value={selectedPhuong}
                    onChange={(e) => setSelectedPhuong(e.target.value)}
                    title='Chọn Phường Xã'
                    disabled={selectedQuan === '0'}
                  >
                    <option value='0'>Ward</option>
                    {phuong.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col w-full lg:mt-7 mt-5 text-xl'>
                  <input
                    type='text'
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='Address'
                    className='border lg:px-4 px-4 py-1 lg:mt-3 rounded-lg lg:text-lg text-base lg:py-3 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                  ></input>
                  {addressError && <p className='text-red-500 lg:text-base text-xs'>{addressError}</p>}
                </div>
                <div className='flex flex-col w-full lg:mt-7 mt-5 text-xl'>
                  <textarea
                    type='text'
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='Note'
                    className='border lg:px-4 px-4 py-1 lg:mt-3 rounded-lg lg:text-lg text-base lg:py-6 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                  ></textarea>
                </div>
              </div>

              <div className='lg:border lg:border-gray-200 lg:px-10 lg:py-5 mt-10 rounded-xl'>
                <div className='lg:text-2xl text-xl font-semibold'>Order Summary</div>
                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className=''>Sub Total</div>
                  <div className=''>{subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                </div>

                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className=''>Discount</div>
                  <div className=''>
                    {' '}
                    {(subTotal - promotionTotal).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>

                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className=''>Shipping</div>
                  <div className=''>Free</div>
                </div>

                <div className='flex mt-5 lg:mt-7 text-lg lg:text-xl justify-between'>
                  <div className='font-medium'>Total</div>
                  <div className=''>
                    {(cart?.totalAmount ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>
              </div>

              <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between mt-8'>
                <Link
                  to={-1}
                  className='w-full lg:w-auto px-6 py-3 bg-gray-300 hover:bg-gray-400 text-white text-center rounded-lg cursor-pointer'
                >
                  Back
                </Link>
                <Link
                  onClick={() => addAddress()}
                  className='w-full lg:w-auto px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-center cursor-pointer'
                >
                  Payment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
