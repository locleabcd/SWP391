/* eslint-disable no-unused-vars */
 
import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import axios, { AxiosError } from 'axios'
import { set, useForm } from 'react-hook-form'
import { FaSpinner } from 'react-icons/fa'
import AOS from 'aos'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayout'

function WaterParameters() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [isEditFormVisible, setIsEditFormVisible] = useState(false)
  const [currentParameter, setCurrentParameter] = useState(null)
  const [showButtons, setShowButtons] = useState(false)
  const [parameters, setParameters] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setPonds(res.data.data)
    } catch (error) {
      console.error('Error fetching ponds:', error)
    }
  }
  useEffect(() => {
    getPond()
  }, [])

   const getParameter = async(data)=>{
    setIsLoading(true)
    setIsSubmitting(true)   
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      console.log(data)
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/water-parameters`, 
        {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setParameters(res.data.data)
    } catch (error) {
      console.error('Error fetching water:', error)
    }
    }
    useEffect(() => {
      getParameter()
    }, [])
  const toggleButtons = () => {
    setShowButtons(!showButtons)
  }
  const createParameter = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    console.log(data);
    try {
      const token = localStorage.getItem('token')
      if(!token) {
        throw new Error('No token found')
      }
      console.log(data)
      const res = await axios.post(
        `https://koicaresystem.azurewebsites.net/api/water-parameters/create`,
        {
          koiPondId: data.pondId,
          currentDateTime: data.currentDateTime,
          nitrite: data.nitrite,
          nitrate: data.nitrate,
          phosphate: data.phosphate,
          ammonium: data.ammonium,
          hardness: data.hardness,
          oxygen: data.oxygen,
          temperature: data.temperature,
          phValue: data.phValue,
          carbonHardness: data.carbonHardness,
          salt: data.salt,
          totalChlorine: data.totalChlorine,
          temp: data.temp,
          amountFed: data.amountFed,
          note: data.note,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`
            
          }
        }
      )
      setIsAddFormVisible(false)
      getParameter()
      reset()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()
  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible)
    setIsEditFormVisible(false)
    setCurrentParameter(null)
    reset()
  }
  const toggleCloseForm = () => {
    setIsEditFormVisible(!isEditFormVisible)
    setIsEditFormVisible(false)
    setCurrentParameter(null)
    reset(parameters)
  }
  

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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='fixed bottom-5 right-5 text-lg text-red-500 rounded-full shadow-lg size-12 cursor-pointer z-10'
            onClick={toggleAddFormVisibility}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
          </svg>
          <div className='p-4 w-full mt-4 z-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
              {parameters.map((parameter) => (
                <div key={parameter.id} className='border p-4 rounded-lg shadow bg-white'>
                  <div className='text-lg'>
                      <div className='flex justify-between w-full'>
                        <h3 className='text-base'>Pond Name:{parameter.koiPondName}</h3>
                        <h3 className='text-base font-semibold'>{parameter.createDateTime} </h3>
                      </div>
                      <div className='flex justify-between w-full'>
                          <h3 className='text-base '>Nitrite(NO₂): {parameter.nitrite}</h3>
                          <h3 className='text-base '>Nitrate(NO₃): {parameter.nitrate}</h3>
                      </div>
                      <div className='flex justify-between  '>
                        <h3 className='text-base w-32 '>Phosphate(PO₄):{parameter.phosphate}</h3>
                        <h3 className='text-base w-32 '>Ammonium(NH₄):{parameter.ammonium}</h3>
                      </div>  
                      <div className='flex justify-between w-full'>
                        <h3 className='text-base w-32'>Hardness(GH): {parameter.hardness}</h3>
                        <h3 className='text-base w-32'>Oxygen (O₂):{parameter.oxygen}</h3>
                      </div>
                      <div className='flex  justify-between'>
                        <h3 className='text-base w-32'>Temperature:{parameter.temperature}</h3>
                        <h3 className='text-base w-32'>phValue:{parameter.phValue}</h3>
                      </div>
                      <div className='flex justify-between'>
                        <h3 className='text-base w-32'>Carbon.hardn.(KH):{parameter.carbonHardness}</h3>
                        <h3 className='text-base w-32'>CO₂:{parameter.carbonDioxide}</h3>
                      </div>
                      <div className='flex justify-between'>
                        <h3 className='text-base w-32'>Salt:{parameter.salt}</h3>
                        <h3 className='text-base w-32'>Total chlorines:{parameter.totalChlorine}</h3>
                      </div>
                      <div className='flex justify-between'>
                        <h3 className='text-base w-32'>Outdoor temp.:{parameter.temp}</h3>
                        <h3 className='text-base w-32'>Amount fed:{parameter.amountFed}</h3>
                      </div>
                      <div className='flex'>
                        <h3 className='text-base text-gray-500 font-semibold'>{parameter.note }</h3>
                      </div>
                     
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isAddFormVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50 '>
          <div
            className='bg-white min-w-[70vh] mb-auto mt-auto p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto no-scroll-bar'
            
          >
            <form onSubmit={handleSubmit(createParameter)} noValidate>
              <div className='flex justify-between mb-5'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  onClick={toggleAddFormVisibility}
                  className='size-10 text-red-500 cursor-pointer'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>

                <button type='submit'>
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
                      d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                </button>
              </div>

              <h3 className='mb-5 text-2xl font-bold'>Add Parameter</h3>
              <div className='grid grid-cols-2 grid-rows-4 gap-4'>
              <div className='relative col-span-1 mb-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='pondId'
                  >
                    Pond Name:
                  </label>
                  <select
                    id='pondId'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('pondId', { required: 'Please select a pond' })}
                  >
                    <option value=''>Select a pond</option>
                    {ponds.map((pond) => (
                      <option key={pond.id} value={pond.id}>
                        {pond.name}
                      </option>
                    ))}
                  </select>
                  {errors.pondId && (
                    <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.pondId.message}</p>
                  )}
                </div>
                <div className='relative col-span-1 mb-2 '>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='currentDateTime'
                  >
                    Date & time
                  </label>
                  <input
                    type='datetime-local'
                    id='currentDateTime'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('currentDateTime')}
                  /> 
                </div>

                <div className='relative col-span-1 mb-4'>
                  <label
                    htmlFor='nitrite'
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                  >
                    Nitrite(NO₂):
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    id='Nitrite'
                    placeholder='mg/l'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('nitrite',{required: 'Nitrite is required'})}
                    />
                    {errors.nitrite &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.nitrite.message}</p>
                      )}
                  </div>

                <div className='relative col-span-1 mb-2 '>
                  <label htmlFor='nitrate' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                  Nitrate(NO₃):
                  </label>
                  <input
                    type='number'
                    id='nitrate'
                    step='0.01'
                    placeholder='mg/l'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('nitrate',{required: 'Nitrate is required'})}
                    />
                    {errors.nitrate &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.nitrate.message}</p>
                      )}
                  </div>

                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='phosphate'
                  >
                    Phosphate(PO₄):
                  </label>
                  <input
                    type='number'
                    id='length'
                    step='0.01'
                    placeholder='mg/l'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('phosphate',{required: 'Phosphate is required'})}
                    />
                    {errors.phosphate &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.phosphate.message}</p>
                      )}
                  </div>

                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='ammonium'
                  >
                    Ammonium(NH₄):
                  </label>
                  <input
                    type='number'
                    id='ammonium'
                    step='0.01'
                    placeholder='mg/l'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('ammonium', { required: 'Ammonium is required' })}
                  />
                  {errors.ammonium && (
                    <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.ammonium.message}</p>
                  )}
                </div>

                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='hardness'
                  >
                  Hardness(GH):
                  </label>
                  <input
                    type='number'
                    id='hardnesss'
                    step='0.01'
                    placeholder='°dH'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('hardness', { required: 'Hardness is required' })}
                  />
                  {errors.hardness && (
                    <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.hardness.message}</p>
                  )}
                </div>

                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='oxygen'
                  >
                    Oxygen(O₂):
                  </label>
                  <input
                    type='number'
                    id='oxygen'
                    placeholder='mg/l'
                    step='0.01'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('oxygen', {required: 'Oxygen is required'})}
                  />
                  {errors.oxygen &&(
                     <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.oxygen.message}</p>
                    )}
                </div>

                
                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='temperature'
                  >
                    Temperature:
                  </label>
                  <input
                    type='number'
                    placeholder='°C'
                    id='temperature'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('temperature',{required: 'Temperature is required'})}
                    />
                    {errors.temperature &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.temperature.message}</p>
                      )}
                  </div>

                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='phValue'
                  >
                    phValue:
                  </label>
                  <input
                    type='number'
                    id='phValue'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('phValue',{required: 'phValue is required'})}
                    />
                    {errors.phValue &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.phValue.message}</p>
                      )}
                </div>
                <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='carbonHardness'
                  >
                    Carbon.hardn.(KH):
                  </label>
                  <input
                    type='number'
                    placeholder='°dH'
                    id='carbonHardness'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('carbonHardness',{required: 'CarbonHardness is required'})}
                    />
                    {errors.carbonHardness &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.carbonHardness.message}</p>
                      )}
                  </div>
                  <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='carbonDioxide'
                  >
                    CO₂:
                  </label>
                  <input
                    type='number'
                    placeholder='mg/l'
                    id='carbonDioxide'
                    step='0.01'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('carbonDioxide',{required: 'CO₂ is required'})}
                    />
                    {errors.carbonDioxide &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.carbonDioxide.message}</p>
                      )}
                  </div>
                  <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='salt'
                  >
                    Salt:
                  </label>
                  <input
                    type='number'
                    placeholder='%'
                    id='salt'
                    step='0.01'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('salt',{required: 'Salt is required'})}
                    />
                    {errors.salt &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.salt.message}</p>
                      )}
                  </div>
                  <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='totalChlorine'
                  >
                    Total chlorines:
                  </label>
                  <input
                    type='number'
                    placeholder='mg/l'
                    id='totalChlorine'
                    step='0.01'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('totalChlorine',{required: 'Total chlorine is required'})}
                    />
                    {errors.totalChlorine &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.totalChlorine.message}</p>
                      )}
                  </div>
                  <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='temp'
                  >
                    Outdoor temp.:
                  </label>
                  <input
                    type='number'
                    placeholder='°C'
                    id='temp'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('temp',{required: 'Temp is required'})}
                    />
                    {errors.temp &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.temp.message}</p>
                      )}
                  </div>
                  <div className='relative col-span-1 mb-2 mt-2'>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'
                    htmlFor='amountFed'
                  >
                    Amount fed:
                  </label>
                  <input
                    type='number'
                    placeholder='°C'
                    id='amountFed'
                    className='mt-1 block w-full p-3 border border-black rounded-md shadow-sm'
                    {...register('amoutFed',{required: 'Amount Fed is required'})}
                    />
                    {errors.amountFed &&(
                       <p className='absolute -bottom-[14px] left-3 text-red-500 text-sm'>{errors.amountFed.message}</p>
                      )}
                  </div>
                  <div className='relative col-span-2 mb-2 mt-2  '>
                  <label
                    className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white '
                    htmlFor='note'
                  >
                    Note:
                  </label>
                  <input
                    type='text'
                    
                    id='note'
                    className='mt-1 block w-full p-8 border border-black rounded-md shadow-sm'
                    {...register('note',{required: 'Note is required'})}
                    />
                    
                  </div>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    
  )
}

export default WaterParameters
