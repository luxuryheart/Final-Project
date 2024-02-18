import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import DormitoryMeter from './DormitoryMeter';
import Address from '../../utils/data/address/raw_database.json'


const DormitorySetting = () => {
  const [dormitory, setDormitory] = useState({});
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //address
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcode, setZipcode] = useState([]);

  const [address, setAddress] = useState({
    address: "",
    province: "",
    district: "",
    sub_district: "",
    zipcode: "",
  });

  const getAddress = () => {
    //province
    const uniqueProvinces = [...new Set(Address.map(item => item.province))];
    setProvinces(uniqueProvinces);
  
    //amphoe
    const uniqueAmphures = [...new Set(Address.map(item => item.amphoe))];
    setAmphures(uniqueAmphures);
  
    //district
    const uniqueDistricts = [...new Set(Address.map(item => item.district))];
    setTambons(uniqueDistricts);
  }

  const handleSelect = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      setAddress({ ...address, province: value });
      const uniqueAmphures = [...new Set(Address
        .filter(item => item.province === value)
        .map(item => item.amphoe))];
      setAmphures(uniqueAmphures); 
      setDormitory({
        ...dormitory,
        address: {
          ...dormitory.address,
          [name]: value,
        },
      });
    } else if (name === "amphure") {
      setAddress({ ...address, district: value})
      const uniqueSubDistricts = [...new Set(Address
        .filter(item => item.amphoe === value)
        .map(item => item.district))];
        setTambons(uniqueSubDistricts);
        setDormitory({
          ...dormitory,
          address: {
            ...dormitory.address,
            district: value,
          },
        });
    } else if (name === "tambon") {
      setAddress({ ...address, sub_district: value})
      const zipcode = [...new Set(Address.
        filter(item => item.district === value)
        .map(item => item.zipcode))];
        setZipcode(zipcode);
        setDormitory({
          ...dormitory,
          address: {
            ...dormitory.address,
            sub_district: value,
          },
        });
    } else if (name === "zipcode") {
      setAddress({ ...address, zipcode: value})
      setDormitory({
        ...dormitory,
        address: {
          ...dormitory.address,
          zipcode: value,
        },
      });
    }
  }


  const getDormitoryByID = async () => {
    try {
      const res = await axios.get(`/api/v1/backoffice/dormitory/${id}`);
      if (res.data.success) {
        setDormitory(res.data.dormitory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "address") {
      setDormitory({
        ...dormitory,
        address: {
          ...dormitory.address,
          [name]: value,
        },
      });
    } else if (name === "email") { // แก้ไขตรงนี้เพิ่มเงื่อนไข name === "tel"
      setDormitory({
        ...dormitory,
        contact: {
          ...dormitory.contact,
          [name]: value,
        },
      });
    } else if (name === "tel") {
      setDormitory({
        ...dormitory,
        contact: {
          ...dormitory.contact,
          tel: [value],
        },
      });
    } else {
      setDormitory({
        ...dormitory,
        [name]: value,
      });
    }
  };
  
  
  const updateDormitory = async () => {
    try {
      const res = await axios.put(`/api/v1/backoffice/dormitory`, dormitory, {
        headers: {
          authtoken: `${token}`,
        },
      });
      if (res.data.success) {
        getDormitoryByID();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteDormitory = async () => {
    try {
      const res = await axios.delete(`/api/v1/backoffice/dormitory/${id}`, {
        headers: {
          authtoken: `${token}`,
        },
      });
      if (res.data.success) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDormitoryByID();
    getAddress()
  }, []);

  console.log(dormitory);

  return (
    <div className="mx-auto max-h-screen h-screen max-w-[200vh] xl:w-[100vh] w-full">
      <div className="px-5 py-5 text-colorBlueDark">
        <div className="flex justify-between items-center mb-2">
          <div className="text-2xl font-semibold ">แก้ไขข้อมูลหอพัก</div>
          <div>
            <div className="text-red-600 flex items-center gap-x-1 text-sm cursor-pointer" onCli>
              <FaTrashAlt className="h-3 w-3" />
              <div
                className="hover:underline hover:scale-105 duration-300"
                onClick={deleteDormitory}
              >
                ลบหอพัก
              </div>
            </div>
          </div>
        </div>

        <div className="bg-bgForm text-colorDark rounded-lg shadow-md">
          <div className="px-5 py-5">
            <div className="mb-2">
              <p className="text-sm mb-1">ชื่อหอพัก</p>
              <input
                type="text"
                placeholder="ชื่อหอพัก"
                className="input input-sm input-bordered w-full max-w-full"
                value={dormitory.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-5 items-center mb-2">
              <div>
                <p className="text-sm mb-1">ที่อยู่</p>
                <input
                  type="text"
                  placeholder="ที่อยู่"
                  className="input input-sm input-bordered w-full max-w-full"
                  value={dormitory.address?.address}
                  name="address"
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-sm mb-1">จังหวัด</p>
                <select className="select select-sm select-bordered w-full max-w-ful"
                name="province"
                onChange={handleSelect}>
                  <option disabled selected>
                    {dormitory.address?.province}
                  </option>
                  {provinces.map((province, index) => (
                    <option name={province} key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 items-center mb-2">
              <div>
                <p className="text-sm mb-1">อำเภอ</p>
                <select className="select select-sm select-bordered w-full max-w-ful"
                name="amphure"
                onChange={handleSelect}>
                  <option disabled selected>
                    {dormitory.address?.district}
                  </option>
                  {amphures.map((amphure, index) => (
                    <option name={amphure} key={index} value={amphure}>
                      {amphure}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm mb-1">ตำบล</p>
                <select className="select select-sm select-bordered w-full max-w-ful"
                name="tambon"
                onChange={handleSelect}>
                  <option disabled selected>
                    {dormitory.address?.sub_district}
                  </option>
                  {tambons.map((tambon, index) => (
                    <option name={tambon} key={index} value={tambon}>
                      {tambon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm mb-1">เลขไปรษณีย์</p>
                <select className="select select-sm select-bordered w-full max-w-ful"
                name="zipcode"
                onChange={handleSelect}>
                  <option disabled selected>
                    {dormitory.address?.zipcode}
                  </option>
                  {zipcode.map((zipcode, index) => (
                    <option name={zipcode} key={index} value={zipcode}>
                      {zipcode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 items-center mb-2">
              <div>
                <p className="text-sm mb-1">Email</p>
                <input
                  type="text"
                  placeholder="ที่อยู่"
                  className="input input-sm input-bordered w-full max-w-full"
                  value={dormitory.contact?.email}
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-sm mb-1">เบอร์โทร</p>
                <input
                  type="text"
                  placeholder="เบอร์โทร"
                  className="input input-sm input-bordered w-full max-w-full"
                  maxLength={10}
                  value={dormitory.contact?.tel[0]}
                  name="tel"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <div>
                <p className="text-sm mb-1">เบอร์พร้อมเพย์</p>
                <input
                  type="text"
                  placeholder="promptpay"
                  className="input input-sm input-bordered w-full max-w-full"
                  value={dormitory.promptpay !== null || dormitory.promptpay !== undefined ? dormitory.promptpay : dormitory.contact?.tel[0]} 
                  name="promptpay"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="btn bg-red-600 text-bgColor"
                onClick={() => getDormitoryByID()}
              >
                ยกเลิก
              </button>
              <button className="btn bg-colorBlueDark ml-2 text-bgColor"
              onClick={updateDormitory}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
        <div className="divider text-xl text-colorBlueDark font-semibold">
          ค่าน้ำค่าไฟ
        </div>
        {/* Meter */}
        <DormitoryMeter />
      </div>
    </div>
  );
}

export default DormitorySetting