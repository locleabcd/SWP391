import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  wishlist: [],
  count: 0
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    AddToWishlist: (state, action) => {
      const existingItem = state.wishlist.find((item) => item.id === action.payload.id)
      if (!existingItem) {
        state.wishlist.push(action.payload)
        state.count += 1
      }
    },
    RemoveFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => item.id !== action.payload.id)
      state.count -= 1
    },
    ClearWishlist: (state) => {
      state.wishlist = []
    }
  }
})

export const { AddToWishlist, RemoveFromWishlist, ClearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
