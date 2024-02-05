import React, { useEffect, useState } from 'react'
import { IoIosSettings } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { GetDormitoryByID  } from '../../../services/backoffice/dormitorybo';
import axios from 'axios';

const RoomManagement = () => {
  const [dormitory, setDormitory] = useState({})
  
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

  useEffect(() => {
    getDormitoryById()
  }, [])

  return (
    <>
      <div className="mx-auto max-h-screen h-screen max-w-screen w-full">
        <div className="px-5 py-4 text-colorDark">
          <div id="header" className="flex justify-between items-center">
            <div className="text-2xl text-colorBlueDark">ผังห้อง</div>
            <button className="text-xs px-1 py-1 bg-colorBlueGray/70 rounded-md hover:bg-colorBlueGray duration-300">
              <IoIosSettings className="inline" />
              ตั้งค่าการแสดงผล
            </button>
          </div>
          <div id="body" className="overflow-y-auto max-h-screen mt-3">
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
                      <button className="bg-colorBlueDark text-bgColor py-1 px-2 rounded-md text-sm hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95"
                      onClick={(e) => increaseRoom(e, floor._id)}>
                        เพิ่มห้อง
                      </button>
                    </div>
                  </div>
                  <div className="w-full border-b-2 border-bgLine"></div>
                  <div className="overflow-y-auto lg:max-h-[40vh] xl:max-h-[50vh]">
                    <div className="grid grid-cols-6 gap-y-4 items-center py-5 lg:mx-2 xl:mx-4">
                      {floor.rooms &&
                        floor.rooms.length > 0 &&
                        floor.rooms.map((room, index) => (
                          <div
                            className="mx-3 text-center text-colorDark"
                            key={index}
                          >
                            <p>{room.name}</p>
                            <div className={`flex items-center justify-center ${room.status.name === "ว่าง" ? " bg-sky-100 " : " bg-green-200 "} w-full lg:h-[110px] xl:h-[140px] rounded-lg cursor-pointer duration-300 hover:bg-sky-200 hover:scale-105`}>
                              {room.status.name === "ว่าง" ? <div>ห้องว่าง</div> : <div>มีผู้เช่า</div>}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomManagement