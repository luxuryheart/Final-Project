import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { useParams } from "react-router-dom";
import { GetFloorByDormitoryID } from "../../../services/backoffice/floorFilter";
import { GetRoomByMeterUnit } from "../../../services/backoffice/floorFilter";

const WaterMeter = () => {
  const [floorId, setFloorId] = useState("");
  const [floor, setFloor] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  // const [date, setDate] = useState("2024-04");
  const [meterUnit, setMeterUnit] = useState({})
  const [search, setSearch] = useState("");

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

  console.log(floorId);
  console.log(floor);

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const changePage = (id) => {
    setCurrentPage(id);
  }

  const getRoomByMeterUnit = async(floorId, date) => {
    try {
      const dormitoryId = id
      const res = await GetRoomByMeterUnit(floorId, date, dormitoryId);
      if (res) {
        setRooms(res)
        setMeterUnit(res)

      } else {
        setMeterUnit(res)
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    // await getFloorFilter(selectedFloorId);
  };

  const handleChange = (e, roomId, waterID) => {
    const { name, value } = e.target;
    setRooms((prevRooms) => 
      prevRooms.map((room) => 
        room._id === roomId && room.waterID === waterID 
          ? { ...room, [name]: value }
          : room
      )
    );
  }
  

  const handleWaterUpdate = async(e, meterId, roomId) => {
    e.preventDefault()
    try {
      const res = await axios.put(`/api/v1/backoffice/meter-units`, {
        dormitoryId: id,
        floorId: floorId,
        flag: "0",
        meterUnit: rooms,
        meterId: meterId,
        roomId: roomId
      }, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setTimeout(() => getRoomByMeterUnit(floorId, date), 500)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const CreateMeterUnit = async() => {
    try {
      const newDate = `${date}-${new Date().toLocaleDateString("th-TH").slice(0, 2)}`;
      const res = await axios.post(`/api/v1/backoffice/meter-units`, {
        dormitoryId: id,
        date: newDate
      })
      if (res.data.success) {
        setTimeout(() => getRoomByMeterUnit(floorId, date), 500)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFloorById();
  }, []);

  useEffect(() => {
    if (floorId || date) {
      getRoomByMeterUnit(floorId, date);
    }
  }, [date, floorId, floor])

  return (
    <div className="px-5 mt-6">
      <div className="flex flex-col justify-center text-colorBlueDark">
        <div className="text-2xl font-bold mb-5">มิเตอร์น้ำ</div>
        <div id="header-bar" className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-x-5">
            <div className="text-base font-semibold">
              {floor.filter((item) => item._id === floorId).map((selectedFloor) => (
                `ชั้นที่ ${selectedFloor.name}`
              ))}
            </div>
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
            <div className="relative flex items-center text-sm text-colorBlueDark">
              <IoMdSearch className="absolute ml-2 h-5 w-5 text-colorBlueGray cursor-pointer hover:scale-105 duration-300" />
              <input
                type="text"
                placeholder="ค้นหาด้วยเลขห้อง"
                className="btn btn-xs input-bordered bg-colorBlueDark/10"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="relative flex items-center text-sm text-colorBlueDark">
            <input type="month" name="date" id="date" value={date} min={new Date().toISOString().slice(0, 7)} className="input input-bordered input-sm" onChange={(e) => setDate(e.target.value)}/>
          </div>
        </div>
        {(meterUnit === undefined) || (meterUnit === null) ? (
          <div className="text-center mt-10">
            <p>ไม่พบรายการ</p>
            <button className="btn btn-sm bg-colorBlueDark text-bgColor mt-5" onClick={CreateMeterUnit}>สร้างรายการจดมิเตอร์</button>
          </div>
        ) : (
        <div id="table">
          <div className="overflow-x-auto max-h-[75vh] mb-5">
            <table className="table text-colorBlueDark">
              <thead>
                <tr className="bg-base-300 text-center">
                  <th>เลขห้อง</th>
                  <th className="w-20">สถานะ</th>
                  <th>เลขมิเตอร์ครั้งก่อน</th>
                  <th>เลขมิเตอร์ล่าสุด</th>
                  <th>เลขหน่วยที่ใช้</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody className="">
                {records.filter((room) => room.roomId.name.toLowerCase().includes(search.toLowerCase())).map((room, i) => {
                  return (
                    <tr
                      className={`text-center ${i % 2 !== 0 ? "bg-base-300" : ""}`}
                      key={i}
                    >
                      <th>{room.roomId.name}</th>
                      <td>{room.roomId.status.name}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="input bg-transparent input-bordered w-xs max-w-xs input-sm"
                          name="initialReading"
                          value={room.initialReading}
                          onChange={(e) => handleChange(e, room._id, room.waterID)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="input bg-transparent input-bordered w-xs max-w-xs input-sm"
                          name="finalReading"
                          value={room.finalReading}
                          onChange={(e) => handleChange(e, room._id, room.waterID)}
                        />
                      </td>
                      <td>{room.consumption}</td>
                      <td>
                        <button className="btn btn-sm bg-colorBlueDark text-bgColor"
                        disabled={room.invoiceStatus}
                        onClick={(e) => handleWaterUpdate(e, room._id, room.roomId._id)}>
                          อัพเดต
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
                key={n}
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
        ) }
      </div>
    </div>
  );
};

export default WaterMeter;
