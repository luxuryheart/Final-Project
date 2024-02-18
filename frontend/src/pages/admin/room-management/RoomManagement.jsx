import React, { useEffect, useState } from 'react'
import { IoIosSettings } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { GetDormitoryByID  } from '../../../services/backoffice/dormitorybo';
import axios from 'axios';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const RoomManagement = ({ setRoomModal, setRoomId, setFloorId, setRoomName, roomModal }) => {
  const [dormitory, setDormitory] = useState({})
  const [floorOpen, setFloorOpen] = useState(false)
  
  const { id } = useParams()

  const getDormitoryById = async () => {
    try {
      const res = await GetDormitoryByID(id)
      if (res) {
        setDormitory(res)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const increaseRoom = async(e, floorId) => {
    e.preventDefault() 
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: id,
      floorId: floorId,
      flag: "1",
    })
    if (res.data.success) {
      setTimeout(() => getDormitoryById(), 500)
    }
  }

  const increaseFloor = async(e) => {
    e.preventDefault() 
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: id,
      flag: "0",
    })
    setTimeout(() => getDormitoryById(), 1000)
  }

  const deleteFloor = async(e, floorId) => {
    e.preventDefault()
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: id,
      floorId: floorId,
      flag: "3",
    })
    setTimeout(() => getDormitoryById(), 1000)
  } 

  const deleteRoom = async(e, floorId, roomId) => {
    e.preventDefault() 
    const res = await axios.post("/api/v1/dormitory-rooms-floors-update", {
      dormitoryId: id,
      floorId: floorId,
      roomId: roomId,
      flag: "2",
    })
    setTimeout(() => getDormitoryById(), 500)
  }

  const openRoom = (e, floorId, roomId, roomName) => {
    e.preventDefault()
    setRoomId(roomId)
    setFloorId(floorId)
    setRoomName(roomName)
    setRoomModal(true)
  }

  useEffect(() => {
    getDormitoryById()
  }, [roomModal])

  return (
    <div className='relative'>
      <div className="mx-auto max-h-screen h-screen max-w-screen w-full">
        <div className="px-5 py-4 text-colorDark">
          <div id="header" className="flex justify-between items-center">
            <div className="text-2xl text-colorBlueDark">ผังห้อง</div>
            <button className="text-xs px-1 py-1 bg-colorBlueGray/70 rounded-md hover:bg-colorBlueGray duration-300">
              <IoIosSettings className="inline" />
              ตั้งค่าการแสดงผล
            </button>
          </div>
          <div id="body" className="overflow-y-auto max-h-[85vh] mt-3 mb-3">
            {dormitory &&
              dormitory.floors &&
              dormitory.floors.length > 0 &&
              dormitory.floors.map((floor, index) => (
                <div
                  className="bg-bgForm w-full rounded-lg shadow-lg mb-6"
                  key={index}
                >
                  <div className="flex items-center justify-between px-3 pt-2 mb-3">
                    <div className="flex items-center justify-center gap-x-3 mt-3 text-colorDark">
                      <div className="text-xl font-bold">
                        ชั้นที่ {floor.name}
                      </div>
                      <div className="relative flex items-center text-sm text-colorBlueDark">
                        <IoMdSearch className="absolute ml-2 h-5 w-5 text-colorBlueGray cursor-pointer hover:scale-105 duration-300" />
                        <input
                          type="text"
                          placeholder="ค้นหาด้วยเลขห้อง"
                          className="px-8 py-1 border rounded-md bg-bgColor"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        className="bg-red-600 mx-2 text-bgColor py-1 px-2 rounded-md text-sm hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95"
                        onClick={(e) => deleteFloor(e, floor._id)}
                      >
                        ลบชั้น
                      </button>
                      <button
                        className="bg-colorBlueDark text-bgColor py-1 px-2 rounded-md text-sm hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95"
                        onClick={(e) => increaseRoom(e, floor._id)}
                      >
                        เพิ่มห้อง
                      </button>
                    </div>
                  </div>
                  <div className="w-full border-b-2 border-bgLine"></div>
                  <div className="overflow-y-auto lg:max-h-[40vh] xl:max-h-[45vh]">
                    <div className="grid xl:grid-cols-7 lg:grid-cols-6 gap-y-4 items-center py-5 lg:mx-2 xl:mx-4">
                      {floor.rooms &&
                        floor.rooms.length > 0 &&
                        floor.rooms.map((room, index) => (
                          <div
                            className="mx-3 text-center text-colorDark"
                            key={index}
                          >
                            <p>{room.name}</p>
                            <div className='relative lg:w-full lg:h-[110px] xl:w-5/5 xl:h-[135px] p-1'>
                              <div
                                className={` flex items-center justify-center ${
                                  room.status.name === "ว่าง"
                                    ? " bg-sky-100 "
                                    : " bg-green-200 "
                                }  rounded-lg cursor-pointer duration-300 hover:bg-sky-200 h-full`}
                              onClick={(e) => openRoom(e, floor._id, room._id, room.name)}>
                                {room.status.name === "ว่าง" ? (
                                  <div>ห้องว่าง</div>
                                ) : (
                                  <div>มีผู้เช่า</div>
                                )}
                              </div>
                                <div className='absolute -top-2 -right-2 z-10 cursor-pointer' onClick={(e) => deleteRoom(e, floor._id, room._id)}><MdCancel className='text-red-600 h-7 w-7 hover:scale-110 duration-300'/></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div id="footer" className="w-full mb-5">
            <div className="flex flex-col items-center justify-center text-colorDark tooltip" data-tip="เพิ่มชั้น">
              <IoAddCircleOutline
                className="h-10 w-10 text-green-800 cursor-pointer hover:text-green-500 duration-300"
                // onMouseEnter={(e) => setFloorOpen(true)}
                // onMouseLeave={(e) => setFloorOpen(false)}
                onClick={increaseFloor}
              />
              {/* {floorOpen && (
                <div className="bg-bgForm shadow-lg px-3 py-1 rounded-md text-sm">
                  เพิ่มชั้น
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomManagement