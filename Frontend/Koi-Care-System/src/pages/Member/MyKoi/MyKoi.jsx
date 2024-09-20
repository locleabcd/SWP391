import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../components/DarkModeContext';
import Header from '../../../components/Member/Header';
import LeftSideBar from '../../../components/Member/LeftSideBar';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useForm } from 'react-hook-form';

function MyKoi() {
  const { isDarkMode } = useDarkMode();
  const [kois, setKois] = useState([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ponds, setPonds] = useState([])

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, delay: 300 });
  }, []);

  const toggleAddFormVisibility = () => {
    setIsAddFormVisible(!isAddFormVisible);
    reset();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

   

  const onSubmit = async (data, id) => {
    
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const res = await axios.post(
        `https://koi-care-system.azurewebsites.net/api/koifishs/koipond/create`,
        {
          name: data.name,
          physique: data.physique,
          age: data.age,
          length: data.length,
          weight: data.weight,
          gender: data.gender,
          variety: data.variety,
          pondDate: data.pondDate,
          breeder: data.breeder,
          price: data.price,
          koiPond: data.koiPond,
          imageUrl: data.imageUrl,
          status: data.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsAddFormVisible(false);
      getKoi();
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

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


  const getKoi = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await axios.get(`https://koi-care-system.azurewebsites.net/api/koifishs/user/${id}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched Koi:', res.data.data);
      setKois(res.data.data);
    } catch (error) {
      console.error('Error fetching koi:', error);
    }
  };

  useEffect(() => {
    getKoi();
  }, []);

  useEffect(() => {
    getPond()
  }, [])



  return (
    <div>
      <div className="h-screen flex">
        <LeftSideBar />
        <div
          className={`relative ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'} 
          shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="fixed bottom-5 right-5 text-lg text-red-500 rounded-full shadow-lg size-12 cursor-pointer"
              onClick={toggleAddFormVisibility}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>        
          <div className="p-4 w-full mt-4" data-aos="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {kois.map((koi) => (
                <div key={koi.id} className="border p-4 rounded-lg shadow">
                  <img src={koi.imageUrl} alt={koi.name} className="w-full h-40 object-cover mb-4 rounded-md" />
                  <div className="flex">
                    <h3 className="text-base w-32">Koi Name:</h3>
                    <h3 className="text-base font-semibold">{koi.name}</h3>
                  </div>
                  <div className="flex">
                    <h3 className="text-base w-32">Age:</h3>
                    <h3 className="text-base font-semibold">{koi.age} years</h3>
                  </div>
                  <div className="flex">
                    <h3 className="text-base w-32">Variety:</h3>
                    <h3 className="text-base font-semibold">{koi.variety}</h3>
                  </div>
                  <div className="flex">
                    <h3 className="text-base w-32">Length:</h3>
                    <h3 className="text-base font-semibold">{koi.length} cm</h3>
                  </div>
                  <div className="flex">
                    <h3 className="text-base w-32">Pond Name:</h3>
                    <h3 className="text-base font-semibold">{koi.pondName}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {isAddFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50" data-aos="fade-up">
          <div className="bg-white min-w-[100vh] mb-auto p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex justify-between mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={toggleAddFormVisibility}
                  className="size-10 text-red-500 cursor-pointer"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                <button type="submit" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10 text-green-500 cursor-pointer"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>

              <h3 className="mb-5 text-2xl font-bold">Add a Koi</h3>
              <div className="grid grid-cols-2 grid-rows-8 gap-2 ">
                <div
                  id='imageSingle'
                  className='dropzone single-dropzone mb-6 col-span-1 row-span-2 h-full flex justify-center shadow-xl'
                >
                  <label htmlFor='imageUrl' className='flex flex-col items-center justify-center text-center cursor-pointer'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={12}
                      height={12}
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

                    <input
                      type='file'
                      accept='image/jpg'
                      className=''
                      {...register('imageUrl', 
                      // { required: 'Please select an image'}
                      )}
                    />
                  </label>
                </div>
                {/* Show error if the image is not uploaded */}
                {/* {errors.image && <p className='text-red-500 text-sm'>{errors.image.message}</p>} */}
                <div className="relative col-span-1 ">
                  <label htmlFor='name' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="absolute -bottom-[-1px] left-3 text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="relative col-span-1 mb-4">
                  <label htmlFor='physique' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                    Physique
                  </label>
                  <input
                    type="text"
                    id="physique"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('physique')}
                  />
            
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label htmlFor='age' className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white'>
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('age', )}
                  />
                  
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className='absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white' htmlFor="length">
                    Length
                  </label>
                  <input
                    type="number"
                    id="length"
                    placeholder='cm'
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('length', { required: 'Length is required' })}
                  />
                  {errors.length && <p className="absolute -bottom-[13px] left-3 text-red-500 text-sm">{errors.length.message}</p>}
                  
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="weight">
                    Weight
                  </label>
                  <input
                    type="number"
                    id="weight"
                    placeholder='g'
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('weight', { required: 'Weight is required' })}
                  />
                  {errors.weight && <p className="absolute -bottom-[14px] left-3 text-red-500 text-sm">{errors.weight.message}</p>}
                  
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('gender')} 
                    
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Undefined">Undefined</option>
                  </select>
                  
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="variety">
                    Variety
                  </label>
                  <input
                    type="text"
                    id="variety"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('variety')} 
                  />       
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="pondDate">
                   In Pond Date
                  </label>
                  <input
                    type="date"
                    id="pondDate"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('pondDate')}  
                    
                  />       
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="breeder">
                   Breeder
                  </label>
                  <input
                    type="text"
                    id="breeder"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('breeder')}  
                    
                  />       
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="price">
                   Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    placeholder='$'
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm" 
                    {...register('price')}               
                  />       
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="koiPond">
                    Pond
                  </label>
                  <select
                    id="koiPond"
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"
                    {...register('koiPond')}
                  >
                    <option value="">Select a pond</option>
                    {ponds.map((pond) => (
                      <option key={pond.id} value={pond.id}> 
                        {pond.name} 
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative col-span-1 mb-2 mt-2">
                  <label className="absolute text-md font-medium -top-[8px] left-3 text-red-500 bg-white" htmlFor="status">
                   Status
                  </label>
                  <input
                    type='text'
                    id="status"
                    value="alive"
                    readOnly  
                    className="mt-1 block w-full p-3 border border-black rounded-md shadow-sm"   
                    {...register('status')}            
                  />       
                </div> 
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyKoi;
