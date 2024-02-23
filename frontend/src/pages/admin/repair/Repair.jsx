import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Repair = () => {
  const [repair, setRepair] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const { id } = useParams();
  const [room, setRoom] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetDate, setMeetDate] = useState(new Date().toISOString().slice(0, 10));
  const [detail, setDetail] = useState("");
  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("pending");

    // pagination for rooms
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 9;
    const lastIndex = currentPage * recordsPerPage; // 1 * 3 = 3
    const firstIndex = lastIndex - recordsPerPage; // 3 - 3 = 0
    const records = repair.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(repair.length / recordsPerPage);
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

  const getAllRoom = async () => {
    try {
      const res = await axios.get(`/api/v1/get-all-rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setRoom(res.data.dormitoryDetail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `/api/v1/backoffice/repair`,
        {
          roomName,
          date,
          meetDate,
          description: detail,
        },
        {
          headers: {
            authtoken: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        getAllRoom();
        setIsCreate(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getRepair = async (status) => {
    try {
      const res = await axios.get(`/api/v1/backoffice/repair?status=${status}`, {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setRepair(res.data.repair);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `/api/v1/backoffice/repair`,
        {
          id,
          status: "success",
        },
        {
          headers: {
            authtoken: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        getRepair();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRoom();
  }, []);

  useEffect(() => {
    if (status) {
        getRepair(status);
    }
  }, [status]);
  return (
    <div className="text-colorBlueDark max-w-[150vh]">
      <div className="flex items-center justify-between px-5 mt-5">
        <div className="text-2xl">รายการแจ้งซ่อม</div>
        {!isCreate && (
            <div>
                <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={() => setIsCreate(!isCreate)}>
                    สร้าง
                </button>
            </div>
        )}
      </div>
      {!isCreate ? (
        <div>
            <div className="bg-bgForm p-5 shadow-lg mx-5 mt-5 rounded-md">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className={`btn btn-sm ${status === "pending" ? "bg-colorBlueDark text-bgColor" : "bg-base-300"} `} onClick={() => setStatus("pending")}>
                    รอดำเนินการ
                    </button>
                    <button className={`btn btn-sm ${status === "success" ? "bg-colorBlueDark text-bgColor" : "bg-base-300"}`} onClick={() => setStatus("success")}>ดำเนินการแล้ว</button>
                    <button className={`btn btn-sm ${status === "" ? "bg-colorBlueDark text-bgColor" : ""}`} onClick={() => setStatus("")}>ทั้งหมด</button>
                </div>
                </div>
                <div className="overflow-x-auto mt-3">
                <table className="table">
                    <thead>
                    <tr className="text-center">
                        <th>ห้อง</th>
                        <th>นัดซ่อม</th>
                        <th>สถานะ</th>
                        <th>รายละเอียด</th>
                        <th>action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {records?.map((repair) => (
                            <tr key={repair._id} className="text-center">
                                <th>{repair.roomName}</th>
                                <td>{repair.meetDate}</td>
                                <td className={`${repair.status === "pending" ? "text-yellow-600" : "text-green-600"}`}>{repair.status === "pending" ? "รอดำเนินการ" : "ดำเนินการแล้ว"}</td>
                                <td>{repair.description}</td>
                                <td>
                                    <button className="btn btn-sm bg-colorBlueDark text-bgColor" disabled={repair.status === "success"} onClick={() => handleUpdate(repair._id)}>ซ่อมแล้ว</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>  
            <div className="join text-sm px-5 mt-5">
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
      ):(
        <div className="bg-bgForm p-5 shadow-lg mx-5 mt-5 rounded-md">
            <div className="grid grid-cols-3 gap-x-3 items-center mb-5">
                <div>
                    <p className="text-sm mb-1">ห้อง <span className="text-red-500 text-xs">* จำเป็น</span></p>
                    <select className="select select-bordered w-full max-w-xl" onChange={(e) => setRoomName(e.target.value)}>
                        <option disabled selected>เลือกห้อง</option>
                        {room?.floors && room.floors.map((floor) => (
                            floor.rooms && floor.rooms.map((room) => (
                                <option key={room._id} value={room.name}>{room.name}</option>
                            ))
                        ))}
                    </select>
                </div>
                <div>
                    <p className="text-sm mb-1">วันที่แจ้ง <span className="text-red-500 text-xs">* จำเป็น</span></p>
                    <input type="date" className="input input-bordered w-full max-w-xl" name="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                </div>
                <div>
                    <p className="text-sm mb-1">วันที่นัดซ่อม <span className="text-red-500 text-xs">* จำเป็น</span></p>
                    <input type="date" className="input input-bordered w-full max-w-xl" name="meetDate" value={meetDate} onChange={(e) => setMeetDate(e.target.value)}/>
                </div>
            </div>
            <div className="mb-3">
                <p className="text-sm mb-1">รายละเอียด</p>
                <textarea className="textarea textarea-lg textarea-bordered w-full" placeholder="รายละเอียด" value={detail} onChange={(e) => setDetail(e.target.value)}></textarea>
            </div>
            <div className="flex items-center justify-end gap-x-2 ">
                <button className="btn btn-sm" onClick={() => setIsCreate(!isCreate)}>ยกเลิก</button>
                <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={handleSubmit}>บันทึก</button>
            </div>
        </div>
      )}
      
    </div>
  );
};

export default Repair;
