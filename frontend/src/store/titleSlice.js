import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  title: "",
}

export const titleSlice = createSlice({
  name: 'titles',
  initialState,
  reducers: {
    getTitle: (state, action) => {
      state.title = ""
      state.title = action.payload
    },
  },
})

export const { getTitle } = titleSlice.actions

export default titleSlice.reducer