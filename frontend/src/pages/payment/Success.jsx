import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaCheckCircle } from "react-icons/fa";
import axios from 'axios';

const Success = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  document.title = "ชำระเงินสำเร็จ"
  const token = localStorage.getItem("token");

  let path = useLocation()
  path = path.pathname.split("/")[1]

  const updateStatus = () => {
    try {
      const res = axios.get(`/api/v1/payment/${id}`, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setTimeout(() => navigate("/"), 5000)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (path === "success") {
      updateStatus()
    }
  }, [path])

  useEffect(() => {
    updateStatus();
  })

  useEffect(() => {
    if (!id) { 
      setTimeout(() => navigate("/"), 5000)
    }
  }, [id])
  return (
    <div className='container mx-auto max-h-screen max-w-screen'>
      <div className='flex items-center justify-center h-screen '>
        <div className='bg-bgForm text-colorBlueDark rounded-lg shadow-lg w-[300px] mb-40'>
            <div className='flex items-center justify-center pb-3 pt-5'>
              <FaCheckCircle className='h-20 w-20 text-green-600 border-green-700 border-2 rounded-full'/>
            </div>
            <div className='text-xl font-bold text-center py-1'>ชำระเงินสำเร็จ</div>
            <Link to={"/"} className='text-sm text-center text-colorBlueGray hover:underline hover:text-colorBlueDark hover:scale-105 cursor-pointer duration-300 '><div className='pb-5'>กลับสู่หน้าหลัก</div></Link>
        </div>
      </div>
    </div>
  )
}

export default Success