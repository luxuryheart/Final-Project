import { configureStore } from '@reduxjs/toolkit'
import titleReducer from './titleSlice'
import dormitoryReducer from './dormitorySlice'

export const store = configureStore({
  reducer: {
    titles: titleReducer,
    dormitory: dormitoryReducer,
  },
})