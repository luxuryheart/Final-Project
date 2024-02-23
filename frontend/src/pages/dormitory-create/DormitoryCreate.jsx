import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTitle } from "../../store/titleSlice";
import axios from "axios";
import Address from "../../utils/data/address/raw_database.json";
import { useNavigate } from "react-router-dom";
import { dormitoryCreate } from "../../store/dormitorySlice";

const DormitoryCreate = () => {
  const dispatch = useDispatch();
  const text = "เพิ่มข้อมูลหอพัก";

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
  const [promptpay, setPromptpay] = useState("");
  const [floor, setFloor] = useState(1);
  const [roomAmount, setRoomAmount] = useState([
    {
      floor: 1,
      room: 5,
    },
  ]);
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
      setAddress({ ...address, province: value });
      const uniqueAmphures = [
        ...new Set(
          Address.filter((item) => item.province === value).map(
            (item) => item.amphoe
          )
        ),
      ];
      setAmphures(uniqueAmphures);
    } else if (name === "amphure") {
      setAddress({ ...address, district: value });
      const uniqueSubDistricts = [
        ...new Set(
          Address.filter((item) => item.amphoe === value).map(
            (item) => item.district
          )
        ),
      ];
      setTambons(uniqueSubDistricts);
    } else if (name === "tambon") {
      setAddress({ ...address, sub_district: value });
      const zipcode = [
        ...new Set(
          Address.filter((item) => item.district === value).map(
            (item) => item.zipcode
          )
        ),
      ];
      setZipcode(zipcode);
    } else if (name === "zipcode") {
      setAddress({ ...address, zipcode: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  if (floor < 0) {
    setFloor(0);
  }

  const decreaseFloor = (e) => {
    e.preventDefault();
    if (floor > 1) {
      setFloor(floor - 1);
      setRoomAmount(roomAmount.slice(0, -1));
    }
  };
  
  const increaseFloor = (e) => {
    e.preventDefault();
    setFloor(parseInt(floor) + 1);
    setRoomAmount([...roomAmount, { floor: parseInt(floor) + 1, room: 5 }]);
  };
  
  const handleFloorsChange = (e) => {
    const { value } = e.target;
    console.log(value);
    const newRoomAmount = [];
    for (let i = 0; i < value; i++) {
      newRoomAmount.push({ floor: i + 1, room: 5 });
    }
    setRoomAmount(newRoomAmount);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/v1/dormitory",
        {
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
          promptpay: promptpay,
          rooms: roomAmount,
        },
        {
          headers: {
            authtoken: `${token}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(dormitoryCreate(res.data.dormitory));
        const dormitoryId = res.data.dormitory._id;
        setTimeout(() => navigate(`rooms-management/${dormitoryId}`), 2000);
      }
    } catch (error) {}
  };
  const increaseRoom = async (index) => {
    setRoomAmount((prevRoomAmount) => {
        const newRoomAmount = [...prevRoomAmount];
        newRoomAmount[index] = {
            ...newRoomAmount[index],
            room: parseInt(newRoomAmount[index].room) + 1
        };
        return newRoomAmount;
    });
  }

  const decreaseRoom = async (index) => {
    setRoomAmount((prevRoomAmount) => {
        const newRoomAmount = [...prevRoomAmount];
        newRoomAmount[index] = {
            ...newRoomAmount[index],
            room: parseInt(newRoomAmount[index].room) - 1
        };
        return newRoomAmount;
    });
  }

  const handleRoomChange = (e, index) => {
    const { name, value } = e.target;
    setRoomAmount((prevRoomAmount) => {
        const newRoomAmount = [...prevRoomAmount];
        newRoomAmount[index] = {
            ...newRoomAmount[index],
            [name]: parseInt(value)
        };
        return newRoomAmount;
    });
  }

  useEffect(() => {
    dispatch(getTitle(text));
    getAddress();
  }, [text]);

  return (
    <>
      <div id="contained" className="container mx-auto">
        <div className="overflow-hidden flex justify-center py-10">
          <div className="bg-bgForm py-5 px-4  w-8/12 lg:w-6/12 xl:w-5/12 drop-shadow-lg rounded-md">
            <div
              id="form"
              className="flex flex-col gap-y-2 text-textTitle overflow-y-auto max-h-[65vh]"
            >
              <div id="name">
                <p className="mb-1 text-sm">ชื่อหอพัก</p>
                <input
                  type="text"
                  placeholder="หอพักปันใจ"
                  className="input input-sm w-full bg-[#D9D9D9] opacity-50 text-colorDark"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-[60%38%] gap-x-4">
                <div id="address">
                  <p className="mb-1 text-sm">ที่อยู่</p>
                  <input
                    type="text"
                    placeholder="111/1 หมู่ 1 "
                    className="input input-sm w-full bg-[#D9D9D9] opacity-50 text-colorDark"
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                  />
                </div>
                <div id="province" className="mb-5">
                  <p className="mb-1 text-sm">จังหวัด</p>
                  <select
                    className="select select-sm w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark"
                    name="province"
                    onChange={handleSelect}
                  >
                    <option disabled selected>
                      เลือกจังหวัด
                    </option>
                    {provinces.map((province, index) => (
                      <option name={province} key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <div className="grid rid grid-cols-3 gap-x-4">
                    <div id="amphure">
                      <p className="mb-1 text-sm">อำเภอ</p>
                      <select
                        className="select select-sm  w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark"
                        name="amphure"
                        onChange={handleSelect}
                      >
                        <option disabled selected>
                          เลือกอำเภอ
                        </option>
                        {amphures.map((amphure, index) => (
                          <option name={amphure} key={index} value={amphure}>
                            {amphure}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div id="tambon">
                      <p className="mb-1 text-sm">ตำบล</p>
                      <select
                        className="select select-sm w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark"
                        name="tambon"
                        onChange={handleSelect}
                      >
                        <option disabled selected>
                          เลือกตำบล
                        </option>
                        {tambons.map((tambon, index) => (
                          <option name={tambon} key={index} value={tambon}>
                            {tambon}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div id="zipcode">
                      <p className="mb-1 text-sm">รหัสไปรษณีย์</p>
                      <select
                        className="select select-sm w-full bg-[#D9D9D9] opacity-50 overflow-hidden text-colorBlueDark"
                        name="zipcode"
                        onChange={handleSelect}
                      >
                        <option disabled selected>
                          รหัสไปรษณีย์
                        </option>
                        {zipcode.map((zipcode, index) => (
                          <option name={zipcode} key={index} value={zipcode}>
                            {zipcode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div id="email">
                <p className="mb-1 text-sm">Email</p>
                <input
                  name="email"
                  value={email}
                  type="email"
                  placeholder="example@gmail.com"
                  className="input input-sm w-full text-colorDark bg-[#D9D9D9] opacity-50"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div id="tel" className="mb-5">
                  <p className="mb-1 text-sm">เบอร์โทรศัพท์</p>
                  <input
                    name="tel"
                    value={tel}
                    type="text"
                    placeholder="08xxxxxxxx"
                    className="input input-sm w-full text-colorDark bg-[#D9D9D9] opacity-50"
                    onChange={(e) => setTel(e.target.value)}
                  />
                </div>

                <div className="mb-5">
                  <p className="mb-1 text-sm">พร้อมเพย์</p>
                  <input
                    name="promptpay"
                    value={promptpay}
                    type="text"
                    placeholder="08xxxxxxxx"
                    className="input input-sm w-full text-colorDark bg-[#D9D9D9] opacity-50"
                    onChange={(e) => setPromptpay(e.target.value)}
                  />
                </div>
                {/* floor button */}
                <div id="floor" className="mb-5">
                  <p className="mb-1 text-sm">
                    จำนวนชั้น{" "}
                    <span className="text-red-700 text-xs">
                      (***จำนวนห้องเริ่มต้นคือ 5***)
                    </span>
                  </p>
                  <div className="flex">
                    <button
                      className="btn btn-sm rounded-e-none bg-colorBlueDark text-bgColor"
                      onClick={decreaseFloor}
                    >
                      -
                    </button>
                    <input
                      name="floor"
                      value={floor}
                      type="text"
                      placeholder="0"
                      min={0}
                      max={20}
                      className="input input-sm w-full text-colorDark bg-[#D9D9D9] opacity-50 rounded-none"
                      onChange={(e) => {
                        const numericInput = e.target.value.replace(/\D/g, "");
                        setFloor(numericInput); handleFloorsChange(e)
                      }}
                    />
                    <button
                      className="btn btn-sm rounded-s-none bg-colorBlueDark text-bgColor"
                      onClick={increaseFloor}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="divider">จำนวนห้อง/ชั้น</div>
              <div className="grid grid-cols-2 gap-x-2">
                {roomAmount.length > 0 &&
                  roomAmount.map((room, index) => (
                    <div id="room" className="mb-5" key={index}>
                      <p className="mb-1 text-sm px-1">
                        ชั้น {room.floor}
                      </p>
                      <div className="flex items-center">
                        <button
                          className="btn btn-sm rounded-e-none bg-colorBlueDark text-bgColor"
                          onClick={() => decreaseRoom(index)}
                        >
                          -
                        </button>
                        <label className="flex items-center bg-[#D9D9D9] opacity-50 w-full max-w-sm">
                          <input
                            name="room"
                            value={room.room}
                            type="number"
                            placeholder="0"
                            min={0}
                            max={20}
                            className="input input-sm w-full text-colorDark bg-[#D9D9D9] opacity-50 rounded-none"
                            onChange={(e) => handleRoomChange(e, index)}
                          />
                          <div className="px-1 text-colorBlueDark text-sm">ห้อง</div>
                        </label>
                        <button
                          className="btn btn-sm rounded-s-none bg-colorBlueDark text-bgColor"
                          onClick={() => increaseRoom(index)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full flex justify-center mt-2">
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
    </>
  );
};

export default DormitoryCreate;
