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
    },
    LoadCart: (state, action) => {
      state.cartList = action.payload.cartList
      state.count = action.payload.count
      state.totalQuantity = action.payload.totalQuantity
    }
  }
})

export const { AddToCartList, RemoveFromCartList, LoadCart } = cartListSlice.actions
export default cartListSlice.reducer

export const addToCartList = (product, quantity) => async (dispatch) => {
  const cartId = localStorage.getItem('cartId')
  try {
    const token = localStorage.getItem('token')
    const productQuantity = quantity || product.quantity || 1
    await axios.post(
      'https://koicaresystemv2.azurewebsites.net/apicartItems/item/add',
      {
        cartId: cartId,
        productId: product.id,
        quantity: productQuantity
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
    dispatch(
      AddToCartList({
        ...product,
        quantity: productQuantity
      })
    )
  } catch (error) {
    console.log(error)
  }
}

export const loadCart = () => async (dispatch) => {
  const cartId = localStorage.getItem('cartId')
  const token = localStorage.getItem('token')

  if (!token) {
    console.error('No token found')
    return
  }

  try {
    const response = await axios.get(`https://koicaresystemv2.azurewebsites.net/apicarts/cart/${cartId}/my-cart`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const cartData = response.data.data
    const cartItems = cartData.items.map((item) => ({
      id: item.productId,
      quantity: item.quantity
    }))

    dispatch(
      LoadCart({
        cartList: cartItems,
        count: cartItems.length,
        totalQuantity: cartItems.reduce((total, item) => total + item.quantity, 0)
      })
    )
  } catch (error) {
    console.error('Failed to load cart:', error)
  }
}

export const removeToCartList = (productId) => async (dispatch) => {
  const cartId = localStorage.getItem('cartId')
  try {
    const token = localStorage.getItem('token')
    const response = await axios.delete(
      `https://koicaresystemv2.azurewebsites.net/apicartItems/cart/${cartId}/product/${productId}/remove`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    toast.success('Delete product success!!', {
      autoClose: 1000
    })
    dispatch(RemoveFromCartList(response.data))
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
