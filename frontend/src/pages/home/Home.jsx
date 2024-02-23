import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import UserHome from "../../components/UserHome";
import axios from "axios";
import HomeNav from "../../components/HomeNav";
import UserModal from "../../components/UserModal";
import SearchDormitoryModal from "../../components/SearchDormitoryModal";
import { TiCancel } from "react-icons/ti";
import BookingModal from "../../components/BookingModal";
import DormitoryList from "../../components/DormitoryList";
import Profile from "../../components/Profile";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [dormitory, setDormitory] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [renter, setRenter] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7))
  const [userIndormitory, setUserIndormitory] = useState([]);
  const [bookingModal, setBookingModal] = useState(false);
  const [dormitoryId, setDormitoryId] = useState(null);
  const [listModal, setListModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  // สร้างอาร์เรย์เพื่อเก็บจำนวน rooms ของแต่ละ dormitory
  const roomsCountPerDormitory = dormitory.map((d) => ({
    dormitoryName: d.name,
    roomsCount: d.floors.reduce(
      (total, floor) => total + floor.rooms.length,
      0
    ),
  }));

  const roomFree = dormitory.map((d) => {
    const dormitoryName = d.name;
    const matchedRoom = roomsCountPerDormitory.find(room => room.dormitoryName === dormitoryName);
    const freeRoomsCount = d.floors.reduce(
      (total, floor) => total + floor.rooms.filter(room => room.status.name === "ว่าง").length,
      0
    );
    return { dormitoryName, freeRoomsCount };
  });
  
  const roomOccupied = dormitory.map((d) => ({
    dormitoryName: d.name,
    occupiedRoomsCount: d.floors.reduce(
      (total, floor) => 
        total + floor.rooms.filter(room => room.status.name === "มีผู้เช่า").length,
      0
    ),
  }))

  const roomBooked = dormitory.map((d) => ({
    dormitoryName: d.name,
    bookedRoomsCount: d.floors.reduce(
      (total, floor) => 
        total + floor.rooms.filter(room => room.status.name === "จอง").length,
      0
    ),
  }))

  const checkAuthToken = async () => {
    if (!token) {
      navigate("/login");
    }
  };
  const getUserDetail = async () => {
    try {
      const res = await axios.get("/api/v1/user-detail", {
        headers: {
          authtoken: `${token}`,
        },
      });
      if (res.data.success) {
        setUserDetail(res.data.userDetail);
        setUserId(res.data.userDetail._id);
        setRole(res.data.userDetail.role.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDormitoryByUser = async (userId) => {
    try {
      if (userId) {
        const res = await axios.get(`/api/v1/get-dormitory-by-user/${userId}`);
        if (res.data.success) {
          setDormitory(res.data.dormitory);
        }
      } else {
        console.error("userId is undefined");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getRenterInDormitory = async () => {
    try {
        const res = await axios.get(`/api/v1/dormitory-connection?date=${date}`, {
          headers: {
            authtoken: `${token}`,
          },
        });
        if (res.data.success) {
          setRenter(res.data.renterArray);
        } else {
          setRenter(res.data.renterArray);
        }
    } catch (error) {
      console.log(error);
    }
  }

  const getUserInDormitory = async () => {
    try {
      const res = await axios.get(`/api/v1/dormitory-user-connect`, {
        headers: {
          authtoken: `${token}`,
        },
      });
      if (res.data.success) {
        setUserIndormitory(res.data.dormitory);
      } else {
        setUserIndormitory(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const DisconnectDormitory = async (dormitoryId) => {
    try {
      const res = await axios.put(`/api/v1/dormitory-user-connect`, {
        dormitoryId: dormitoryId
      }, {
        headers: {
          authtoken: `${token}`,
        },
      });
      if (res.data.success) {
        getRenterInDormitory();
        getUserInDormitory();
        getUserDetail();
        getDormitoryByUser(userId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const openBookingModal = (dormitoryId) => {
    setDormitoryId(dormitoryId);
    setBookingModal(true);
  }

  useEffect(() => {
    if (location.pathname === "/" && !token) {
      navigate("/login");
    }
    checkAuthToken();
    getUserDetail();
    getRenterInDormitory();
    getUserInDormitory();
  }, [token, searchModal]);

  useEffect(() => {
    if (userId) {
      getDormitoryByUser(userId);
    }
  }, [userId]);

  return (
    <div className={`relative`}>
      <HomeNav
        userDetail={userDetail}
        setOpenModal={setOpenModal}
        openModal={openModal}
        setListModal={setListModal}
      />
      {openProfile && <Profile setOpenProfile={setOpenProfile} userDetail={userDetail} setListModal={setListModal}/>}
      {listModal && <DormitoryList setListModal={setListModal}/>}
      {openModal && <UserModal setOpenProfile={setOpenProfile}/>}
      {searchModal && <SearchDormitoryModal setSearchModal={setSearchModal}/>}
      {bookingModal && <BookingModal dormitoryId={dormitoryId} setBookingModal={setBookingModal}/>}
      <div className="container mx-auto px-20 xl:px-32">
        {(role === "admin") | (role === "employee") ? (
          <div
            className={`grid ${
              (role === "admin") | (role === "employee") ? " grid-cols-2 " : ""
            } gap-x-10`}
          >
            <div>
              <div className="mt-8 bg-bgForm text-colorBlueDark rounded-lg shadow-md py-3">
                <div className="text-center text-xl">สำหรับเจ้าของหอพัก</div>
                <div id="line" className="border-b-2 border-colorBlueDark"></div>
                {dormitory && dormitory.length > 0 ? (
                  <div className="mt-3 px-8 overflow-y-scroll max-h-[80vh]">
                    <div className="max-h-[50vh]">
                      {dormitory.map((dormitory, i) => (
                        <div className="mb-3" key={i}>
                          <div className="text-lg">{dormitory.name}</div>
                          <div className="grid grid-cols-2 px-10 text-sm mb-3 text-colorDark/80">
                            <div>
                              <FaCircle className="inline h-3 w-3 text-green-500" />{" "}
                              ห้องว่าง {roomFree[i].freeRoomsCount} ห้อง
                            </div>
                            {roomsCountPerDormitory.map((item, i) => {
                              if (item.dormitoryName === dormitory.name) {
                                return (
                                  <div className="text-start pl-16" key={i}>
                                    <FaCircle className="inline h-3 w-3 text-gray-400" />{" "}
                                    ห้องทั้งหมด {item.roomsCount} ห้อง
                                  </div>
                                );
                              }
                            })}
                            {/* TODO: ใส่ไม่ว่างไปก่อน ไว้ทำค้างชำระมาใส่แทนทีหลัง */}
                            <div>
                              <FaCircle className="inline h-3 w-3 text-red-500" />{" "}
                              ไม่ว่าง {roomOccupied[i].occupiedRoomsCount} ห้อง
                            </div>
                            <div className="text-start pl-16">
                              <FaCircle className="inline h-3 w-3 text-purple-500" />{" "}
                              จอง {roomBooked[i].bookedRoomsCount} ห้อง
                            </div>
                          </div>
                          <div className="text-end px-10">
                            <button
                              className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                              onClick={() =>
                                navigate(`/admin/room-management/${dormitory._id}`)
                              }
                            >
                              จัดการหอ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ): (
                  <div className="text-center text-base text-colorBlueGray mb-3 mt-3">
                  โปรดเพิ่มหอพัก
                </div>
                )}
                <div className="w-full px-8 mt-2">
                  <Link to={"/dormitory"}>
                    <button className="w-full px-3 py-1 rounded-md bg-colorBlueDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
                      เพิ่มหอพัก
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className={`mt-8 bg-bgForm text-colorBlueDark rounded-lg shadow-md py-3 ${userIndormitory.length === 0 && renter.length === 1 ? "max-h-[30vh]" : " max-h-[62vh]"}`}>
                <div className="text-center text-xl">สำหรับผู้เช่า</div>
                <div id="line" className="border-b-2 border-colorBlueDark"></div>
                <div className="mt-3 px-8 overflow-y-scroll max-h-[50vh] xl:mb-8 lg:mb-4">
                  {/* TODO: เดี๋ยวจะกลับมาทำตอนทำระบบจองห้องพักเสร็จ */}
                  {renter.length === 0 ? (
                    <div className="text-center text-base text-colorBlueGray mb-2">
                      ยังไม่มีหอพัก
                    </div>
                  ) : (
                    <div className="overflow-y-auto max-h-[28vh]">
                      {renter.map((renter, i) => (
                        <div key={i}>
                          <div className="relative text-lg">
                            {renter.renter?.dormitoryId?.name}
                            <span className="font-thin text-sm ml-1">({renter.renter?.roomId?.name})</span>
                          </div>
                          <div className="px-6 text-colorBlueGray text-xs">
                            {renter.renter?.dormitoryId?.address?.address} ต.{renter.renter?.dormitoryId?.address?.sub_district} อ.{renter.renter?.dormitoryId?.address?.district} จ.{renter.renter?.dormitoryId?.address?.province} {renter.renter?.dormitoryId?.address?.zipcode}
                          </div>
                          <div className="flex justify-end items-center gap-x-2 mt-3 xl:mb-9 lg:mb-14">
                            {/* <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
                              จัดการห้อง
                            </button> */}
                            <Link to={(renter.invoice && renter.invoice?.invoiceStatus === "unpaid" || renter.invoice?.invoiceStatus === "pending") ? `/invoice/${renter.invoice._id}` : ""} className="indicator">
                              {(renter.invoice && renter.invoice?.invoiceStatus === "unpaid" || renter.invoice?.invoiceStatus === "pending") ? <span className="indicator-item badge badge-error text-xs text-bgColor h-5 w-3">1</span> : null}
                              <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
                                บิล
                              </button>
                            </Link>
                            <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
                              แจ้งซ้อม
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {userIndormitory?.length === 0 ? (
                    null
                  ): (
                    <div>
                      <div className="divider">รายชื่อหอที่เชื่อมต่อ</div>
                      <div className="overflow-y-auto max-h-[10vh] px-1 py-2">
                      {userIndormitory.map((user, i) => (
                          <div key={i} className="flex items-center justify-between mb-2">
                            <div className="text-lg">{i+1}. {user.name}</div>
                            <div  className="flex items-center gap-x-1">
                              <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                              onClick={() => openBookingModal(user._id)}>
                                จองห้อง
                              </button>
                              <div className="tooltip tooltip-left tooltip-warning" data-tip="ยกเลิกเชื่อมต่อ">
                                <button className="px-3 py-1 rounded-md bg-red-600 text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                                  onClick={() => DisconnectDormitory(user._id)}>
                                  <TiCancel className="text-bgColor h-5 w-5"/>
                                </button>
                              </div>
                            </div>
                          </div>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full px-8 flex flex-row justify-end items-end mt-2">
                  <button className="w-full px-3 py-1 rounded-md bg-colorBlueDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                  onClick={() => setSearchModal(true)}>
                    เชื่อมต่อหอพัก
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-8 px-48">
            <UserHome renter={renter} setSearchModal={setSearchModal} userIndormitory={userIndormitory} openBookingModal={openBookingModal} DisconnectDormitory={DisconnectDormitory}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
