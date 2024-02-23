import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { GetFloorFilter } from "../../../services/backoffice/floorFilter";
import { useParams } from "react-router-dom";
import { GetFloorByDormitoryID } from "../../../services/backoffice/floorFilter";
import { GetWaterMeter } from "../../../services/backoffice/meterUnit";
import { GetRoomByMeterUnit } from "../../../services/backoffice/floorFilter";
import { FaCheckCircle } from "react-icons/fa";
import { GetRoomByElectricalMeterUnit } from "../../../services/backoffice/floorFilter";

const Bill = () => {
    const [floorId, setFloorId] = useState("");
    const [floorName, setFloorName] = useState("");
    const [floor, setFloor] = useState([]);
    const [rooms, setRooms] = useState([]);
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
    // const [date, setDate] = useState("2024-04");
    const [meterUnit, setMeterUnit] = useState({})
    const [electricalMeterUnit, setElectricalMeterUnit] = useState({})
  
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

    const getRoomByElectricalMeterUnit = async(floorId, date) => {
      try {
        const dormitoryId = id
        const res = await GetRoomByElectricalMeterUnit(floorId, date, dormitoryId);
        if (res) {
          setRooms(res)
          setElectricalMeterUnit(res)
        } else {
          setElectricalMeterUnit(res)
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
        //   const floorNames = res
        //   .filter((floor) => floor._id === floorId)
        //   console.log(floorNames);
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
  
    const CreatInvoice = async(e, roomId) => {
      const newDate = `${date}-${new Date().toLocaleDateString("th-TH").slice(0, 2)}`;
      try {
        const res = await axios.post(`/api/v1/backoffice/invoiced`, {
            roomId: roomId,
            dormitoryId: id,
            date: newDate,
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

    const createAllInvoice = async() => {
      try {
        const newMeterRooms = rooms.filter((room) => room.invoiceStatus === false && room.roomId?.status?.name === "มีผู้เช่า");
        const newElectricalMeterRooms = electricalMeterUnit.filter((room) => room.invoiceStatus === false && room.roomId?.status?.name === "มีผู้เช่า");
        const newDate = `${date}-${new Date().toLocaleDateString("th-TH").slice(0, 2)}`;
        const res = await axios.post(`/api/v1/backoffice/invoiced-all`, {
            meterId: newMeterRooms,
            elecId: newElectricalMeterRooms,
            dormitoryId: id,
            date: newDate,
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
  
    useEffect(() => {
      getFloorById();
    }, []);
  
    useEffect(() => {
      if (floorId || date) {
        getRoomByMeterUnit(floorId, date);
        getRoomByElectricalMeterUnit(floorId, date);
      }
    }, [date, floorId])
    return (
      <div className="px-5 mt-6">
        <div className="flex flex-col justify-center text-colorBlueDark">
          <div className="text-2xl font-bold mb-5">สร้างใบแจ้งหนี้</div>
          <div id="header-bar" className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-x-5">
                {/*
                    TODO: ชื่อชั้นไม่ไดนามิกตามเวลาชั้นเปลี่ยน
                */}
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
            </div>
            <div className="relative flex items-center gap-x-2 text-sm text-colorBlueDark">
              <input type="month" name="date" id="date" value={date} min={new Date().toISOString().slice(0, 7)} className="input input-bordered input-sm" onChange={(e) => setDate(e.target.value)}/>
              <button className="btn btn-sm btn-outline btn-success" onClick={createAllInvoice}><FaCheckCircle className="text-green-600 h-3 w-3"/>สร้างใบแจ้งหนี้ทุกห้อง</button>
            </div>
          </div>
          {(meterUnit === undefined) || (meterUnit === null) ? (
            <div className="text-center mt-10">
              <p>ยังไม่มีการจดมิเตอร์</p>
              {/* <button className="btn btn-sm bg-colorBlueDark text-bgColor mt-5" onClick={CreateMeterUnit}>สร้างรายการจดมิเตอร์</button> */}
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
                    <th>ค่าห้อง</th>
                    <th>action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {records.map((room, i) => {
                    return (
                      <tr
                        className={`text-center ${
                          i % 2 !== 0 ? "bg-base-300" : ""
                        } ${room.roomId.status.name === "มีผู้เช่า" ? "text-colorBlueDark" : " text-slate-400"}`}
                        key={i}
                      >
                        <th>{room.roomId.name}</th>
                        <td>{room.roomId.status.name}</td>
                        <td>{room.initialReading}</td>
                        <td>{room.finalReading}</td>
                        <td>{room.consumption}</td>
                        <td>{room.roomId.roomCharge}</td>
                        <td>
                          {room.roomId.status.name === "มีผู้เช่า" && room.invoiceStatus === false ? (
                            <button
                              className="btn btn-sm btn-outline btn-success text-bgColor text-xs"
                              onClick={(e) =>
                                CreatInvoice(e, room.roomId._id)
                              }
                            >
                              สร้างใบแจ้งหนี้
                            </button>
                          ) : room.roomId.status.name === "มีผู้เช่า" && room.invoiceStatus ? (
                            <button className="btn btn-sm btn-outline btn-success" disabled><FaCheckCircle className="text-green-600 h-3 w-3"/>สร้างใบแจ้งหนีสำเร็จ</button>
                          ) : (
                            <div className="text-xs">ห้องว่างไม่สามารถสร้างใบแจ้งหนี้ได้</div>
                          )}
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

export default Bill