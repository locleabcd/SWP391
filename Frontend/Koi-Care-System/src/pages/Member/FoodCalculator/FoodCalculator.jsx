import { useDarkMode } from '../../../components/DarkModeContext';
import Header from '../../../components/Member/Header';
import LeftSideBar from '../../../components/Member/LeftSideBar';
import TopLayout from '../../../layouts/TopLayout';
import axios from 'axios';
import { useState, useEffect } from 'react';
// import '../FoodCalculator/rangeFood.css';

function FoodCalculator() {
  const { isDarkMode } = useDarkMode();
  const [ponds, setPonds] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [currentPercent, setCurrentPercent] = useState(0.1);
  const [foodAmount, setFoodAmount] = useState(0);

  const [selectedSize, setSelectedSize] = useState('low');
  const [selectedTemperature, setSelectedTemperature] = useState('6-8');
  const temperatureOptions = ['6-8', '9-12', '13-16', '17-20', '21-28'];

  const [calculationMode, setCalculationMode] = useState('percent'); // New state for mode toggle

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koiponds/user/${id}/koiponds`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPonds(res.data.data);
    } catch (error) {
      console.error('Error fetching ponds:', error);
    }
  };

  useEffect(() => {
    getPond();
  }, []);

  useEffect(() => {
    if (ponds.length === 1) {
      setSelectedPond(ponds[0]);
    }
  }, [ponds]);

  const getFishes = async (pondId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/koifishs/koipond/${pondId}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFishes(res.data.data);
    } catch (error) {
      console.error('Error fetching fish:', error);
    }
  };

  const handlePondChange = (e) => {
    const pondId = e.target.value;
    const pond = ponds.find(p => p.id === parseInt(pondId));

    if (pond) {
      setSelectedPond(pond);
      getFishes(pondId);
    } else {
      setSelectedPond(null);
      setFishes([]);
    }
  };

  const calculateFoodAmountBySize = (total) => {
    let multiplier = 1; // Default multiplier
    if (selectedSize === 'low') {
      if (selectedTemperature === '6-8') multiplier = 0.001;
      if (selectedTemperature === '9-12') multiplier = 0.015;
      if (selectedTemperature === '13-16') multiplier = 0.002;
      if (selectedTemperature === '17-20') multiplier = 0.035;
      if (selectedTemperature === '21-28') multiplier = 0.005;
    }
    if (selectedSize === 'mid') {
      if (selectedTemperature === '13-16') multiplier = 0.025;
      if (selectedTemperature === '17-20') multiplier = 0.045;
      if (selectedTemperature === '21-28') multiplier = 0.065;
    }
    if (selectedSize === 'high') {
      if (selectedTemperature === '13-16') multiplier = 0.003;
      if (selectedTemperature === '17-20') multiplier = 0.006;
      if (selectedTemperature === '21-28') multiplier = 0.008;
    }
    // Add more size and temperature conditions here
    return total * multiplier;
  };

  const calculateFoodAmountByPercent = (total) => {
    return total * (currentPercent /100); // Percent mode calculation
  };

  useEffect(() => {
    if (fishes.length > 0) {
      const total = fishes.reduce((sum, fish) => sum + fish.weight, 0);
      setTotalWeight(total);

      if (calculationMode === 'percent') {
        setFoodAmount(calculateFoodAmountByPercent(total));
      } else {
        setFoodAmount(calculateFoodAmountBySize(total));
      }
    } else {
      setTotalWeight(0);
      setFoodAmount(0);
    }
  }, [fishes, currentPercent, selectedSize, selectedTemperature, calculationMode]);

  const isSizeDisabled = (size) => {
    if (['6-8', '9-12'].includes(selectedTemperature)) {
      return size !== 'low'; // Only 'low' is enabled for these temperatures
    }
    return false; // All sizes are enabled for other temperatures
  };

  return (
    <div>
      <div className='h-screen flex'>
        <LeftSideBar />

        <div className={`relative ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-gray-100 text-black'} shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}>
          <Header />
          <div className='py-5 px-[30px] mx-auto'>
            <TopLayout text='Food Calculator' />
            <div className="p-4 text-lg">
              <label htmlFor="ponds">Select a Pond:</label>
              <select
                id="ponds"
                className={`border rounded p-2 ${isDarkMode ? 'text-black' : 'text-gray-700'}`} // Change text color in dark mode
                onChange={handlePondChange}
              >
                <option value="all" disabled selected>
                  All Ponds
                </option>
                {ponds.length > 0 ? (
                  ponds.map((pond) => (
                    <option key={pond.id} value={pond.id}>
                      {pond.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading ponds...</option>
                )}
              </select>
              <div className="mt-4">
                    {fishes.length > 0 ? (
                      <div>
                        <p>Total Fish Weight: <strong>{totalWeight}g</strong></p>
                      </div>
                    ) : (
                      <p>Total Fish Weight: <strong>0g</strong></p>
                    )}
                  </div>
              {selectedPond && (
                <div className="mt-4 p-4">
                  <div className="mt-4">
                    <button
                      onClick={() => setCalculationMode(calculationMode === 'percent' ? 'size' : 'percent')}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Switch to {calculationMode === 'percent' ? 'Size and Temperature Mode' : 'Percent Mode'}
                    </button>
                  </div>

                  {calculationMode === 'percent' ? (
                    <div className="p-4  w-1/4">
                    <label>Current percent (%): 
                      <input
                        type="range"
                        min="0.1"
                        max="2.5"
                        step="0.1"
                        value={currentPercent} 
                        onChange={(e) => setCurrentPercent(e.target.value)}
                        className="slider-thumb"  
                        style={{ '--value': `${(currentPercent / 2.5) * 100}%` }}
                      />
                      <span className="ml-2">{currentPercent}%</span>
                    </label>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <label>Select Fish Size:</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedSize('low')}
                          className={`px-4 py-2 rounded ${selectedSize === 'low' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          Low
                        </button>
                        <button
                          onClick={() => setSelectedSize('mid')}
                          disabled={isSizeDisabled('mid')}
                          className={`px-4 py-2 rounded ${selectedSize === 'mid' ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${isSizeDisabled('mid') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Mid
                        </button>
                        <button
                          onClick={() => setSelectedSize('high')}
                          disabled={isSizeDisabled('high')}
                          className={`px-4 py-2 rounded ${selectedSize === 'high' ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${isSizeDisabled('high') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          High
                        </button>
                      </div>

                      <div className="mt-4">
                        <label>Select Temperature (°C):</label>
                        <div className="flex space-x-2">
                          {temperatureOptions.map((temp) => (
                            <button
                              key={temp}
                              onClick={() => setSelectedTemperature(temp)}
                              className={`px-4 py-2 rounded ${selectedTemperature === temp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                              {temp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    {fishes.length > 0 ? (
                      <div>
                        
                        <p>Food Amount: <strong>{foodAmount.toFixed(0)}g</strong></p>
                      </div>
                    ) : (
                      <p>Total Fish Weight: <strong>0g</strong></p>
                    )}
                  </div>
                </div>
              )}

              {!selectedPond && (
                <div className="mt-4">
                  <p>Please select a pond.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCalculator;
