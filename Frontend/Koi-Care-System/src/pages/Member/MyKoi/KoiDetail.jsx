import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { MdSystemUpdateAlt } from 'react-icons/md'
import { FaSpinner } from 'react-icons/fa'
import TopLayout from '../../../layouts/TopLayout'
import { toast } from 'react-toastify'

function KoiDetails() {
  const { isDarkMode } = useDarkMode()
  const { id } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [koi, setKoi] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [ponds, setPonds] = useState([])
  const navigate = useNavigate()
  const [baseImage, setBaseImage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [growth, setGrowth] = useState([])
  const [currentGrowth, setCurrentGrowth] = useState(null)
  const [isAddGrowthFormVisible, setIsAddGrowthFormVisible] = useState(false)
  const [isEditGrowthFormVisible, setIsEditGrowthFormVisible] = useState(false)
  const [remarks, setRemarks] = useState([])
  const [currentRemark, setCurrentRemark] = useState(null)
  const [isAddRemarkFormVisible, setIsAddRemarkFormVisible] = useState(false)
  const [isEditRemarkFormVisible, setIsEditRemarkFormVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch, 
    setValue
  } = useForm()

  const length = watch('length');
  const physique = watch('physique');

  useEffect(() => {
    if (length && physique) {     
      let calculatedWeight = 0;
      const lengthCubed = Math.pow(length, 3); // length^3

      if (physique === 'Slim') {
        calculatedWeight = (1.5 * lengthCubed) / 100;
      } else if (physique === 'Normal') {
        calculatedWeight = (1.7 * lengthCubed) / 100;
      } else if (physique === 'Corpulent') {
        calculatedWeight = (2 * lengthCubed) / 100;
      }

      setValue('weight', calculatedWeight.toFixed(2));
    }
  }, [length, physique, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBaseImage(reader.result)
      }
      reader.readAsDataURL(file)
      setSelectedFile(file)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const toggleAddGrowthFormVisibility = () => {
    setIsAddGrowthFormVisible(!isAddGrowthFormVisible)
    setIsEditGrowthFormVisible(false)
    setCurrentGrowth(null)
    reset()
  }

  const toggleCloseGrowthForm = () => {
    setIsEditGrowthFormVisible(!isEditGrowthFormVisible)
    setIsAddGrowthFormVisible(false)
    setCurrentGrowth(null)
    setBaseImage(null)
    reset(growth)
  }

  const toggleEditGrowthFormVisibility = (growth) => {
    if (growth) {
      setCurrentGrowth(growth)
      setIsEditGrowthFormVisible(true)
      setIsAddGrowthFormVisible(false)
      reset()
    }
  }

  const toggleAddRemarkFormVisibility = () => {
    setIsAddRemarkFormVisible(!isAddRemarkFormVisible)
    setIsEditRemarkFormVisible(false)
    setCurrentRemark(null)
    reset()
  }

  const toggleCloseRemarkForm = () => {
    setIsEditRemarkFormVisible(!isEditRemarkFormVisible)
    setIsAddRemarkFormVisible(false)
    setCurrentRemark(null)
    setBaseImage(null)
    reset(remarks)
  }

  const toggleEditRemarkFormVisibility = (remarks) => {
    if (remarks) {
      setCurrentRemark(remarks)
      setIsEditRemarkFormVisible(true)
      setIsAddRemarkFormVisible(false)
      reset()
    }
  }

  const getGrowthHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/growth-history/list/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setGrowth(res.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - Token expired or invalid. Logging out...')
          localStorage.removeItem('token')
          localStorage.removeItem('id')
          toast.error('Token expired navigate to login')
          navigate('/login')
        } else {
          console.error('Error fetching growth history:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  useEffect(() => {
    getGrowthHistory()
  }, [])

  const getRemark = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/remark/get-all/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setRemarks(res.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - Token expired or invalid. Logging out...')
          localStorage.removeItem('token')
          localStorage.removeItem('id')
          toast.error('Token expired navigate to login')
          navigate('/login')
        } else {
          console.error('Error fetching remark history:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  useEffect(() => {
    getRemark()
  }, [])

  const upDateRemark = async (data, id = null) => {
    console.log('upDateRemark:', data, 'id:', id);
    setIsLoading(true);
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      if (id) {
        await axios.put(
          `https://koicaresystemv3.azurewebsites.net/api/remark/update/${id}`,
          {
            title: data.title,
            createDate: data.createDate,
            note: data.note,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Remark updated successfully!');
      } else {
        await axios.post(
          'https://koicaresystemv3.azurewebsites.net/api/remark/create',
          {
            title: data.title,
            createDate: data.createDate,
            note: data.note,
            koiFishId: data.koiFishId, 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Remark created successfully!');
      }
  
      reset();
      getRemark();
      setIsAddRemarkFormVisible(false);
      setIsEditRemarkFormVisible(false);
    } catch (error) {
      console.log('Error creating/updating remark history:', error);
      toast.error(error.response?.data?.message || 'Failed to create/update remark.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  

  const upDateGrowth = async (data, id = null) => {
    setIsLoading(true)
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      if (id) {
        const formData = new FormData()
        formData.append('createDate', data.createDate)
        formData.append('physique', data.physique)
        formData.append('length', data.length)
        formData.append('weight', data.weight)
        if (selectedFile) {
          formData.append('file', selectedFile)
        }

        await axios.put(`https://koicaresystemv3.azurewebsites.net/api/growth-history/update/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        const formData = new FormData()
        formData.append('createDate', data.createDate)
        formData.append('physique', data.physique)
        formData.append('length', data.length)
        formData.append('weight', data.weight)
        formData.append('koiFishId', data.koiFishId)
        if (selectedFile) {
          formData.append('file', selectedFile)
        }
        await axios.post('https://koicaresystemv3.azurewebsites.net/api/growth-history/create', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      reset()
      getGrowthHistory()
      getKoi()
      setIsAddGrowthFormVisible(false)
      setIsEditGrowthFormVisible(false)
    } catch (error) {
      console.log('Error creating/updating growth history:', error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const onSubmitGrowth = async (data) => {
    if (currentGrowth) {
      upDateGrowth(data, currentGrowth.id)
    } else {
      upDateGrowth(data)
    }
  }

  const onSubmitRemark = async (data) => {
    if (currentRemark) {
      upDateRemark(data, currentRemark.id)
    } else {
      upDateRemark(data)
    }
  }

  const toggleCloseForm = () => {
    setIsEditFormVisible(false)
  }

  const toggleEditFormVisibility = (koi) => {
    setIsEditFormVisible(true)
    reset(koi)
  }

  const getKoi = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/koifishs/koifish/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        console.log(res.data.data);
        setKoi(res.data.data); 
    } catch (error) {
      console.error('Error fetching koi:', error)
      alert('Failed to load koi details, please try again later.')
    } 
  }

  useEffect(() => {
    getKoi()
  }, [])

  const deleteGrowth = async (id) => {
    const isConfirmed = window.confirm('Are you sure to delete growth history!')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/growth-history/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      reset()
      getGrowthHistory()
      getKoi()
      setIsEditGrowthFormVisible(false)
    } catch (error) {
      console.error('Error deleting growth history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRemark = async (id) => {
    const isConfirmed = window.confirm('Are you sure to delete remark!')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/remark/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      reset()
      getRemark()
      setIsEditRemarkFormVisible(false)
    } catch (error) {
      console.error('Error deleting remark:', error)
    } finally {
      setIsLoading(false)
    }
  }
 
  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystemv3.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data.data)
      setPonds(res.data.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - Token expired or invalid. Logging out...')
          localStorage.removeItem('token')
          localStorage.removeItem('id')
          toast.error('Token expired navigate to login')
          navigate('/login')
        } else {
          console.error('Error fetching ponds:', error.response?.status, error.message)
        }
      } else {
        console.error('An unexpected error occurred:', error)
      }
    }
  }

  useEffect(() => {
    getPond()
  }, [])

  const updateKoi = async (data, id) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('physique', data.physique)
      formData.append('age', data.age)
      formData.append('gender', data.gender)
      formData.append('variety', data.variety)
      formData.append('pondDate', data.pondDate)
      formData.append('breeder', data.breeder)
      formData.append('price', data.price)
      formData.append('koiPondId', data.pondId)
      formData.append('status', data.status)
      if (selectedFile) {
        formData.append('file', selectedFile)
      }
      const res = await axios.put(
        `https://koicaresystemv3.azurewebsites.net/api/koifishs/koifish/${id}/update`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      setIsEditFormVisible(false)
      reset()
      getKoi()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const deleteKoi = async (id) => {
    const isConfirmed = window.confirm('Are you sure to delete koi')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      await axios.delete(`https://koicaresystemv3.azurewebsites.net/api/koifishs/koifish/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      reset()
      getPond()
      setIsEditFormVisible(false)
      navigate('/member/myKoi')
    } catch (error) {
      console.error('Error deleting koi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    updateKoi(data, id)
  }

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-light text-white' : 'bg-gray-200 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden duration-200 ease-linear`}
        >
          <Header />

          <div className='py-5 pb-0 px-[30px] mx-auto'>
            <TopLayout text='My Koi' textName='My Koi Detail' links='member/myKoi' />           
            <div className='flex items-center justify-end pr-12'>
              <button>
                <MdSystemUpdateAlt className='size-7' onClick={() => toggleEditFormVisibility(koi)} />
              </button>
            </div>
            {/* Main content section */}
            <div className='flex justify-around py-5'>
              {/* Left content koi */}
              {koi && (
                <div
                  className={`${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } flex rounded-xl shadow-lg w-[50%]`}
                >
                  {/* Image section */}
                  <div className='h-64 w-[50%] rounded-l-xl overflow-hidden'>
                    <img
                      className='w-full h-full object-cover transition-transform duration-300 transform hover:scale-105'
                      src={koi.imageUrl} 
                      alt={koi.name}            
                    />
                  </div>

                  {/* Right content koi */}
                  <div className='w-[55%] pl-4 pr-3 py-4 flex flex-col justify-between'>
                    <div>
                      <div className='flex items-center'>
                        <h2 className='w-[90%] font-semibold text-3xl text-start text-nowrap'>
                          {koi.name || 'Unnamed Koi'}
                        </h2>
                      </div>
                      <p className='text-start my-2'>
                        Variety: <strong>{koi.variety || 'Unknown'}</strong>
                      </p>
                      <p className='text-start mb-3'>
                        Pond: <strong>{koi.koiPond?.name || 'No pond information'}</strong>
                      </p>
                    </div>
                    <div className='flex justify-between gap-4 bg-gray-400 rounded-2xl p-3'>
                      <div className='text-center'>
                        <h1 className='text-red-500 font-semibold'>Age</h1>
                        <p className='text-sm'>{koi.age ? `${koi.age} years` : 'N/A'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='text-red-500 font-semibold'>Length</h1>
                        <p className='text-sm'>{koi.length ? `${koi.length} cm` : 'N/A'}</p>
                      </div>
                      <div className='text-center'>
                        <h1 className='text-red-500 font-semibold'>Weight</h1>
                        <p className='text-sm'>{koi.weight ? `${koi.weight} g` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Koi description */}
              {koi && (
                <div
                  className={`${
                    isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'
                  } text-start p-4 rounded-xl shadow-lg w-[40%]`}
                >
                  <h2 className='font-bold text-center text-xl mb-2'>Koi Description</h2>
                  <p className='mb-4'>
                    <strong>{koi.name || 'Unnamed Koi'}</strong> with size{' '}
                    <strong>{koi.physique || 'Unknown'}</strong> has been swimming in the pond "
                    <strong>{koi.koiPond?.name || 'No pond information'}</strong>" since{' '}
                    <strong>{formatDate(koi.pondDate) || 'Unknown Date'}</strong>.
                  </p>
                  <p className='mb-4'>
                    <strong>{koi.name || 'Unnamed Koi'}</strong> was bought for{' '}
                    <strong>{koi.price ? `${koi.price}€` : 'Unknown Price'}</strong> and was bred by{' '}
                    <strong>{koi.breeder || 'Unknown Breeder'}</strong>.
                  </p>
                  <p className='mb-2'>
                    <strong>{koi.name || 'Unnamed Koi'}</strong> was{' '}
                    <strong>{koi.status || 'Unknown Status'}</strong>.
                  </p>
                </div>
              )}
            </div>
          

            {/* Growth history and remarks */}
            <div className="grid grid-cols-2 gap-10 px-44 py-5">
              {/* Growth History Section */}
              <div className="growth-history w-[85%]">
                <div className="flex justify-between items-center pb-4">
                  <h2 className="font-bold text-xl">Growth History</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-red-500 cursor-pointer"
                    onClick={toggleAddGrowthFormVisibility}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>

                {growth.length > 0 ? (
                  growth.map((g, index) => (
                    <div
                      key={index}
                      className={`flex items-center rounded-lg mb-4 max-h-28 overflow-hidden cursor-pointer ${
                        isDarkMode ? 'text-white bg-slate-700' : 'text-black bg-white'
                      }`}
                      onClick={() => {
                        toggleEditGrowthFormVisibility(g);
                        reset(g);
                      }}
                    >
                      <div className="w-2/5 rounded-l-lg overflow-hidden">
                        <img
                          src={g.imageUrl}
                          alt={`Growth ${index + 1}`}
                          className="w-full h-full object-cover min-w-[200px]"
                        />
                      </div>
                      <div className="w-3/5 pl-4">
                        <p className="mb-2">
                          <strong>Date:</strong> {formatDate(g.createDate)}
                        </p>
                        <p className="mb-2">
                          <strong>Length:</strong> {g.length} cm
                        </p>
                        <p className="mb-2">
                          <strong>Weight:</strong> {g.weight} g
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">No growth history available</p>
                )}
              </div>

              {/* Remarks Section */}
              <div className="remarks pl-20">
                <div className="flex justify-between items-center pb-4">
                  <h2 className="font-bold text-xl mb-4">Remarks</h2>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-red-500 cursor-pointer"
                      onClick={toggleAddRemarkFormVisibility}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                </div>          
                {remarks.length > 0 ? (
                  remarks.map((remark, index) => (
                    <div key={index} onClick={() => {toggleEditRemarkFormVisibility(remark); reset(remark);
                    }} className={`text-lg mb-4 rounded-lg p-4 cursor-pointer ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}` }>
                      <h3 className="font-semibold mb-2">Title: {remark.title}</h3>
                      <p className=" mb-2"><strong>Date:</strong> {formatDate(remark.createDate)}</p>
                      <p className=''><strong>Note:</strong> {remark.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">No remarks available</p>
                )}
              </div>
            </div>
          </div>

          {isEditFormVisible && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40 '>
              <div className='bg-white min-w-[80vh] m-auto p-6 rounded-lg shadow-lg'>
                {/* Form for editing koi */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={toggleCloseForm}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button type='submit' disabled={isSubmitting}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-10 text-green-500 cursor-pointer'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    </button>
                  </div>                 
                  <div className='grid grid-cols-2 grid-rows-6 gap-4'>
                    <div
                      id='file'
                      className='mb-6  col-span-1 row-span-2 h-full flex justify-center border border-black'
                    >
                      {baseImage ? (
                        <div className='pre-upload max-w-[40vw] relative max-h-[154px] w-full h-full'>
                          <img src={baseImage} alt='Preview' className='absolute w-full h-full object-cover' />
                          <input
                            type='file'
                            id='upload-input'
                            className='absolute top-10 h-20 opacity-0'
                            accept='image/*'
                            {...register('file')}
                            onChange={handleImageChange}
                          />

                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5 absolute text-white cursor-pointer -top-2 -right-2 rounded-full bg-red-500'
                            onClick={() => setBaseImage(null)}
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                          </svg>
                        </div>
                      ) : (
                        <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
                          <div className='relative'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={16}
                              height={16}
                              fill='currentColor'
                              className='mx-auto text-gray-500 inline-block w-10 h-10'
                              viewBox='0 0 16 16'
                            >
                              <path
                                fillRule='evenodd'
                                d='M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z'
                              />
                              <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
                            </svg>
                            <div className='py-3'>
                              <span>Choose images here</span>
                            </div>
                          </div>

                          <input
                            type='file'
                            id='upload-input'
                            className='absolute ml-20 opacity-0'
                            accept='image/*'
                            {...register('file')}
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='name'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('name')}
                      />
                    </div>

                    <div className='relative col-span-1 mb-2 mt-2'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='physique'
                      >
                        Physique
                      </label>
                      <input
                        type='physique'
                        id='physique'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('physique')}
                        readOnly 
                      />
                    </div>
                    
                    <div className='relative col-span-1 mb-2 mt-2'>
                      <label
                        htmlFor='age'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Age
                      </label>
                      <select
                        id='age'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('age')}
                      >
                        <option value={0}>0 years</option>
                        <option value={1}>Tosai (1 year)</option>
                        <option value={2}>Nisai (2 years)</option>
                        <option value={3}>Sansai (3 years)</option>
                        <option value={4}>Yonsai (4 years)</option>
                        <option value={5}>Gosai (5 years)</option>
                        <option value={6}>Rokusai (6 years)</option>
                        <option value={7}>Nanasai (7 years)</option>
                        {[...Array(93)].map((_, i) => (
                          <option key={i + 8} value={i + 8}>
                            {i + 8} years
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='relative col-span-1 mb-2 mt-2'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='gender'
                      >
                        Gender
                      </label>
                      <select
                        id='gender'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('gender')}
                      >
                        {/* <option value=""></option> */}
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Undefined'>Undefined</option>
                      </select>
                    </div>

                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='variety'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Variety
                      </label>
                      <input
                        type='text'
                        id='variety'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('variety')}
                      />
                    </div>                
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='pondDate'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        In pond since
                      </label>

                      <input
                        type='date'
                        id='pondDate'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        defaultValue={koi.pondDate}
                        {...register('pondDate')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='breeder'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Breeder
                      </label>
                      <input
                        type='text'
                        id='breeder'
                        placeholder='Enter Breeder Name'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('breeder')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='price'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Price
                      </label>
                      <input
                        type='number'
                        id='price'
                        placeholder='VND'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('price')}
                      />
                    </div>
                    <div className='relative col-span-1 '>
                      <label
                        htmlFor='status'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Status
                      </label>
                      <select
                        id='status'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('status')}
                        defaultValue={koi.status}
                      >
                        <option>Alive</option>
                        <option>Dead</option>
                      </select>
                    </div>
                    <div className='relative col-span-1 mt-[1.5px]'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='pondId'
                      >
                        Pond
                      </label>
                      <select
                        id='pondId'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('pondId')}
                        defaultValue={koi.koiPond.id}
                      >
                        {ponds.map((pond) => (
                          <option key={pond.id} value={pond.id}>
                            {pond.name}
                          </option>
                        ))}
                      </select>
                      {/* {errors.pondId && (
                        <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.pondId.message}</p>
                      )} */}
                    </div>
                  </div>
                </form>
                <div className='flex justify-center items-center'>
                  <button className='mx-auto ' onClick={() => deleteKoi(koi.id)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-10 mx-auto p-2 rounded-full bg-red-500 text-white cursor-pointer mt-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isAddGrowthFormVisible && koi && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40 '>
              <div className='bg-white min-w-[80vh] m-auto p-6 rounded-lg shadow-lg'>
                {/* Form for adding growth record */}
                <form onSubmit={handleSubmit(onSubmitGrowth)} noValidate>
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={toggleCloseGrowthForm}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button type='submit' disabled={isSubmitting}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-10 text-green-500 cursor-pointer'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    {/* Image upload input takes 2 columns */}
                    <div
                      id='growth-image'
                      className='col-span-2 mb-6 h-full flex justify-center items-center border border-black'
                    >
                      {baseImage ? (
                        <div className='pre-upload max-w-[40vw] relative max-h-[154px] w-full h-full'>
                          <img src={baseImage} alt='Preview' className=' w-full h-full object-cover' />
                          <input
                            type='file'
                            id='upload-input'
                            className='absolute top-10 h-20 opacity-0'
                            accept='image/*'
                            {...register('file')}
                            onChange={handleImageChange}
                          />
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5 absolute text-white cursor-pointer -top-2 -right-2 rounded-full bg-red-500'
                            onClick={() => setBaseImage(null)}
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                          </svg>
                        </div>
                      ) : (
                        <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
                          <div className='relative'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={16}
                              height={16}
                              fill='currentColor'
                              className='mx-auto text-gray-500 inline-block w-10 h-10'
                              viewBox='0 0 16 16'
                            >
                              <path
                                fillRule='evenodd'
                                d='M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z'
                              />
                              <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
                            </svg>
                            <div className='py-3'>
                              <span>Choose images here</span>
                            </div>
                          </div>

                          <input
                            type='file'
                            id='upload-input'
                            className='absolute ml-20 opacity-0'
                            accept='image/*'
                            {...register('file')}                            
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>

                    {/* Date input */}
                    <div className='relative'>
                      <label
                        htmlFor='growthDate'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Date
                      </label>
                      <input
                        type='date'
                        id='growthDate'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('createDate')}
                        defaultValue={koi.pondDate}
                      />
                    </div>

                    {/* Physique input */}
                    <div className='relative'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='physique'
                      >
                        Physique
                      </label>
                      <select
                        id='physique'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        defaultValue={koi.physique}
                        {...register('physique')}                
                      >
                        <option value='Slim'>Slim</option>
                        <option value='Normal'>Normal</option>
                        <option value='Corpulent'>Corpulent</option>
                      </select>
                    </div>

                    {/* Length input */}
                    <div className='relative'>
                      <label
                        htmlFor='length'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Length (cm)
                      </label>
                      <input
                        type='number'
                        id='length'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('length')}                   
                      />
                    </div>

                    {/* Weight input */}
                    <div className='relative'>
                      <label
                        htmlFor='weight'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Weight (g)
                      </label>
                      <input
                        type='number'
                        id='weight'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('weight')}
                      />
                    </div>

                    {/* Hidden koiFishId input */}
                    <div className='relative'>                    
                      <input
                        type='hidden'
                        id='koiFishId'
                        className=''
                        defaultValue={koi.id}
                        {...register('koiFishId')}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isEditGrowthFormVisible && currentGrowth && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40">
              <div className="bg-white min-w-[40vw] m-auto p-6 rounded-lg shadow-lg">
                {/* Form for adding growth record */}
                <form onSubmit={handleSubmit(onSubmitGrowth)} noValidate>
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={toggleCloseGrowthForm}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button type='submit' disabled={isSubmitting}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-10 text-green-500 cursor-pointer'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    {/* Image upload input takes 2 columns */}
                    <div
                      id='growth-image'
                      className='col-span-2 mb-6 h-full flex justify-center items-center border border-black'
                    >
                      {baseImage ? (
                        <div className='pre-upload max-w-[40vw] relative max-h-[154px] w-full h-full'>
                          <img src={baseImage} alt='Preview' className=' w-full h-full object-cover' />
                          <input
                            type='file'
                            id='upload-input'
                            className='absolute top-10 h-20 opacity-0'
                            accept='image/*'
                            {...register('file')}
                            onChange={handleImageChange}
                          />
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5 absolute text-white cursor-pointer -top-2 -right-2 rounded-full bg-red-500'
                            onClick={() => setBaseImage(null)}
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                          </svg>
                        </div>
                      ) : (
                        <label className='pre-upload flex flex-col items-center justify-center text-center cursor-pointer'>
                          <div className='relative'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={16}
                              height={16}
                              fill='currentColor'
                              className='mx-auto text-gray-500 inline-block w-10 h-10'
                              viewBox='0 0 16 16'
                            >
                              <path
                                fillRule='evenodd'
                                d='M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z'
                              />
                              <path d='M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z' />
                            </svg>
                            <div className='py-3'>
                              <span>Choose images here</span>
                            </div>
                          </div>

                          <input
                            type='file'
                            id='upload-input'
                            className='absolute ml-20 opacity-0'
                            accept='image/*'
                            {...register('file')}                            
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>

                    {/* Date input */}
                    <div className='relative'>
                      <label
                        htmlFor='growthDate'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Date
                      </label>
                      <input
                        type='date'
                        id='growthDate'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('createDate')}
                        defaultValue={koi.pondDate}
                      />
                    </div>

                    {/* Physique input */}
                    <div className='relative'>
                      <label
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                        htmlFor='physique'
                      >
                        Physique
                      </label>
                      <select
                        id='physique'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        value={koi.physique}
                        {...register('physique')}                
                      >
                        <option value='Slim'>Slim</option>
                        <option value='Normal'>Normal</option>
                        <option value='Corpulent'>Corpulent</option>
                      </select>
                    </div>

                    {/* Length input */}
                    <div className='relative'>
                      <label
                        htmlFor='length'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Length (cm)
                      </label>
                      <input
                        type='number'
                        id='length'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('length')}                   
                      />
                    </div>

                    {/* Weight input */}
                    <div className='relative'>
                      <label
                        htmlFor='weight'
                        className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                      >
                        Weight (g)
                      </label>
                      <input
                        type='number'
                        id='weight'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('weight')}
                        defaultValue={currentGrowth ? currentGrowth.weight : ''}
                      />
                    </div>
                  </div>
                </form>

                <div className="flex justify-center items-center">
                  <button className="mx-auto" onClick={() => deleteGrowth(currentGrowth.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 p-2 rounded-full bg-red-500 text-white cursor-pointer mt-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M9.75 11.25v6M14.25 11.25v6M5.25 7.5h13.5m-12-2.25h10.5a2.25 2.25 0 0 1 2.25 2.25v.75H3v-.75a2.25 2.25 0 0 1 2.25-2.25z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {isAddRemarkFormVisible && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40 '>
              <div className='bg-white min-w-[80vh] m-auto p-6 rounded-lg shadow-lg'>
                {/* Form for adding growth record */}
                <form onSubmit={handleSubmit(onSubmitRemark)} noValidate>
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={toggleCloseRemarkForm}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button type='submit' disabled={isSubmitting}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-10 text-green-500 cursor-pointer'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>                  
                    {/* Title input */}
                    <div className='relative col-span-2'>
                      <label htmlFor='title' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                        Title
                      </label>
                      <input
                        type='text'
                        id='title'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('title', { required: true })} 
                      />
                    </div>

                    {/* Note input */}
                    <div className='relative col-span-2'>
                      <label htmlFor='note' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                        Note
                      </label>
                      <textarea
                        id='note'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('note', { required: true })} 
                        rows={4}
                      />
                    </div>

                    {/* Creation Date input */}
                    <div className='relative col-span-2'>
                      <label htmlFor='createDate' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                        Date
                      </label>
                      <input
                        type='datetime-local'
                        id='createDate'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        max={new Date().toISOString().slice(0, 16)}
                        {...register('createDate', { required: true })}                        
                      />
                    </div>

                    {/* Hidden koiFishId input */}
                    <div className='relative'>
                      <input
                        type='hidden'
                        id='koiFishId'
                        className=''
                        value={koi.id}
                        {...register('koiFishId')}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isEditRemarkFormVisible && currentRemark && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-40">
              <div className="bg-white min-w-[40vw] m-auto p-6 rounded-lg shadow-lg">
                {/* Form for adding growth record */}
                <form onSubmit={handleSubmit(onSubmitRemark)} noValidate>
                  <div className='flex justify-between mb-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      onClick={toggleCloseRemarkForm}
                      className='size-10 text-red-500 cursor-pointer'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                      />
                    </svg>

                    <button type='submit' disabled={isSubmitting}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-10 text-green-500 cursor-pointer'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>                  
                    {/* Title input */}
                    <div className='relative col-span-2'>
                      <label htmlFor='title' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                        Title
                      </label>
                      <input
                        type='text'
                        id='title'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('title', { required: true })} 
                      />
                    </div>

                    {/* Note input */}
                    <div className='relative col-span-2'>
                      <label htmlFor='note' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                        Note
                      </label>
                      <textarea
                        id='note'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('note', { required: true })} 
                        rows={4}
                      />
                    </div>

                    {/* Creation Date input */}
                    <div className='relative col-span-2'>
                      <label htmlFor='createDate' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                        Date
                      </label>
                      <input
                        type='datetime-local'
                        id='createDate'
                        className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                        {...register('createDate', { required: true })}                        
                      />
                    </div>
                  </div>
                </form>

                <div className="flex justify-center items-center">
                  <button className="mx-auto" onClick={() => deleteRemark(currentRemark.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 p-2 rounded-full bg-red-500 text-white cursor-pointer mt-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M9.75 11.25v6M14.25 11.25v6M5.25 7.5h13.5m-12-2.25h10.5a2.25 2.25 0 0 1 2.25 2.25v.75H3v-.75a2.25 2.25 0 0 1 2.25-2.25z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

      {isLoading && (
        <div className='fixed inset-0 px-4 py-2 flex items-center justify-center z-50'>
          <FaSpinner className='animate-spin text-green-500 text-6xl' />
        </div>
      )}
        </div>
      </div>
    </div>
  )
}

export default KoiDetails