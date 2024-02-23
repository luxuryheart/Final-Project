import axios from "axios";
import React, { useEffect, useState } from "react";

const RenterDetail = ({ roomId }) => {
  const [renterDetail, setRenterDetail] = useState({
    email: "",
    facebook: "",
    lineId: "",
    educationOrOffice: "",
    department: "",
    position: "",
    studentOrEmployeeId: "",
    urgentTel: "",
    relationships: "",
    tel: "",
    note: "",
  });

  const [vehicle, setVehicle] = useState([
    {
      type: "",
      carId: "",
      detail: "",
    },
  ]);

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [renter, setRenter] = useState({});
  const token = localStorage.getItem("token");

  const addVehicle = () => {
    setVehicle([
      ...vehicle,
      {
        type: "",
        carId: "",
        detail: "",
      },
    ]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRenterDetail((prevRenterDetail) => ({
      ...prevRenterDetail,
      [name]: value,
    }))
  }

  const handleVehicleChange = (e, index) => {
    const { name, value } = e.target;
    setVehicle(prevVehicle => prevVehicle.map((item, i) => i === index ? { ...item, [name]: value } : item));
  }

  const removeVehicle = (indexToRemove) => {
    setVehicle(prevVehicle=> prevVehicle.filter((_, index) => index !== indexToRemove));
  }

  const getVehicle = async () => {
    try {
      const res = await axios.get("/api/v1/backoffice/vehicle", {
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setVehicleTypes(res.data.vehicles);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async(e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/api/v1/backoffice/user-detail", {
        email: renterDetail.email,
        facebook: renterDetail.facebook,
        lineId: renterDetail.lineId,
        educationOrOffice: renterDetail.educationOrOffice,
        department: renterDetail.department,
        position: renterDetail.position,
        studentOrEmployeeId: renterDetail.studentOrEmployeeId,
        urgentTel: renterDetail.urgentTel,
        relationships: renterDetail.relationships,
        tel: renterDetail.tel,
        note: renterDetail.note,
        vehicle: vehicle,
        roomId: roomId,
      }, {
        headers: {
          authtoken: localStorage.getItem("token")
        }
      })
      if (res.data.success) {
        setTimeout(() => getRenterDetail(), 500)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getRenterDetail = async () => {
    try {
      const res = await axios.get(`/api/v1/backoffice/renter-detail/${roomId}`, {
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setRenter(res.data.renter);
        setRenterDetail({
          email: res.data.renter.email,
          facebook: res.data.renter.facebook,
          lineId: res.data.renter.line_id,
          educationOrOffice: res.data.renter.educational_or_office          ,
          department: res.data.renter.department,
          position: res.data.renter.position,
          studentOrEmployeeId: res.data.renter.studentId_or_employeeId,
          urgentTel: res.data.renter.urgent_tel,
          relationships: res.data.renter.relationships,
          tel: res.data.renter.tel,
        });
        setVehicle(res.data.renter.vehicle);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getVehicle()
    getRenterDetail()
  }, [])
  return (
    <div className="">
      <div className="mb-1 px-5">
        ข้อมูลเพิ่มเติม{" "}
        <span className="text-red-500 text-xs">*ไม่จำเป็นต้องกรอกทุกช่อง</span>
      </div>
      <div className="overflow-y-auto max-h-[50vh] px-5">
        <div className="flex items-center justify-around gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>Email</p>
            <input
              type="text"
              placeholder="กรอก Email"
              className="input input-bordered w-full max-w-lg"
              name="email"
              value={renterDetail.email}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm w-full">
            <p>Facebook</p>
            <input
              type="text"
              placeholder="กรอกชื่อ Facebook"
              className="input input-bordered w-full max-w-lg"
              name="facebook"
              value={renterDetail.facebook}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm w-full">
            <p>Line ID</p>
            <input
              type="text"
              placeholder="กรอก Line ID"
              className="input input-bordered w-full max-w-lg"
              name="lineId"
              value={renterDetail.lineId}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-around gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>สถานบันการศึกษา / สถานที่ทำงานปัจจุบัน</p>
            <input
              type="text"
              placeholder="กรอกชื่อสถานบันการศึกษา / สถานที่ทำงานปัจจุบัน"
              className="input input-bordered w-full max-w-lg"
              name="educationOrOffice"
              value={renterDetail.educationOrOffice}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm w-full">
            <p>คณะ / แผนก</p>
            <input
              type="text"
              placeholder="กรอกคณะ / แผนก"
              className="input input-bordered w-full max-w-lg"
              name="department"
              value={renterDetail.department}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-[40%_35%_25%] gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>ชั้นปี / ตำแหน่ง</p>
            <input
              type="text"
              placeholder="กรอกชั้นปี / ตำแหน่ง"
              className="input input-bordered w-full max-w-lg"
              name="position"
              value={renterDetail.position}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm w-full">
            <p>รหัสนักศึกษา</p>
            <input
              type="text"
              placeholder="กรอกรหัสนักศึกษา"
              className="input input-bordered w-full max-w-lg"
              name="studentOrEmployeeId"
              value={renterDetail.studentOrEmployeeId}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-[45%_25%_25%] gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>บุคคลที่สามารถติดต่อได้ในกรณีฉุกเฉิน</p>
            <input
              type="text"
              placeholder="ชื่อ - นามสกุล"
              className="input input-bordered w-full max-w-lg"
              name="urgentTel"
              value={renterDetail.urgentTel}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm w-full">
            <p>ความสัมพันธ์</p>
            <input
              type="text"
              placeholder="เช่น บิดา"
              className="input input-bordered w-full max-w-lg"
              name="relationships"
              value={renterDetail.relationships}
              onChange={handleChange}
            />
          </div>
          <div className="text-sm w-full">
            <p>เบอร์โทรศัพท์</p>
            <input
              type="text"
              placeholder="08x-xxx-xxxx"
              className="input input-bordered w-full max-w-lg"
              name="tel"
              value={renterDetail.tel}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="text-sm">
            <div className="flex gap-x-2 items-center mb-1">
              <p>ยานพาหนะที่นำมาใช้</p>
              <button className="duration-300 bg-colorBlueDark rounded-md text-bgColor hover:bg-slate-400 px-3 py-1 text-xs"
              onClick={() => addVehicle()}>
                เพิ่ม
              </button>
            </div>
            <div className="flex flex-col">
              {vehicle.map((item, index) => (
                <div className="flex items-center gap-x-2 mb-1" key={index}>
                  <div className="text-base w-1/4 grid grid-cols-[50%_80%] items-center gap-x-3">
                    <div className="text-sm font-semibold">คันที่ {index + 1}</div>
                    <select
                      name="type"
                      id="vehicle"
                      className="text-xs px-2 py-1 border rounded-md bg-slate-100 duration-300"
                      value={item.name}
                      onChange={(e) => handleVehicleChange(e, index)}
                    >
                      <option disabled selected>เลือกยานพาหนะ</option>
                      {vehicleTypes.map((item) => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-2/4 ml-20">
                    <input
                      type="text"
                      placeholder="ทะเบียนรถ"
                      className="input input-bordered w-full max-w-xs input-sm"
                      name="carId"
                      value={item.carId}
                      onChange={(e) => handleVehicleChange(e, index)}
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="รายละเอียด"
                      className="input input-bordered w-full max-w-xs input-sm"
                      name="detail"
                      value={item.detail}
                      onChange={(e) => handleVehicleChange(e, index)}
                    />
                  </div>
                  <div className=''>
                    <button className=' bg-red-600 text-bgColor text-xs rounded-md px-3 py-1 hover:bg-slate-400 hover:scale-105 duration-300' onClick={() => removeVehicle(index)}>ลบ</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm">หมายเหตุ</p>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder=""
            name="note"
            value={renterDetail.note}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="border-b-2 border-colorBlueDark/40 mt-8"></div>
      <div className="text-center mt-3">
        <button className="duration-300 bg-colorBlueDark rounded-md text-bgColor hover:bg-slate-400 px-4 py-2 text-sm"
        onClick={handleUpdate}>
          แก้ไข
        </button>
      </div>
    </div>
  );
};

export default RenterDetail;
