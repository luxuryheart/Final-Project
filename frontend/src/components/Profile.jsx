import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { AvatarGenerator } from "random-avatar-generator";
import Address from "../utils/data/address/raw_database.json";

const Profile = ({ setOpenProfile, userDetail }) => {
  const [user, setUser] = useState();
  const generator = new AvatarGenerator();
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcode, setZipcode] = useState([]);

  const getAddress = () => {
    const uniqueProvinces = [...new Set(Address.map((item) => item.province))];
    setProvinces(uniqueProvinces);
    const uniqueAmphures = [...new Set(Address.map((item) => item.amphoe))];
    setAmphures(uniqueAmphures);
    const uniqueDistricts = [...new Set(Address.map((item) => item.district))];
    setTambons(uniqueDistricts);
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      setUser({ ...user, address: { ...user.address, province: value } });
      const uniqueAmphures = [
        ...new Set(
          Address.filter((item) => item.province === value).map(
            (item) => item.amphoe
          )
        ),
      ];
      setAmphures(uniqueAmphures);
    } else if (name === "amphure") {
      setUser({ ...user, address: { ...user.address, district: value } });
      const uniqueSubDistricts = [
        ...new Set(
          Address.filter((item) => item.amphoe === value).map(
            (item) => item.district
          )
        ),
      ];
      setTambons(uniqueSubDistricts);
    } else if (name === "tambon") {
      setUser({ ...user, address: { ...user.address, sub_district: value } });
      const zipcode = [
        ...new Set(
          Address.filter((item) => item.district === value).map(
            (item) => item.zipcode
          )
        ),
      ];
      setZipcode(zipcode);
    } else if (name === "zipcode") {
      setUser({ ...user, address: { ...user.address, zipcode: value } });
    }
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`/api/v1/user`, {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async () => {
    try {
      const res = await axios.put(`/api/v1/user`, {
        firstname: user.profile?.firstname,
        lastname: user.profile?.lastname,
        img: user.profile?.img,
        tel: user.tel,
        address: user.address
      }, {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        getUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getAddress();
  }, []);
  return (
    <div className="bg-colorBlueDark/30 z-20 top-0 w-screen h-screen absolute">
      <div className="flex items-center justify-center h-full container mx-auto lg:px-48 xl:px-80">
        <div className="bg-bgForm  rounded-lg shadow-md px-5 py-5 w-full">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">แก้ไขข้อมูล</div>
            <button onClick={() => setOpenProfile(false)}>
              <RxCross2 className="h-7 w-7 cursor-pointer" />
            </button>
          </div>
          <div className="divider"></div>
          <div className="flex items-center justify-center">
            <img
              src={user?.profile?.img}
              alt={user?.profile?.img}
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="flex items-center justify-center mt-2 mb-5">
            <button
              className="btn btn-sm btn-warning "
              onClick={() =>
                setUser({
                  ...user,
                  profile: {
                    ...user.profile,
                    img: generator.generateRandomAvatar(),
                  },
                })
              }
            >
              เปลี่ยนโปรไฟล์
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-sm mb-1">ชื่อ</p>
              <input
                type="text"
                placeholder="ชื่อ"
                className="input input-sm input-bordered w-full max-w-xs"
                name="firstname"
                value={user?.profile?.firstname}
                onChange={(e) => setUser({ ...user, profile: { ...user.profile, firstname: e.target.value } })}
              />
            </div>
            <div>
              <p className="text-sm mb-1">นามสกุล</p>
              <input
                type="text"
                placeholder="นามสกุล"
                className="input input-sm input-bordered w-full max-w-xs"
                name="lastname"
                value={user?.profile?.lastname}
                onChange={(e) => setUser({ ...user, profile: { ...user.profile, lastname: e.target.value } })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-sm mb-1">email</p>
              <input
                type="text"
                placeholder="email"
                className="input input-sm input-bordered w-full max-w-xs"
                name="email"
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div>
              <p className="text-sm mb-1">เบอร์โทรศัพท์</p>
              <input
                type="text"
                placeholder="เบอร์โทรศัพท์"
                className="input input-sm input-bordered w-full max-w-xs"
                name="tel"
                value={user?.tel}
                onChange={(e) => setUser({ ...user, tel: e.target.value })} 
              />
            </div>
          </div>
          <div className="grid grid-cols-[64%35%] gap-x-2">
            <div>
              <p className="mb-1 text-sm">ที่อยู่</p>
              <input
                type="text"
                placeholder="111/2 หมู่ x"
                className="input input-sm input-bordered w-full "
                name="address"
                value={user?.address?.address}
                onChange={(e) => setUser({ ...user, address: { ...user.address, address: e.target.value } })}
                required
              />
            </div>
            <div className="mb-2">
              <p className="mb-1 text-sm">จังหวัด</p>
              <select
                className="select select-sm select-bordered w-full max-w-xs "
                name="province"
                onChange={handleSelect}
                required
              >
                <option disabled selected>
                  {user?.address?.province}
                </option>
                {provinces.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-2 mb-2">
            <div>
              <p className=" mb-1 text-sm">อำเภอ</p>
              <select
                className="select select-sm  select-bordered w-full max-w-xs "
                name="amphure"
                onChange={handleSelect}
                required
              >
                <option disabled selected>
                  {user?.address?.district}
                </option>
                {amphures.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className=" mb-1 text-sm">ตำบล</p>
              <select
                className="select select-sm  select-bordered w-full max-w-xs "
                name="tambon"
                onChange={handleSelect}
                required
              >
                <option disabled selected>
                  {user?.address?.sub_district}
                </option>
                {tambons.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className=" mb-1 text-sm">รหัสไปรษณีย์</p>
              <select
                className="select select-sm  select-bordered w-full max-w-xs "
                name="zipcode"
                onChange={handleSelect}
                required
              >
                <option disabled selected>
                  {user?.address?.zipcode}
                </option>
                {zipcode.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="divider"></div>
          <div className="flex items-center justify-end gap-x-2">
            <button className="btn btn-sm" onClick={getUser}>ยกเลิก</button>
            <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={updateUser}>บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
