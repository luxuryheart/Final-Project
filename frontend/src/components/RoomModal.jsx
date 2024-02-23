import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { GetRenterDetailByID } from "../services/backoffice/dormitorybo";
import RenterDetail from "./room-renter/RenterDetail";
import BookingRoom from "./room-renter/BookingRoom";
import ContactCreate from "./room-renter/ContactCreate";
import ContactPayment from "./room-renter/ContactPayment";
import Contact from "./room-renter/Contact";
import SettingRoom from "./room-renter/SettingRoom";
import ContactDetail from "./room-renter/ContactDetail";

const RoomModal = ({
  setRoomModal,
  roomId,
  floorId,
  roomName,
}) => {
  const { id } = useParams();
  const [renter, setRenter] = useState({});
  const [tabMenu, setTabMenu] = useState(0);

  const getRenterDetail = async () => {
    try {
      const res = await GetRenterDetailByID(roomId);
      if (res === undefined) {
        setRenter(null);
        setTabMenu(1);
      } else if (res) {
        setRenter(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRenterDetail();
  }, []);

  return (
    <div className="bg-colorBlueDark/30 z-20 w-screen h-screen absolute">
      <div className="flex items-center justify-center h-full relative">
        <div className="lg:h-[75vh] xl:h-[80vh] lg:w-[100vh] xl:w-[120vh]">
          <div className="bg-bgForm text-colorBlueDark shadow-md h-full w-full z-50">
            <div
              id="header"
              className="bg-colorBlueDark text-bgColor text-xl h-10 w-full flex items-center justify-between px-5"
            >
              <div>ห้อง {roomName}</div>
              <FaXmark
                className="h-7 w-7 cursor-pointer duration-300 hover:scale-105 hover:text-slate-200"
                onClick={() => setRoomModal(false)}
              />
            </div>
            <div
              id="tab"
              className="flex gap-x-3 items-center px-5 text-colorBlueGray mb-2"
            >
              <button
                className={`duration-300 ${
                  renter === null
                    ? "cursor-not-allowed "
                    : "cursor-pointer hover:bg-slate-300 hover:px-2"
                } rounded-b-lg py-1 ${
                  tabMenu === 0
                    ? " bg-colorBlueDark text-bgColor px-2 py-1 hover:bg-colorBlueDark "
                    : " "
                }`}
                onClick={() => setTabMenu(0)}
                disabled={renter === null}
              >
                ผู้เช่า
              </button>
              <button
                className={`duration-300 rounded-b-lg py-1 ${
                  tabMenu === 1
                    ? " bg-colorBlueDark text-bgColor px-2 py-1 hover:bg-colorBlueDark "
                    : " "
                } ${
                  renter !== null
                    ? "cursor-not-allowed "
                    : "cursor-pointer hover:bg-slate-300 hover:px-2"
                }`}
                onClick={() => setTabMenu(1)}
                disabled={renter !== null}
              >
                จองห้อง
              </button>
              <button
                className={`duration-300 rounded-b-lg py-1 ${
                  tabMenu === 2
                    ? " bg-colorBlueDark text-bgColor px-2 py-1 hover:bg-colorBlueDark "
                    : " "
                } ${
                  renter !== null
                    ? "cursor-not-allowed "
                    : "cursor-pointer hover:bg-slate-300 hover:px-2"
                }`}
                onClick={() => setTabMenu(2)}
                disabled={renter !== null}
              >
                สัญญาเช่า
              </button>
              <button
                className={`duration-300 rounded-b-lg py-1 ${
                  tabMenu === 4
                    ? " bg-colorBlueDark text-bgColor px-2 py-1 hover:bg-colorBlueDark cursor-pointer "
                    : " "
                }`}
                onClick={() => setTabMenu(4)}
              >
                สัญญา
              </button>
              <button
                className={`duration-300 rounded-b-lg py-1 ${
                  tabMenu === 3
                    ? " bg-colorBlueDark text-bgColor px-2 py-1 hover:bg-colorBlueDark cursor-pointer "
                    : " "
                }`}
                onClick={() => setTabMenu(3)}
              >
                ตั้งค่าห้องพัก
              </button>
            </div>
            <div className="">
              {tabMenu === 0 ? (
                <RenterDetail roomId={roomId} getRenterDetail={getRenterDetail}/>
              ) : tabMenu === 1 ? (
                <BookingRoom roomId={roomId} setRoomModal={setRoomModal}/>
              ) : tabMenu === 2 ? (
                <Contact floorId={floorId} roomId={roomId} getRenterDetail={getRenterDetail} setRoomModal={setRoomModal}/>
              )  : tabMenu === 3 ? (
                <SettingRoom floorId={floorId} roomId={roomId}/> 
              ) : tabMenu === 4 ? (
                <ContactDetail roomId={roomId} setRoomModal={setRoomModal}/>
              ): null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
