import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dormitory: {},
}

export const dormitorySlice = createSlice({
  name: 'dormitory',
  initialState,
  reducers: {
    dormitoryCreate: (state, action) => {
      state.dormitory = action.payload
    },
  },
})

export const { dormitoryCreate } = dormitorySlice.actions

export default dormitorySlice.reducer