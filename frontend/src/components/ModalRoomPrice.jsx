import React from 'react'
import { FaXmark } from "react-icons/fa6";
import { useState } from 'react';
import axios from 'axios';

const ModalRoomPrice = ({ selectRooms, setSelectRooms, setOpenModal, getRooms}) => {
    const [rommPrice, setRoomPrice] = useState(0.0)
    const [furniturePrice, setFurniturePrice] = useState(0.0)

    const handleChange = (e) => {
        const {name, value} = e.target
        if (name === "room") {
            setRoomPrice(value)
        } else if (name === "furniture") {
            setFurniturePrice(value)
        }
    }
    const handleUpdate = async(e) => {
        try {
            const res = await axios.post("/api/v1/dormitory-rooms-price", {
                roomIds: selectRooms.rooms,
                floorId: selectRooms.floorId,
                dormitoryId: "656a19e62bcd35aee1e16ded",
                price: {
                    roomCharge: rommPrice,
                    servicePrice: furniturePrice
                }
            }, {
                headers: {
                    authtoken: localStorage.getItem("token")
                }
            })
            if (res.data.success) {
                setOpenModal(false)
                setSelectRooms({
                    floorId: "",
                    rooms: [],
                  });
                setTimeout(() => getRooms(), 1000)
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='bg-colorBlueDark/[.5] absolute w-screen z-20 h-screen'>
        <div className='flex flex-col mt-[20vh] items-center h-screen shadow-md z-50'>
            <div id="header" className='bg-bgModal w-2/4 z-50 flex items-center justify-between px-5 py-2 text-colorBlueDark'>
                <div>
                    แก้ไขค่าห้อง
                </div>
                <button className='text-bgBlueInput font-bold text-3xl hover:scale-110 hover:text-slate-500 duration-300'
                    onClick={() => setOpenModal(false)}>
                    <FaXmark />
                </button>
            </div>
            <div className='border border-b border-colorBlueDark/20 w-2/4'></div>
            <div id='body' className='bg-bgModal w-2/4 text-colorBlueDark' >
                <div className='flex flex-col py-5 px-5 gap-y-3'>
                    <div className='flex justify-between items-center'>
                        <p>ค่าเช่าห้อง (บาท/เดือน)</p>
                        <input type="number" name='room' value={rommPrice} placeholder="0.00" className="input input-bordered w-full max-w-xs" onChange={handleChange}/>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p>ค่าเช่าห้อง (บาท/เดือน)</p>
                        <input type="number" name='furniture' value={furniturePrice} placeholder="0.00" className="input input-bordered w-full max-w-xs" onChange={handleChange}/>
                    </div>
                    <div className='text-red-700'>
                        ** ถ้าไม่มีค่าห้องให้กำหนดเป็น 0 **
                    </div>
                </div>
            </div>
            <div className='border border-b border-colorBlueDark/20 w-2/4'></div>
            <div id='footer' className='bg-bgModal w-2/4 py-3 px-5 text-end'>
                <button className='py-2 px-5 rounded-md  hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95  bg-colorBlueDark text-bgColor font-extralight text-base font-serif text-center'
                onClick={handleUpdate}>บันทึก</button>
            </div>
        </div>
    </div>
  )
}

export default ModalRoomPrice