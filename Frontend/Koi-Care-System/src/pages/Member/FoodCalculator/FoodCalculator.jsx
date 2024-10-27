import { useDarkMode } from '../../../hooks/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import '../FoodCalculator/rangeFood.css'

function FoodCalculator() {
  const { isDarkMode } = useDarkMode()
  const [ponds, setPonds] = useState([])
  const [selectedPond, setSelectedPond] = useState(null)
  const [fishes, setFishes] = useState([])
  const [totalWeight, setTotalWeight] = useState(0)
  const [currentPercent, setCurrentPercent] = useState(0.1)
  const [foodAmount, setFoodAmount] = useState(0)
  const [selectedSize, setSelectedSize] = useState('low')
  const [selectedTemperature, setSelectedTemperature] = useState('6-8')
  const temperatureOptions = ['6-8', '9-12', '13-16', '17-20', '21-28']
  const [calculationMode, setCalculationMode] = useState('percent') // New state for mode toggle

  const getPond = async () => {
    try {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`http://146.190.84.154:8080/api/koiponds/user/${id}/koiponds`, {
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

  useEffect(() => {
    if (ponds.length === 1) {
      setSelectedPond(ponds[0])
    }
  }, [ponds])

  const getFishes = async (pondId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.get(`http://146.190.84.154:8080/api/koifishs/koipond/${pondId}/allKoi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setFishes(res.data.data)
    } catch (error) {
      console.error('Error fetching fish:', error)
    }
  }

  const handlePondChange = (e) => {
    const pondId = e.target.value
    const pond = ponds.find((p) => p.id === parseInt(pondId))

    if (pond) {
      setSelectedPond(pond)
      getFishes(pondId)
    } else {
      setSelectedPond(null)
      setFishes([])
    }
  }

  const calculateFoodAmountBySize = useCallback(
    (total) => {
      let minMultiplier = 1 // Minimum percentage
      let maxMultiplier = 1 // Maximum percentage

      if (selectedSize === 'low') {
        // Small Fish
        if (selectedTemperature === '6-8') {
          minMultiplier = 0.002
          maxMultiplier = 0.003
        }
        if (selectedTemperature === '9-12') {
          minMultiplier = 0.003
          maxMultiplier = 0.007
        }
        if (selectedTemperature === '13-16') {
          minMultiplier = 0.007
          maxMultiplier = 0.015
        }
        if (selectedTemperature === '17-20') {
          minMultiplier = 0.015
          maxMultiplier = 0.025
        }
        if (selectedTemperature === '21-28') {
          minMultiplier = 0.025
          maxMultiplier = 0.04
        }
      }

      if (selectedSize === 'mid') {
        // Medium Fish
        if (selectedTemperature === '6-8') {
          minMultiplier = 0.002
          maxMultiplier = 0.005
        }
        if (selectedTemperature === '9-12') {
          minMultiplier = 0.005
          maxMultiplier = 0.01
        }
        if (selectedTemperature === '13-16') {
          minMultiplier = 0.01
          maxMultiplier = 0.02
        }
        if (selectedTemperature === '17-20') {
          minMultiplier = 0.02
          maxMultiplier = 0.03
        }
        if (selectedTemperature === '21-28') {
          minMultiplier = 0.03
          maxMultiplier = 0.05
        }
      }

      if (selectedSize === 'high') {
        // Large Fish
        if (selectedTemperature === '6-8') {
          minMultiplier = 0.003
          maxMultiplier = 0.005
        }
        if (selectedTemperature === '9-12') {
          minMultiplier = 0.005
          maxMultiplier = 0.01
        }
        if (selectedTemperature === '13-16') {
          minMultiplier = 0.01
          maxMultiplier = 0.015
        }
        if (selectedTemperature === '17-20') {
          minMultiplier = 0.015
          maxMultiplier = 0.025
        }
        if (selectedTemperature === '21-28') {
          minMultiplier = 0.025
          maxMultiplier = 0.04
        }
      }

      const minFood = total * minMultiplier
      const maxFood = total * maxMultiplier

      return {
        min: minFood,
        max: maxFood
      }
    },
    [selectedSize, selectedTemperature]
  )

  const calculateFoodAmountByPercent = useCallback(
    (total) => {
      return total * (currentPercent / 100) // Trả về số lượng thức ăn duy nhất
    },
    [currentPercent]
  )

  const generateNotes = () => {
    if (calculationMode === 'percent') {
      return `You are in Percent Mode, We still recommend using the preset food calculator! Use the Percent Mode Mode only if you already have a lot of experience with koi and know what you are doing!`
    } else {
      if (selectedTemperature === '6-8') {
        return `The koi should only receive the prescribed amount of food every two to three days.
In any case, feeding should be stopped when the temperature drops below 6°C!
Because of the koi's decreased metabolism, the growth targets "medium" and "high" are not selectable in the 6–8°C temperature range.`
      } else if (selectedTemperature === '9-12') {
        return `The recommended amount of food should be split evenly into 2-3 feedings per day.
Because of the koi's decreased metabolism, the growth targets "medium" and "high" are not selectable in the 9–12°C temperature range.`
      } else if (selectedTemperature === '13-16') {
        return `It is advisable to divide the recommended daily intake of meals into 4-6 feedings. The food will be better absorbed by the koi in this method.`
      } else if (selectedTemperature === '17-20') {
        return `The recommended amount of food should be split evenly into 3-5 feedings per day. The food will be better absorbed by the koi in this method.`
      } else {
        return `The recommended amount of food should be split evenly into 4-8 feedings per day. The food will be better absorbed by the koi in this method.
Over 28°C is not a good temperature to feed at!`
      }
    }
  }
  useEffect(() => {
    if (fishes.length > 0) {
      const total = fishes.reduce((sum, fish) => sum + fish.weight, 0)
      setTotalWeight(total)

      // Kiểm tra nếu calculationMode là 'percent' hay 'size' và tính toán lượng thức ăn tương ứng
      if (calculationMode === 'percent') {
        // Tính toán với chế độ phần trăm
        setFoodAmount(calculateFoodAmountByPercent(total))
      } else {
        // Tính toán với chế độ kích thước
        const foodRange = calculateFoodAmountBySize(total)
        setFoodAmount(foodRange) // Đặt foodAmount như đối tượng phạm vi
      }
    } else {
      setTotalWeight(0)
      setFoodAmount(0)
    }
  }, [
    fishes,
    currentPercent,
    selectedSize,
    selectedTemperature,
    calculationMode,
    calculateFoodAmountByPercent,
    calculateFoodAmountBySize
  ])

  const isSizeDisabled = (size) => {
    if (['6-8', '9-12'].includes(selectedTemperature)) {
      return size !== 'low' // Only 'low' is enabled for these temperatures
    }
    return false // All sizes are enabled for other temperatures
  }
  useEffect(() => {
    if (['6-8', '9-12'].includes(selectedTemperature) && selectedSize !== 'low') {
      setSelectedSize('low') // Reset to low if the temperature requires it
    }
  }, [selectedTemperature, selectedSize])
  useEffect(() => {
    if (ponds.length === 1) {
      const pond = ponds[0]
      setSelectedPond(pond)
      getFishes(pond.id) // Gọi hàm để lấy cá cho hồ đầu tiên
    }
  }, [ponds])
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
            <TopLayout text='Food Calculator' />
            <div className='p-2 text-lg min-h-screen'>
              <div className='lg:text-lg text-sm flex lg:items-center lg:flex-row flex-col lg:gap-5 gap-3'>
                <label htmlFor='ponds'>Select a Pond:</label>
                <select
                  id='ponds'
                  className='border rounded p-2 text-black'
                  value={selectedPond ? selectedPond.id : 'all'} // 'all' là giá trị mặc định nếu chưa có pond nào được chọn
                  onChange={handlePondChange}
                >
                  <option value='all' disabled>
                    All Ponds
                  </option>
                  {ponds.map((pond) => (
                    <option key={pond.id} value={pond.id}>
                      {pond.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mt-4'>
                {fishes.length > 0 ? (
                  <div>
                    <p className='lg:text-lg text-sm'>
                      Total Fish Weight: <strong>{totalWeight.toFixed(2)}g</strong>
                    </p>
                  </div>
                ) : (
                  <p className='lg:text-lg text-sm'>
                    Total Fish Weight: <strong>0g</strong>
                  </p>
                )}
              </div>

              {selectedPond && (
                <div>
                  <div className='mt-4 lg:p-4 grid lg:grid-cols-3 grid-cols-1'>
                    <div className='col-span-1'>
                      <div className='mt-4'>
                        <button
                          onClick={() => setCalculationMode(calculationMode === 'percent' ? 'size' : 'percent')}
                          className='bg-blue-500 text-white px-4 py-2 rounded lg:text-lg text-sm'
                        >
                          Switch to {calculationMode === 'percent' ? 'Size and Temperature Mode' : 'Percent Mode'}
                        </button>
                      </div>

                      {calculationMode === 'percent' ? (
                        <div className='p-4  w-4/5 '>
                          <label className='lg:text-lg text-sm'>
                            Current percent (%):
                            <input
                              type='range'
                              min='0.1'
                              max='2.5'
                              step='0.1'
                              value={currentPercent}
                              onChange={(e) => setCurrentPercent(e.target.value)}
                              className='slider-thumb'
                              style={{ '--value': `${(currentPercent / 2.5) * 100}%` }}
                            />
                            <span className='ml-2'>{currentPercent}%</span>
                          </label>
                        </div>
                      ) : (
                        <div className='mt-4 lg:text-lg text-sm'>
                          <label>Select Fish Size:</label>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => setSelectedSize('low')}
                              className={`px-4 py-2 rounded ${
                                selectedSize === 'low' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-500'
                              }`}
                            >
                              Low
                            </button>
                            <button
                              onClick={() => setSelectedSize('mid')}
                              disabled={isSizeDisabled('mid')}
                              className={`px-4 py-2 rounded ${
                                selectedSize === 'mid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-500'
                              } ${isSizeDisabled('mid') ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Mid
                            </button>
                            <button
                              onClick={() => setSelectedSize('high')}
                              disabled={isSizeDisabled('high')}
                              className={`px-4 py-2 rounded ${
                                selectedSize === 'high' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-500'
                              } ${isSizeDisabled('high') ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              High
                            </button>
                          </div>

                          <div className='mt-4'>
                            <label>Select Temperature (°C):</label>
                            <div className='grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 gap-2'>
                              {temperatureOptions.map((temp) => (
                                <button
                                  key={temp}
                                  onClick={() => setSelectedTemperature(temp)}
                                  className={`px-4 py-2 rounded lg:text-lg text-sm  ${
                                    selectedTemperature === temp
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-200 text-blue-500  '
                                  }`}
                                >
                                  {temp}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='lg:text-lg text-base text-justify notes p-4 border justify-center text-black bg-white lg:py-20 mt-5 rounded shadow col-span-2 '>
                      <h3>Notes:</h3>
                      <p>{generateNotes()}</p>
                    </div>
                  </div>

                  <div className='w-min-full bottom-5 lg:text-xl mt-5 text-sm block footer lg:w-2/4 bg-slate-600 text-white border-solid rounded-lg mx-auto py-5 text-center'>
                    {fishes.length > 0 ? (
                      calculationMode === 'percent' ? (
                        <p>
                          Food Amount: <strong>{!isNaN(foodAmount) ? foodAmount.toFixed(2) : 0}g</strong>
                          <strong>/Perday</strong>
                        </p>
                      ) : (
                        <p>
                          Food Amount:{' '}
                          <strong>
                            {!isNaN(foodAmount.min) ? foodAmount.min.toFixed(2) : 0}g -{' '}
                            {!isNaN(foodAmount.max) ? foodAmount.max.toFixed(2) : 0}g<strong>/Perday</strong>
                          </strong>
                        </p>
                      )
                    ) : (
                      <p>
                        Total Fish Weight: <strong>0g</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {!selectedPond && (
              <div className='mt-4 pl-4 text-lg'>
                <p>Please select a pond.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodCalculator
