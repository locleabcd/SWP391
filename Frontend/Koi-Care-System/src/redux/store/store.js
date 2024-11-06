import { configureStore } from '@reduxjs/toolkit'
import wishlistSlice from './wishList'
import cartListSlice from './cartList'

export const store = configureStore({
  reducer: {
    name: wishlistSlice,
    cart: cartListSlice
  }
})
