import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getTitle } from '../../store/titleSlice'
import axios from 'axios'
import { Link } from 'react-router-dom';

const RoomsManagement = () => {
  const { dormitory } = useSelector((state) => state.dormitory)
  const dispatch = useDispatch()
  const text = "กำหนดผังห้อง"
  const navigate = useNavigate()

  const dormitoryId = dormitory._id
  const idMock = "656a19e62bcd35aee1e16ded"

  // เดี๋ยวมีการเอาไอดีจาก params มาตอนนี้ใช้ useDispatch ชั่วคราว

  const [rooms, setRooms] = useState({})

  const getRooms = async() => {
    try {
      const res = await axios.get(`/api/v1/get-all-rooms/${idMock}`)
      if (res.data.success) {
        setRooms(res.data.dormitoryDetail)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const increaseFloor = async(e) => {
    e.preventDefault() 
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: idMock,
      flag: "0",
    })
    setTimeout(() => window.location.reload(), 1000)
  }
  const increaseRoom = async(e, floorId) => {
    e.preventDefault() 
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: idMock,
      floorId: floorId,
      flag: "1",
    })
    setTimeout(() => window.location.reload(), 500)
  }

  const deleteRoom = async(e, floorId, roomId) => {
    e.preventDefault() 
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: idMock,
      floorId: floorId,
      roomId: roomId,
      flag: "2",
    })
    setTimeout(() => window.location.reload(), 500)
  }

  const deleteFloor = async(e, floorId) => {
    e.preventDefault()
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: idMock,
      floorId: floorId,
      flag: "3",
    })
    setTimeout(() => window.location.reload(), 1000)
  } 

  useEffect(() => {
    dispatch(getTitle(text))
    getRooms()
  },[text]);

  return (
    <div id="contained" className="container mx-auto">
      <div className="flex justify-center py-10">
        <div className="bg-bgForm py-10 px-4 mt-5 w-8/12 lg:w-6/12 xl:w-5/12 drop-shadow-lg rounded-md">
          <div className="flex flex-col">
            <div className="overflow-y-scroll overscroll-auto h-[52vh] max-h-[60vh] mb-5">
              <div className="flex flex-col gap-y-5 items-center justify-between w-full text-colorDark text-xl">
                {rooms &&
                  rooms.floors && 
                  rooms.floors.map((floor, i) => (
                    <div className="flex flex-col gap-y-3" key={i}>
                      <div className="flex items-center justify-between w-full">
                        <div>ชั้นที่ {floor.name} {floor.name != 1 && <span className='text-sm text-red-700 underline cursor-pointer' onClick={(e) => deleteFloor(e, floor._id)}>ลบชั้น</span>}</div>
                        <button className="bg-colorBlueDark text-bgColor py-1 px-2 rounded-md text-sm hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95"
                        onClick={(e) => increaseRoom(e, floor._id)}>
                          เพิ่มห้อง
                        </button>
                      </div>
                      <div className="overflow-y-scroll overscroll-auto h-[19vh]">
                        <div className="overflow-x-auto">
                          <table className="table table-zebra">
                            {/* head */}
                            <thead>
                              <tr className="text-center">
                                <th>เลขห้อง</th>
                                <th>ชื่อห้องที่ต้องการแก้ไข</th>
                                <th>สถานะ</th>
                                <th>action</th>
                              </tr>
                            </thead>
                            {floor &&
                              floor.rooms &&
                              floor.rooms.map((room, j) => (
                                <tbody key={j}>
                                  <tr className="text-center">
                                    <th>{room.name}</th>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder={room.name}
                                        className="input input-bordered w-full max-w-xs"
                                        value={room.name}
                                      />
                                    </td>
                                    {/* TODO: หลังบ้านทำสถานะก่อนเดี๋ยวมาเพิ่ม */}
                                    <td>
                                      <div className="bg-[#EBF9F1] text-[#1F9254] px-2 py-1 text-xs rounded-xl">
                                        ว่าง
                                      </div>
                                    </td>
                                    <td>
                                      <button className='hover:scale-125 duration-300' onClick={(e) => deleteRoom(e, floor._id, room._id)}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke-width="1.5"
                                          stroke="currentColor"
                                          class="w-5 h-5"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="px-3 mb-5">
              <button className="bg-[#C0D4FD] text-[#2B53A5] py-1 px-2 rounded-full text-sm hover:bg-slate-300 hover:scale-105 duration-300 active:scale-95"
              onClick={increaseFloor}>
                เพิ่มชั้น
              </button>
            </div>
            <div id='button'>
              <Link to={'/dormitory/home'} className='w-full flex justify-center'>
                <button
                  className="py-2 rounded-md  hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95 w-1/2 bg-colorBlueDark text-bgColor font-extralight text-base font-serif text-center"
                >
                  บันทึก
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomsManagement