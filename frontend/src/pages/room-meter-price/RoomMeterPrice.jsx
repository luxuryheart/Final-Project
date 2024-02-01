import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTitle } from "../../store/titleSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoIosWater } from "react-icons/io";
import { MdOutlineElectricBolt } from "react-icons/md";
import ModalMeter from '../../components/ModalMeter';

const RoomMeterPrice = () => {
    const dispatch = useDispatch();
    const text = "กำหนดค่าห้อง";
    const [rooms, setRooms] = useState({});
    const idMock = "656a19e62bcd35aee1e16ded";
    const [selectRooms, setSelectRooms] = useState({
      floorId: "",
      rooms: [],
    });
  
    const [openMadal, setOpenModal] = useState(false);
    const handleSelect = (e, floorId, roomId) => {
      const checkRoom = e.nativeEvent.target.checked;
      if (checkRoom) {
        if (selectRooms.floorId !== floorId) {
          setSelectRooms({
            floorId: floorId,
            rooms: [roomId],
          });
        } else {
          setSelectRooms((prevSelectRooms) => ({
            floorId: floorId,
            rooms: [...prevSelectRooms.rooms, roomId],
          }));
        }
      } else if (selectRooms.rooms.length === 1) {
        setSelectRooms({
          floorId: "",
          rooms: [],
        });
      } else {
        setSelectRooms((prevSelectRooms) => ({
          floorId: floorId,
          rooms: prevSelectRooms.rooms.filter((room) => room !== roomId),
        }));
      }
    };
  
    const handleSelectAll = (e, floor) => {
      setSelectRooms((prevSelectRooms) => ({
        floorId: floor._id,
        rooms: floor.rooms.map((room) => room._id),
      }));
    };
  
    const handleSelectNone = (e, floor) => {
      if (floor._id === selectRooms.floorId) {
        setSelectRooms({
          floorId: "",
          rooms: [],
        });
      }
    };
  const getRooms = async () => {
    try {
      const res = await axios.get(`/api/v1/get-all-rooms/${idMock}`);
      if (res.data.success) {
        setRooms(res.data.dormitoryDetail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getTitle(text));
    getRooms();
  }, [text]);

  return (
    <div className={`relative`}>
      {openMadal && <ModalMeter selectRooms={selectRooms} setSelectRooms={setSelectRooms} setOpenModal={setOpenModal} getRooms={getRooms}/>}
      <div id="contained" className="container mx-auto relative z-0">
        <div className="flex justify-center pb-5">
          <div className="bg-bgForm py-10 px-4 mt-5 w-8/12 lg:w-6/12 xl:w-7/12 drop-shadow-lg rounded-md">
            <div className="flex flex-col">
              <div className="overflow-y-scroll overscroll-auto h-[68vh] max-h-[80vh] mb-5">
                {rooms &&
                  rooms.floors &&
                  rooms.floors.map((floor, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-2xl mb-5 mx-6">
                        <div>ชั้นที่ {floor.name}</div>
                        <div className="text-xs text-bgColor">
                          <button
                            className="bg-bgRed py-1 px-2 rounded-md mr-2 duration-300 hover:scale-105 hover:opacity-50"
                            onClick={(e) => handleSelectNone(e, floor)}
                          >
                            ไม่เลือก
                          </button>
                          <button
                            className="bg-colorBlueDark py-1 px-2 rounded-md mr-2 duration-300 hover:scale-105 hover:opacity-50"
                            onClick={(e) => handleSelectAll(e, floor)}
                          >
                            เลือกทั้งชั้น
                          </button>
                        </div>
                      </div>
                      <div
                        className={`overflow-y-scroll overscroll-auto ${
                          floor.rooms.length <= 4 ? "h-[22vh]" : "xl:h-[41vh]"
                        } mb-5`}
                      >
                        <div className="overflow-x-auto">
                          <div className="form-control grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3">
                            {floor.rooms.map((room, j) => (
                              <label
                                key={j}
                                className="relative cursor-pointer"
                              >
                                <input
                                  checked={selectRooms.rooms.includes(room._id)}
                                  type="checkbox"
                                  className="sr-only peer"
                                  onChange={(e) =>
                                    handleSelect(e, floor._id, room._id)
                                  }
                                />
                                <span className="absolute top-3 xl:right-2 lg:right-[-5px] lg:top-2 z-10 opacity-0 transition-all peer-checked:opacity-100">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="fill-blue-500 stroke-white"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#2c3e50"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M9 12l2 2l4 -4" />
                                  </svg>
                                </span>
                                <p className="text-base text-center mb-1">
                                  {room.name}
                                </p>
                                <div className="mx-auto mb-4 flex flex-col items-center xl:w-32 xl:h-32 lg:w-[100px] lg:h-[100px] sm:h-24 sm:w-24 text-center text-xs rounded-lg bg-room shadow-md ring ring-transparent transition-all active:scale-95 peer-checked:ring-blue-500 peer-checked:grayscale-0">
                                    <div className={`w-full h-[50%] flex items-center justify-center ${room.waterID !== null ? "bg-sky-300" : " "} rounded-t-lg`}>
                                        {room.waterID === null ? <p><IoIosWater className="inline-block"/> ยังไม่ได้กำหนดค่าน้ำ</p> : <p><IoIosWater className="inline-block"/>{room.waterID.name === "เหมาจ่ายรายเดือน" ? room.waterID.name + " " + room.waterID.price + " บาท/เดือน" : room.waterID.name + "หน่วยละ " + room.waterID.price + " บาท"}</p>}
                                    </div>
                                    <div className={`w-full h-[50%] flex items-center justify-center ${room.electricID !== null ? "bg-red-300" : " "} rounded-b-lg`}>
                                    {room.electricID === null ? <p><MdOutlineElectricBolt className="inline-block"/> ยังไม่ได้กำหนดค่าไฟ</p> : <p><MdOutlineElectricBolt className="inline-block"/>{room.electricID.name === "เหมาจ่ายรายเดือน" ? room.electricID.name + " " + room.electricID.price + " บาท/เดือน" : room.electricID.name + "หน่วยละ " + room.electricID.price + " บาท"}</p>}
                                    </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div id="button">
                <Link
                  to={"/dormitory/home"}
                  className="w-full flex justify-center"
                >
                  <button className="py-2 rounded-md  hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95 w-1/2 bg-colorBlueDark text-bgColor font-extralight text-base font-serif text-center">
                    เสร็จสิ้น
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          id="button-open-modal"
          className="absolute z-0 top-[43vh] xl:right-[50px] lg:right-[75px] md:right-[8px] sm:right-[5px]"
        >
          <button
            className={`${selectRooms.rooms.length === 0 ? "btn-disabled bg-slate-400": " "} xl:py-2 xl:px-5 rounded-md sm:py-1 sm:px-3 hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95  bg-colorBlueDark text-bgColor font-extralight text-base font-serif text-center shadow-md`}
            onClick={() => setOpenModal(true)}
          >
            เพิ่มค่าห้อง
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomMeterPrice;
