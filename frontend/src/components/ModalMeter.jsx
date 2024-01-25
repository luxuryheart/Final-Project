import axios from "axios";
import React, { useEffect, useState} from "react";
import { FaXmark } from "react-icons/fa6";

const ModalMeter = ({ selectRooms, setSelectRooms, setOpenModal, getRooms}) => {
  const tabData = [
    {flag: "0", name: "ค่าน้ำ"},
    {flag: "1", name: "ค่าไฟ"},
  ];

  const [meters, setMeters] = useState({});
  const idMock = "656a19e62bcd35aee1e16ded";
  const [isTab, setIsTab] = useState("0");

  const [water, setWater] = useState("");
  const [electrical, setElectrical] = useState("");

  const getMeter = async() => {
    try {
      const res = await axios.get(`/api/v1/get-meter-by-dormitory/${idMock}`)
      if (res.data.success) { 
        setMeters(res.data.meters)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async(e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/api/v1/dormitory-rooms-water-electric", {
        roomIds: selectRooms.rooms,
        floorId: selectRooms.floorId,
        dormitoryId: idMock,
        flag: isTab,
        waterId: water,
        electricalId: electrical
      })
      if (res.data.success) {
        setOpenModal(false)
        setSelectRooms({
          floorId: "",
          rooms: [],
        });
        setTimeout(() => getRooms(), 1000)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getMeter()
  }, [])

  return (
    <div className="bg-colorBlueDark/[.5] absolute w-screen z-20 h-screen">
      <div className="flex flex-col mt-[20vh] items-center h-screen shadow-md z-50">
        <div
          id="header"
          className="bg-bgModal lg:w-2/4 xl:w-2/5 z-50 flex items-center justify-between px-5 py-2 text-colorBlueDark"
        >
          <div>แก้ไขค่าน้ำ</div>
          <button
            className="text-bgBlueInput font-bold text-3xl hover:scale-110 hover:text-slate-500 duration-300"
            onClick={() => setOpenModal(false)}
          >
            <FaXmark />
          </button>
        </div>
        <div className="border border-b border-colorBlueDark/20 lg:w-2/4 xl:w-2/5"></div>
        <div id="tab" className="flex flex-row items-center lg:w-2/4 xl:w-2/5 cursor-pointer text-colorBlueDark">
          {tabData.map((tab, i) => (
            <div
              key={i}
              className={`w-full py-4 text-center hover: duration-300 text-xl tab-active ${
                isTab === tab.flag
                  ? tab.flag === "0"
                    ? "bg-sky-300"
                    : "bg-red-300"
                  : "bg-slate-300"
              }`}
              onClick={() => setIsTab(tab.flag)}
            >
              {tab.name}
            </div>
          ))}
        </div>
        <div id="body" className="bg-bgModal lg:w-2/4 xl:w-2/5">
          {isTab === "0" ? 
            meters && meters.waterMeter && meters.waterMeter.map((meter, i) => (
              <div className="flex flex-col items-center justify-center mt-3 mb-5 relative" key={i}>
                <label className="w-full lg:ml-32 xl:ml-36">
                  <input type="radio" name="radio-1" required value={meter._id} className="absolute top-5 right-20 radio bg-white" onChange={() => setWater(meter._id)}/>
                  {meter.name === "คิดตามหน่วยจริง" ? <div className="flex flex-col lg:w-3/4 bg-slate-300 py-5 px-5 rounded-md shadow-md cursor-pointer">{meter.name + " (" + meter.price + " บาท/หน่วย)"}</div>
                  : <div className="flex flex-col lg:w-3/4 bg-slate-300 py-5 px-5 rounded-md shadow-md cursor-pointer mb-5" >{meter.name}</div>}
                </label>
              </div>
            ))
            :
            isTab === "1" ? 
            meters && meters.electricalMeter && meters.electricalMeter.map((meter, i) => (
              <div className="flex flex-col items-center justify-center mt-3 mb-5 relative" key={i}>
                <label className="w-full lg:ml-32 xl:ml-36">
                  <input type="radio" name="radio-2" required value={meter._id} className="absolute top-5 right-20 radio bg-white " onChange={() => setElectrical(meter._id)}/>
                  {meter.name === "คิดตามหน่วยจริง" ? <div className="flex flex-col lg:w-3/4 bg-slate-300 py-5 px-5 rounded-md shadow-md cursor-pointer">{meter.name + " (" + meter.price + " บาท/หน่วย)"}</div>
                  : <div className="flex flex-col lg:w-3/4 bg-slate-300 py-5 px-5 rounded-md shadow-md cursor-pointer mb-5" >{meter.name}</div>}
                </label>
            </div>
            )) : null
          }
        </div>
        <div className="border border-b border-colorBlueDark/20 lg:w-2/4 xl:w-2/5"></div>
        <div id="footer" className="bg-bgModal lg:w-2/4 xl:w-2/5 py-3 px-5 text-end">
          <button
            className="py-2 lg:px-5 rounded-md  hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95  bg-colorBlueDark text-bgColor font-extralight text-base font-serif text-center"
            onClick={handleUpdate}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMeter;
