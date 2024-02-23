import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaCircle } from "react-icons/fa";
import { useClipboard } from 'use-clipboard-copy';
import { FaPaperclip } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

const DormitoryList = ({ setListModal }) => {
    const [dormitory, setDormitory] = useState([])
    const token = localStorage.getItem('token')
    const clipboard = useClipboard();
    const [search, setSearch] = useState("");

    const roomsCountPerDormitory = dormitory.map((d) => ({
        dormitoryName: d.name,
        roomsCount: d.floors.reduce(
          (total, floor) => total + floor.rooms.length,
          0
        ),
      }));
    
      const roomFree = dormitory.map((d) => {
        const dormitoryName = d.name;
        const matchedRoom = roomsCountPerDormitory.find(room => room.dormitoryName === dormitoryName);
        const freeRoomsCount = d.floors.reduce(
          (total, floor) => total + floor.rooms.filter(room => room.status.name === "ว่าง").length,
          0
        );
        return { dormitoryName, freeRoomsCount };
      });
      
      const roomOccupied = dormitory.map((d) => ({
        dormitoryName: d.name,
        occupiedRoomsCount: d.floors.reduce(
          (total, floor) => 
            total + floor.rooms.filter(room => room.status.name === "มีผู้เช่า").length,
          0
        ),
      }))
    const GetDormitory = async () => {
        try {
            const res = await axios.get('/api/v1/dormitory', {
                headers: {
                    authtoken: token
                }
            })
            if (res) {
                setDormitory(res.data.dormitory)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetDormitory()
    }, [])
  return (
    <div className="bg-colorBlueDark/30 z-20 top-0 w-screen h-screen absolute">
      <div className="flex items-center justify-center h-full container mx-auto lg:px-48 xl:px-80">
        <div className="bg-bgForm text-colorBlueDark rounded-lg shadow-md px-5 py-5 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-semibold">รายชื่อหอพัก</div>
            <button onClick={() => setListModal(false)}>
              <RxCross2 className="h-7 w-7 cursor-pointer" />
            </button>
          </div>
            <div className="relative flex items-center text-sm text-colorBlueDark mb-3">
              <IoMdSearch className="absolute ml-2 h-5 w-5 text-colorBlueGray cursor-pointer hover:scale-105 duration-300" />
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อหอพัก"
                className="btn btn-sm w-full input-bordered bg-colorBlueDark/10"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[80vh]">
            <table className="table">
              <thead>
                <tr className="bg-base-200 text-center">
                  <th>ไอดี</th>
                  <th>ชื่อ</th>
                  <th>ว่าง</th>
                  <th>ไม่ว่าง</th>
                </tr>
              </thead>
              <tbody>
                {dormitory.filter((dormitory) => dormitory.name.toLowerCase().includes(search.toLowerCase())).map((dormitory, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "" : " bg-base-200"}} text-center`}>
                    <th className="flex items-center justify-center gap-x-1">{dormitory.numberId}<button className="tooltip" data-tip="คัดลอกไอดี" onClick={() => clipboard.copy(dormitory.numberId)}>{clipboard.copied ? <FaCheck className="inline h-2 w-3 text-green-500" /> : <FaPaperclip />}</button></th>
                    <td>{dormitory.name}</td>
                    <td><FaCircle className="inline h-2 w-3 text-green-500" />{" "}{roomFree[index].freeRoomsCount}</td>
                    <td><FaCircle className="inline h-2 w-3 text-red-500" />{" "}{roomOccupied[index].occupiedRoomsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DormitoryList;
