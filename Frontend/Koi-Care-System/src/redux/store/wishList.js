import { createSlice } from '@reduxjs/toolkit'

// Helper function to load wishlist from localStorage
const loadFromLocalStorage = () => {
  const storedWishlist = localStorage.getItem('wishlist')
  return storedWishlist ? JSON.parse(storedWishlist) : []
}

const initialState = {
  wishlist: loadFromLocalStorage(),
  count: loadFromLocalStorage().length
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
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist))
      }
    },
    RemoveFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => item.id !== action.payload.id)
      state.count -= 1
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist))
    },
    ClearWishlist: (state) => {
      state.wishlist = []
      state.count = 0
      localStorage.removeItem('wishlist')
    }
  }
})

export const { AddToWishlist, RemoveFromWishlist, ClearWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
