import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getTitle } from '../../store/titleSlice'
import axios from 'axios'
import Address from '../../utils/data/address/raw_database.json'
import { useNavigate } from 'react-router-dom';
import { dormitoryCreate } from '../../store/dormitorySlice'

const DormitoryCreate = () => {
  const dispatch = useDispatch()
  const text = "เพิ่มข้อมูลหอพัก"

  const navigate = useNavigate()

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [floor, setFloor] = useState(0);
  
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
    } else if (name === "amphure") {
      setAddress({ ...address, district: value})
      const uniqueSubDistricts = [...new Set(Address
        .filter(item => item.amphoe === value)
        .map(item => item.district))];
        setTambons(uniqueSubDistricts);
    } else if (name === "tambon") {
      setAddress({ ...address, sub_district: value})
      const zipcode = [...new Set(Address.
        filter(item => item.district === value)
        .map(item => item.zipcode))];
      setZipcode(zipcode);
    } else if (name === "zipcode") {
      setAddress({ ...address, zipcode: value})
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  if (floor < 0) {
    setFloor(0)
  }
  
  const decreaseFloor = (e) => {
    e.preventDefault();
    setFloor(floor - 1);
  }
  const increaseFloor = (e) => {
    e.preventDefault();
    setFloor(floor + 1);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/dormitory', {
        name: name,
        address: {
          address: address.address,
          province: address.province,
          district: address.district,
          sub_district: address.sub_district,
          zipcode: address.zipcode,
        },
        contact: {
          tel: tel,
          email: email,
        },
        amount: floor,
      })
      if (res.data.success) {
        dispatch(dormitoryCreate(res.data.dormitory))
        setTimeout(() => navigate("rooms-management"), 2000)
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    dispatch(getTitle(text))
    getAddress();
  },[text]);

  return (
    <>
      <div id="contained" className="container mx-auto">
        <div className="overflow-hidden flex justify-center py-10">
          <div className="bg-bgForm py-10 px-4 mt-5 w-8/12 lg:w-6/12 xl:w-5/12 drop-shadow-lg rounded-md">
            <div id="form" className="flex flex-col gap-y-5 text-textTitle">
              <div id="name">
                <p className="mb-1">ชื่อหอพัก</p>
                <input
                  type="text"
                  placeholder="หอพักปันใจ"
                  className="input w-full bg-[#D9D9D9] opacity-50 text-colorDark"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-[60%38%] gap-x-4">
                <div id="address">
                  <p className="mb-1">ที่อยู่</p>
                  <input
                    type="text"
                    placeholder="111/1 หมู่ 1 "
                    className="input w-full bg-[#D9D9D9] opacity-50 text-colorDark"
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                  />
                </div>
                <div id="province" className='mb-5'>
                  <p className="mb-1">จังหวัด</p>
                  <select className="select w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark" 
                    name="province"
                    onChange={handleSelect}>
                    <option disabled selected>
                      เลือกจังหวัด
                    </option>
                    {provinces.map((province, index) => (
                      <option name={province} key={index} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div className='col-span-2'>
                  <div className='grid rid grid-cols-3 gap-x-4'>
                      <div id="amphure">
                      <p className="mb-1">อำเภอ</p>
                        <select className="select w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark" 
                          name="amphure"
                          onChange={handleSelect}>
                            <option disabled selected>เลือกอำเภอ</option>
                            {amphures.map((amphure, index) => (
                              <option name={amphure} key={index} value={amphure}>{amphure}</option>
                            ))}
                        </select>
                      </div>
                      <div id="tambon">
                      <p className="mb-1">ตำบล</p>
                        <select className="select w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark" 
                        name="tambon"
                        onChange={handleSelect}>
                            <option disabled selected>เลือกตำบล</option>
                            {tambons.map((tambon, index) => (
                              <option name={tambon} key={index} value={tambon}>{tambon}</option>
                            ))}
                        </select>
                      </div>
                      <div id="zipcode">
                        <p className="mb-1">รหัสไปรษณีย์</p>
                        <select className="select w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark" 
                          name="zipcode"
                          onChange={handleSelect}>
                            <option disabled selected>รหัสไปรษณีย์</option>
                            {zipcode.map((zipcode, index) => (
                              <option name={zipcode} key={index} value={zipcode}>{zipcode}</option>
                            ))}
                        </select>
                      </div>
                  </div>
                </div>
              </div>
              <div id="email">
                <p className="mb-1">Email</p>
                <input name="email" value={email} type="email" placeholder="example@gmail.com" className="input w-full text-colorDark bg-[#D9D9D9] opacity-50" 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div id="tel" className='mb-5'>
                  <p className="mb-1">เบอร์โทรศัพท์</p>
                  <input name="tel" value={tel} type="text" placeholder="08xxxxxxxx" className="input w-full text-colorDark bg-[#D9D9D9] opacity-50" 
                    onChange={(e) => setTel(e.target.value)}
                  />
                </div>
                {/* floor button */}
                <div id="floor" className='mb-5'>
                  <p className="mb-1">จำนวนชั้น <span className='text-red-700 text-xs'>(***จำนวนห้องเริ่มต้นคือ 5***)</span></p>
                  <div className='flex'>
                    <button className='btn rounded-e-none bg-colorBlueDark text-bgColor' onClick={decreaseFloor}>-</button>
                    <input name="tel" value={floor} type="text" placeholder="0" min={0} max={20} className="input w-full text-colorDark bg-[#D9D9D9] opacity-50 rounded-none" 
                        onChange={(e) => {
                          const numericInput = e.target.value.replace(/\D/g, '');
                          setFloor(numericInput);
                        }}
                    />
                    <button className='btn rounded-s-none bg-colorBlueDark text-bgColor' onClick={increaseFloor}>+</button>
                  </div>
                </div>
              </div>
              
              <div className="w-full flex justify-center">
                <button
                className="btn w-1/2  bg-colorBlueDark text-bgColor font-extralight text-lg font-serif text-center"
                type="submit"
                onClick={handleSubmit}
              >
                บันทึก
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DormitoryCreate
