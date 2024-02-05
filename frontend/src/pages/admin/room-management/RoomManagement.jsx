import React from 'react'
import { IoIosSettings } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";

const RoomManagement = () => {
  return (
    <>
      <div className='mx-auto max-h-screen h-screen max-w-screen w-full'>
        <div className='px-5 py-4 text-colorDark'>
          <div id='header' className='flex justify-between items-center'>
            <div className='text-2xl text-colorBlueDark'>ผังห้อง</div>
            <button className='text-xs px-1 py-1 bg-colorBlueGray/70 rounded-md hover:bg-colorBlueGray duration-300'><IoIosSettings className='inline'/>ตั้งค่าการแสดงผล</button>
          </div>
          <div id='body' className='overflow-y-auto max-h-screen mt-3'>
            <div className='bg-bgForm w-full rounded-lg shadow-lg px-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-center gap-x-3 mt-3 text-colorDark'>
                  <div className='text-base font-bold'>ชั้นที่ 1</div>
                  <div className='relative flex items-center text-sm text-colorBlueDark'><IoMdSearch className="absolute ml-2 h-5 w-5 text-colorBlueGray cursor-pointer hover:scale-105 duration-300"/><input type="text" placeholder="ค้นหาด้วยเลขห้อง" className="px-8 py-1 border rounded-md bg-bgColor" /></div>
                </div>
                <div>
                  
                </div>
              </div>
              <div>line</div>
              <div>body</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RoomManagement