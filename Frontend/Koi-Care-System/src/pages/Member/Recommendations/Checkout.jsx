import { Link } from 'react-router-dom'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Checkout() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [payment, SetPayment] = useState([])
  const [cart, setCart] = useState([])
  const { isDarkMode } = useDarkMode()
  const [tinh, setTinh] = useState([])
  const [selectedTinh, setSelectedTinh] = useState('0')
  const [quan, setQuan] = useState([])
  const [selectedQuan, setSelectedQuan] = useState('0')
  const [phuong, setPhuong] = useState([])
  const [selectedPhuong, setSelectedPhuong] = useState('0')
  const [destination, setDestination] = useState('')

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
      await axios.post(
        'https://koicaresystemv3.azurewebsites.net/api/orders/order',
        {
          userId: userId,
          address: destination,
          phone: phone,
          recipientName: name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setAddress('')
      setPhone('')
      setName('')
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

      const response = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/carts/cart/${cartId}/my-cart`, {
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

  const createPayment = async () => {
    try {
      const token = localStorage.getItem('token')
      const orderId = 3
      const totalPrice = localStorage.getItem('totalPrice')
      const res = await axios.get('https://koicaresystemv3.azurewebsites.net/api/payment/vn-pay', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          amount: totalPrice,
          orderId: orderId
        }
      })
      SetPayment(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    createPayment()
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
            <TopLayout text='Recommendations' textName='Checkout' links='member/recommendations' />

            <div className='border border-gray-200 px-10 py-5 rounded-xl'>
              <ol className='items-center flex w-full px-52 pb-20 pt-14 justify-center text-center text-sm font-medium text-gray-700'>
                <li className='flex items-center after:mx-2 after:mb-10 after:h-1 after:w-full w-full after:border-b after:border-gray-400 dark:text-primary-500'>
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
                  <span className='flex flex-col'>
                    <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white '>
                      3
                    </div>
                    <div className='mt-4'>Payment</div>
                  </span>
                </li>
              </ol>

              <div className='border border-gray-200 px-10 py-5 mt-10 rounded-xl'>
                <div className='text-2xl font-semibold'>Address</div>
                <div className='flex mt-7 text-xl gap-24 justify-between items-center w-full'>
                  <div className='flex flex-col w-full'>
                    <input
                      type='text'
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Name'
                      className='border px-4 mt-3 rounded-lg py-3 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                    ></input>
                  </div>
                  <div className='flex flex-col w-full'>
                    <input
                      type='text'
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder='Phone'
                      className='border px-4 mt-3 rounded-lg py-3 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                    ></input>
                  </div>
                </div>
                <div className='flex gap-7 mt-7'>
                  <select
                    className='border border-gray-200 py-3 px-4 rounded-lg'
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
                    className='border border-gray-200 py-3 px-4 rounded-lg'
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
                    className='border border-gray-200 py-3 px-4 rounded-lg'
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
                <div className='flex flex-col w-full mt-7 text-xl'>
                  <input
                    type='text'
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='Address'
                    className='border px-4 mt-3 rounded-lg py-3 border-gray-200 outline-none focus:ring-2 focus:ring-blue-400'
                  ></input>
                </div>
              </div>

              <div className='border border-gray-200 px-10 py-5 mt-10 rounded-xl'>
                <div className='text-2xl font-semibold'>Order Summary</div>
                <div className='flex mt-7 text-xl justify-between'>
                  <div className=''>Sub Total</div>
                  <div className=''>
                    {(cart?.totalAmount ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>

                <div className='flex mt-7 text-xl justify-between'>
                  <div className=''>Discount</div>
                  <div className=''> {(0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                </div>

                <div className='flex mt-7 text-xl justify-between'>
                  <div className=''>Shipping</div>
                  <div className=''>Free</div>
                </div>

                <div className='flex mt-7 text-xl justify-between'>
                  <div className='font-medium'>Total</div>
                  <div className=''>
                    {(cart?.totalAmount ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                </div>
              </div>

              <div className='flex justify-between mt-8'>
                <Link
                  to='/member/cartList'
                  className='px-6 py-3 bg-gray-300 hover:bg-gray-400 text-white rounded-lg cursor-pointer'
                >
                  Back
                </Link>
                <Link
                  to={payment.paymentUrl}
                  type='submit'
                  onClick={() => addAddress()}
                  className='px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg cursor-pointer'
                >
                  Complete order
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