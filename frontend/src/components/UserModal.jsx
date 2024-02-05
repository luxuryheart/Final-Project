import React from 'react'
import { IoMdSettings } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';

const UserModal = () => {
    const token = localStorage.getItem('token')
    const Logout = () => {
        localStorage.removeItem('token')
        useNavigate('/login')
    }
  return (
    <div className='absolute top-14 right-12'>
        <div className='bg-bgForm text-colorBlueDark rounded-lg shadow-md'>
            <div className='flex flex-col text-colorDark text-base'>
                <Link onClick={""} className='px-2 py-2 cursor-pointer hover:bg-slate-200 hover:rounded-t-lg flex items-center gap-x-1'><IoMdSettings className='h-5 w-5'/>ตั้งค่าโปรไฟล์</Link>
                <div className='border-b-2 border-colorDark/80'></div>
                <Link onClick={Logout} className='px-2 py-2  cursor-pointer hover:bg-slate-200 hover:rounded-b-lg flex items-center gap-x-1'><TbLogout2 className='h-5 w-5'/>ออกจากระบบ</Link>
            </div>
        </div>
    </div>
  )
}

export default UserModal