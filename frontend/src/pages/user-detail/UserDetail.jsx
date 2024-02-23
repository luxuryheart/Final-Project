import React, { useEffect, useState } from "react";
import { Gender } from "../../utils/user-detail/data";
import { Role } from "../../utils/user-detail/data";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AvatarGenerator } from 'random-avatar-generator';
import Address from '../../utils/data/address/raw_database.json'

const UserDetail = () => {
  document.title = "JongHor | User-detail";
  const navigate = useNavigate();
  const generator = new AvatarGenerator();
  const [detail, setDetail] = useState({
    firstname: "",
    lastname: "",
    img: generator.generateRandomAvatar(),
  });
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [tel, setTel] = useState("");
  const [personalId, setPersonalId] = useState("")
  const [address, setAddress] = useState({
    address: "",
    province: "",
    district: "",
    sub_district: "",
    zipcode: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcode, setZipcode] = useState([]);

  const getAddress = () => {
    const uniqueProvinces = [...new Set(Address.map(item => item.province))];
    setProvinces(uniqueProvinces);
    const uniqueAmphures = [...new Set(Address.map(item => item.amphoe))];
    setAmphures(uniqueAmphures);
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

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleRole = (e) => {
    const { value } = e.target;
    let updatedValue = value;
    if (value === "เจ้าของหอ") {
      updatedValue = "admin";
    } else if (value === "พนักงาน") {
      updatedValue = "employee";
    } else {
      updatedValue = "user";
    }
    setRole(updatedValue);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      axios
        .put("/api/v1/user-update", {
          firstname: detail.firstname,
          lastname: detail.lastname,
          img: detail.img,
          gender: gender,
          role: role,
          tel: tel,
          personalId: personalId,
          address: address
        }, {
          headers: {
            authtoken: `${token}`,
          },
        })
        .then(async(res) => {
          const role = res.data.formattedUserDetail.user.role;
          localStorage.removeItem("token");
          localStorage.setItem("token", res.data.token);
          if (role === "admin") {
            navigate("/dormitory");
          } else if (role === "employee" || role === "user") {
            navigate("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className="container mx-auto h-screen w-screen">
      <div className="xl:px-[460px] lg:px-[300px] md:px-[200px] sm:px-[150px] pt-10">
        <div className="flex flex-col items-center justify-center gap-y-1 text-colorBlueDark">
          {/* Header */}
          <div
            id="header"
            className="text-colorDark flex flex-col gap-y-[2px] items-center justify-center w-full"
          >
            <p className="text-3xl font-serif	antialiased">ข้อมูลผู้ใช้</p>
            <div className="border-b-[1.75px] border-colorDark w-full"></div>
          </div>
          
          <div className="mt-1">
            <img
              src={detail.img}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
          </div>

          <button className="btn btn-sm btn-primary" onClick={() => setDetail({...detail, img:generator.generateRandomAvatar()})}>สุ่ม</button>

          {/* Form */}
          <form id="form" className="mt-3 w-full" onSubmit={handleSubmit}>
            <div id="firstname" className="mb-2">
              <p className="text-[#797F8B] mb-1 text-sm">ชื่อ</p>
              <input
                type="text"
                placeholder="Jhone"
                className="input input-sm input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="firstname"
                value={detail.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div id="lastname" className="mb-2">
              <p className="text-[#797F8B] mb-1 text-sm">นามสกุล</p>
              <input
                type="text"
                placeholder="Doe"
                className="input input-sm input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="lastname"
                value={detail.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-x-2 items-center">
              <div id="lastname" className="mb-2">
                <p className="text-[#797F8B] mb-1 text-sm">เบอร์โทรศัพท์</p>
                <input
                  type="text"
                  placeholder="0xx-xxxx-xxxx"
                  className="input input-sm input-bordered w-full bg-[#D9D9D9] opacity-50"
                  maxLength={10}
                  name="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  required
                />
              </div>
              <div id="lastname" className="mb-2">
                <p className="text-[#797F8B] mb-1 text-sm">เลขบัตรประจำตัวประชาชน</p>
                <input
                  type="text"
                  placeholder="1-1xxx"
                  className="input input-sm input-bordered w-full bg-[#D9D9D9] opacity-50"
                  maxLength={13}
                  name="presonalId"
                  value={personalId}
                  onChange={(e) => setPersonalId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-[65%35%] gap-x-2">
              <div>
                <p className="text-[#797F8B] mb-1 text-sm">ที่อยู่</p>
                <input
                  type="text"
                  placeholder="111/2 หมู่ x"
                  className="input input-sm input-bordered w-full bg-[#D9D9D9] opacity-50"
                  name="address"
                  value={address.address}
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                  required
                />
              </div>
              <div className="mb-2">
                <p className="text-[#797F8B] mb-1 text-sm">จังหวัด</p>
                <select className="select select-sm bg-[#D9D9D9] opacity-50 select-bordered w-full max-w-xs text-colorBlueDark" name="province" onChange={handleSelect} required>
                  <option disabled selected>เลือกจังหวัด</option>
                  {provinces.map((item, i) => (
                    <option key={i} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-2 mb-2">
              <div>
                <p className="text-[#797F8B] mb-1 text-sm">อำเภอ</p>
                <select className="select select-sm bg-[#D9D9D9] opacity-50 select-bordered w-full max-w-xs text-colorBlueDark" name="amphure" onChange={handleSelect} required>
                  <option disabled selected>เลือกอำเภอ</option>
                  {amphures.map((item, i) => (
                    <option key={i} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-[#797F8B] mb-1 text-sm">ตำบล</p>
                <select className="select select-sm bg-[#D9D9D9] opacity-50 select-bordered w-full max-w-xs text-colorBlueDark" name="tambon" onChange={handleSelect} required>
                  <option disabled selected>เลือกตำบล</option>
                  {tambons.map((item, i) => (
                    <option key={i} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-[#797F8B] mb-1 text-sm">รหัสไปรษณีย์</p>
                <select className="select select-sm bg-[#D9D9D9] opacity-50 select-bordered w-full max-w-xs text-colorBlueDark" name="zipcode" onChange={handleSelect} required>
                  <option disabled selected>เลือกรหัสไปรษณีย</option>
                  { zipcode.map((item, i) => (
                    <option key={i} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-2 text-[#797F8B]">
              <p className="text-sm">เพศ :</p>
              <div className="px-5 mt-2 flex justify-between items-center">
                {Gender.map((item, i) => (
                  <div className="flex items-center gap-x-2" key={i}>
                    <input
                      type="radio"
                      name={`radio-1`}
                      className="radio radio-sm"
                      required
                      value={item}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-10 text-[#797F8B]">
              <p className="text-sm">ตำแหน่ง :</p>
              <div className="px-5 mt-2 flex gap-x-[46px] items-center">
                {Role.map((item, i) => (
                  <div className="flex items-center gap-x-2" key={i}>
                    <input
                      type="radio"
                      name={`radio-2`}
                      className="radio radio-sm"
                      required
                      value={item}
                      onChange={handleRole}
                    />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn w-full bg-colorBlueDark text-bgColor font-extralight text-lg font-serif"
              type="submit"
            >
              เสร็จสิ้น
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
