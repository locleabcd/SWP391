import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  cartList: [],
  count: 0,
  quantity: 0
}

const cartListSlice = createSlice({
  name: 'cartList',
  initialState,
  reducers: {
    AddToCartList: (state, action) => {
      const existingItem = state.cartList.find((item) => item.id === action.payload.id)
      if (!existingItem) {
        state.cartList.push(action.payload)
        state.count += 1
        state.quantity += action.payload.quantity || 1
      }
    },
    AddToCartListFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    RemoveFromCartlist: (state, action) => {
      state.cartList = state.cartList.filter((item) => item.id !== action.payload.id)
      state.count -= 1
    }
  }
})

export const { AddToCartList, RemoveFromCartlist } = cartListSlice.actions
export default cartListSlice.reducer

export const addToCartList = (product) => async (dispatch) => {
  try {
    const id = localStorage.getItem('id')
    const response = await axios.post('https://koicaresystem.azurewebsites.net/api/cartItems/item/add', {
      userId: id,
      productId: product.id,
      img: product.images[0].downloadUrl,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1
    })
    dispatch(AddToCartList(response.data))
  } catch (error) {
    console.log(error)
  }
}
