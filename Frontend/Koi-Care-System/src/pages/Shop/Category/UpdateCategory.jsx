import { useEffect, useState } from 'react'
import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Shop/Header'
import LeftSideBar from '../../../components/Shop/LeftSideBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TopLayout from '../../../layouts/TopLayoutShop'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form';

export default function UpdateCategory() {
  const { id } = useParams()
  const { isDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categories,setCategories] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get(`https://koicaresystem.azurewebsites.net/api/categories/category/${id}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.data);
      reset(res.data.data); 
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to fetch category details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const updateCategory = async (data) => {
    setIsLoading(true)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      const res = await axios.put(
        `https://koicaresystem.azurewebsites.net/api/categories/category/${id}/update`,
        {
            name: data.name, 
            phone: data.phone,
            address: data.address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Supplier updated successfully!');
      navigate('/shop/supplier');
    } catch (error) {
      console.log(error)
      toast.error('Failed to update Supplier.');
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <div>UpdateCategory</div>
  )
}
