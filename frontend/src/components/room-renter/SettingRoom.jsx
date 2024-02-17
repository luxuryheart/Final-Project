import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const SettingRoom = ({ roomId }) => {
  const [room, setRoom] = useState({})
  const token = localStorage.getItem("token");
  const { id } = useParams()
  const [showAlert, setShowAlert] = useState(false);
  const [waterName, setWaterName] = useState('');
  const [electricalName, setElectricalName] = useState('');

  const getRoomByID = async () => {
    try {
      const res = await axios.get(`/api/v1/backoffice/room/${roomId}`, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setRoom(res.data.room)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setRoom(prev => ({ ...prev, [name]: value }))
  }

  const UpdatePriceRoom = async () => {
    try {
      const res = await axios.put(`/api/v1/backoffice/room`, {
        roomCharge: room.roomCharge,
        roomId: roomId
      }, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setShowAlert(true)
        getRoomByID()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const UpdateWaterMeter = async () => {
    try {
      const res = await axios.put(`/api/v1/backoffice/water-meter`, {
        meterName: waterName,
        roomId: roomId,
        dormitoryId: id
      }, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setShowAlert(true)
        getRoomByID()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const UpdateElectricalMeter = async () => {
    try {
      const res = await axios.put(`/api/v1/backoffice/electric-meter`, {
        meterName: electricalName,
        roomId: roomId,
        dormitoryId: id
      }, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setShowAlert(true)
        getRoomByID()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const AlertMessage = () => {
    return (
      <div role="alert" className="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>อัพเดตค่าห้องสำเร็จ</span>
      </div>
    )
  }

  useEffect(() => {
    getRoomByID();
  }, [])
  
  return (
    <>
      <div className="container mx-auto px-10 mt-10">
        <div className="text-2xl mb-3">กำหนดค่าห้อง</div>
        <div className="grid grid-cols-[77%20%] items-center gap-x-5 mb-5">
          <label className="input input-bordered flex items-center gap-2">
            ค่าห้อง :
            <input
              type="number"
              pattern="[0-9]{6}"
              className="grow"
              placeholder="0"
              value={room.roomCharge}
              name="roomCharge"
              onChange={handleChange}
            />
          </label>
          <button className="btn bg-colorBlueDark text-bgColor" onClick={UpdatePriceRoom}>อัพเดต</button>
        </div>
        <div className="divider"></div>
        <div className="text-2xl">กำหนดค่าน้ำ/ค่าไฟ</div>
        <div className="mb-5">
          <label className="input input-bordered flex items-center gap-2 mb-2">
            ค่าน้ำ :{room.waterID?.name === "คิดตามหน่วยจริง" ? <div>คิดตามหน่วยจริงหน่วยละ {room.waterID?.price} บาท</div> : <div>เหมาจ่ายรายเดือน {room.waterID?.price} บาท/เดือน</div>}
            <div className="text-end lg:ml-[250px] xl:ml-[410px]">
              <select className="select select-bordered select-success w-full max-w-xs grow select-sm" name='waterName' onChange={(e) => setWaterName(e.target.value)}>
                <option disabled selected>
                  เลือกประเภทน้ำ
                </option>
                <option>เหมาจ่ายรายเดือน</option>
                <option>คิดตามหน่วยจริง</option>
              </select>
            </div>
          </label>
          <div className="text-end">
            <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={UpdateWaterMeter}>
              อัพเดต
            </button>
          </div>
        </div>
        <div className="mb-5">
          <label className="input input-bordered flex items-center gap-2 mb-2">
            ค่าไฟ :{room.electricID?.name === "คิดตามหน่วยจริง" ? <div>คิดตามหน่วยจริงหน่วยละ {room.electricID?.price} บาท</div> : <div>เหมาจ่ายรายเดือน {room.electricID?.price} บาท/เดือน</div>}
            <div className="text-end lg:ml-[250px] xl:ml-[410px]">
              <select className="select select-bordered select-success w-full max-w-xs grow select-sm" name='electricalName' onChange={(e) => setElectricalName(e.target.value)}>
                <option disabled selected>
                  เลือกประเภทไฟฟ้า
                </option>
                <option>เหมาจ่ายรายเดือน</option>
                <option>คิดตามหน่วยจริง</option>
              </select>
            </div>
          </label>
          <div className="text-end">
            <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={UpdateElectricalMeter}>
              อัพเดต
            </button>
          </div>
        </div>
        <div className='divider'></div>
      </div>
    </>
  );
}

export default SettingRoom