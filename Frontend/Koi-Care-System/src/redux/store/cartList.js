import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const initialState = {
  cartList: [],
  count: 0,
  totalQuantity: 0
}

const cartListSlice = createSlice({
  name: 'cartList',
  initialState,
  reducers: {
    AddToCartList: (state, action) => {
      const existingItem = state.cartList.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
        state.totalQuantity += action.payload.quantity || 1
      } else {
        state.cartList.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        })
        state.count += 1
        state.totalQuantity += action.payload.quantity || 1
      }
    },
    RemoveFromCartList: (state, action) => {
      const itemToRemove = state.cartList.find((item) => item.id === action.payload.id)
      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity
        state.cartList = state.cartList.filter((item) => item.id !== action.payload.id)
        state.count -= 1
      }
    }
  }
})

export const { AddToCartList, RemoveFromCartList } = cartListSlice.actions
export default cartListSlice.reducer

export const addToCartList = (product) => async (dispatch) => {
  const cartId = localStorage.getItem('cartId')
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      'https://koicaresystem.azurewebsites.net/api/cartItems/item/add',
      {
        cartId: cartId,
        productId: product.id,
        quantity: product.quantity || 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    toast.success('Add to cart success!!', {
      autoClose: 1000
    })
    dispatch(AddToCartList(response.data))
  } catch (error) {
    console.log(error)
  }
}

export const removeToCartList = (productId) => async (dispatch) => {
  const cartId = localStorage.getItem('cartId')
  try {
    const token = localStorage.getItem('token')
    const response = await axios.delete(
      `https://koicaresystem.azurewebsites.net/api/cartItems/cart/${cartId}/product/${productId}/remove`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    toast.error('Delete product success!!', {
      autoClose: 1000
    })
    dispatch(RemoveFromCartList(response.data))
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
