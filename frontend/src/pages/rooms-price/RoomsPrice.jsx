import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getTitle } from '../../store/titleSlice'

const RoomsPrice = () => {
    const dispatch = useDispatch()
    const text = "กำหนดค่าห้อง"

    useEffect(() => {
        dispatch(getTitle(text))
      },[text]);
  return (
    <div id='containerd' className='container mx-auto'>
      <div className='flex justify-center py-10'>
        <div className='bg-bgForm py-10 px-4 mt-5 w-8/12 lg:w-6/12 xl:w-7/12 drop-shadow-lg rounded-md'>
          
        </div>
      </div>
    </div>
  )
}

export default RoomsPrice