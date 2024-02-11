import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { GetFloorFilter } from "../../../services/backoffice/floorFilter";
import { useParams } from "react-router-dom";
import { GetFloorByDormitoryID } from "../../../services/backoffice/floorFilter";

const WaterMeter = () => {
  const [floorId, setFloorId] = useState("");
  const [floor, setFloor] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { id } = useParams();

  // pagination for rooms
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;
  const lastIndex = currentPage * recordsPerPage; // 1 * 3 = 3
  const firstIndex = lastIndex - recordsPerPage; // 3 - 3 = 0
  const records = rooms.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(rooms.length / recordsPerPage);
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const changePage = (id) => {
    setCurrentPage(id);
  }

  const getFloorFilter = async (floorId) => {
    try {
      const res = await GetFloorFilter(floorId);
      if (res) {
        setRooms(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFloorById = async () => {
    try {
      const res = await GetFloorByDormitoryID(id);
      if (res.length > 0) {
        setFloor(res);
        setFloorId(res[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectFloor = async (e) => {
    const selectedFloorId = e.target.value;
    setFloorId(selectedFloorId);
    // อันเก่า: await getFloorFilter(floorId);
    await getFloorFilter(selectedFloorId); // แก้เป็นการส่ง selectedFloorId แทน floorId
  };

  useEffect(() => {
    getFloorById();
  }, []);

  useEffect(() => {
    // อันเก่า: getFloorFilter(floorId);
    if (floorId) {
      // เพิ่มการตรวจสอบว่า floorId มีค่าหรือไม่ก่อนเรียกฟังก์ชัน
      getFloorFilter(floorId);
    }
  }, [floorId]);

  return (
    <div className="px-5 mt-6">
      <div className="flex flex-col justify-center text-colorBlueDark">
        <div className="text-2xl font-bold mb-5">มิเตอร์น้ำ</div>
        <div id="header-bar" className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-x-5">
            <div className="text-base font-semibold">ชั้นที่ 1</div>
            <select
              className="select select-bordered w-xs max-w-xs select-xs"
              onChange={handleSelectFloor}
            >
              {floor.map((floor, i) => (
                <option key={i} value={floor._id} selected={floor.name === "1"}>
                  ชั้นที่ {floor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex items-center text-sm text-colorBlueDark">
            <IoMdSearch className="absolute ml-2 h-5 w-5 text-colorBlueGray cursor-pointer hover:scale-105 duration-300" />
            <input
              type="text"
              placeholder="ค้นหาด้วยเลขห้อง"
              className="px-8 py-1 border border-colorBlueDark/20 rounded-md bg-colorBlueDark/10"
            />
          </div>
        </div>
        <div id="table">
          <div className="overflow-x-auto max-h-[75vh] mb-5">
            <table className="table text-colorBlueDark">
              {/* head */}
              <thead>
                <tr className="bg-base-300 text-center">
                  <th>เลขห้อง</th>
                  <th className="w-20">สถานะ</th>
                  <th>เลขมิเตอร์ครั้งก่อน</th>
                  <th>เลขมิเตอร์ล่าสุด</th>
                  <th>เขหน่วยที่ใช้</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody className="">
                {records.map((room, i) => (
                  <tr
                    className={`text-center ${
                      i % 2 !== 0 ? "bg-base-300" : " "
                    }`}
                    key={i}
                  >
                    <th>{room.name}</th>
                    <td>{room.status.name}</td>
                    {/* TODO: เดี๋ยวมาทำเปลี่ยนค่า value ใหม่หลังจากทำ waterUnit */}
                    <td>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input bg-transparent input-bordered w-xs max-w-xs input-sm"
                        name="waterMeter"
                        value={room.waterMeter}
                      />
                    </td>
                    {/* TODO: เดี๋ยวมาทำเปลี่ยนค่า value ใหม่หลังจากทำ waterUnit */}
                    <td>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input bg-transparent input-bordered w-xs max-w-xs input-sm"
                        name="waterMeter"
                        value={room.waterMeter}
                      />
                    </td>
                    {/* TODO: เดี๋ยวมาทำเปลี่ยนค่า value ใหม่หลังจากทำ waterUnit */}
                    <td>{room.waterMeter}</td>
                    <td>
                      <button className="btn btn-sm bg-colorBlueDark text-bgColor">
                        อัพเดต
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="join text-sm">
            <button
              className="join-item bg-colorBlueDark/10 px-2 py-1 text-center text-xs hover:bg-colorBlueDark/20"
              onClick={prePage}
            >
              Prev
            </button>
            {numbers.map((n, i) => (
              <button
                className={`join-item bg-colorBlueDark/10 px-3 py-1 text-center hover:bg-colorBlueDark/20${
                  currentPage === n
                    ? " active:bg-colorBlueDark/20 focus:bg-colorBlueDark/20 "
                    : " "
                }`}
                key={i}
                onClick={() => changePage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="join-item bg-colorBlueDark/10 px-2 py-1 text-center text-xs hover:bg-colorBlueDark/20"
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WaterMeter;
