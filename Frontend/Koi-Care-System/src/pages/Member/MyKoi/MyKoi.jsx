import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../components/DarkModeContext';
import Header from '../../../components/Member/Header';
import LeftSideBar from '../../../components/Member/LeftSideBar';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

function MyKoi() {
  const { isDarkMode } = useDarkMode();
  const [kois, setKois] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, delay: 300 })
  })

  
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

  return (
    <div>
      <div className="h-screen flex" >
        <LeftSideBar />
        <div
          className={`relative ${
            isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'
          } shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
        >
          <Header />
          <div className="p-4 w-full" data-aos='fade-up'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {kois.map((koi) => (
                <div key={koi.id} className="border p-4 rounded-lg shadow">
                  <img
                    src={koi.imageUrl} 
                    alt={koi.name}
                    className="w-full h-40 object-cover mb-4 rounded-md"
                  />
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
                    <h3 className="text-base font-semibold">{koi.variety} </h3>
                  </div>                  
                  <div className="flex">
                    <h3 className="text-base w-32">Length:</h3>
                    <h3 className="text-base font-semibold">{koi.length} cm</h3>
                  </div>                                 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyKoi;
