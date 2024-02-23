import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TiCancel } from "react-icons/ti";

const UserHome = ({ setSearchModal, userIndormitory, openBookingModal, roomId, setRepairModal, setRoomId }) => {
  const [renter, setRenter] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  const token = localStorage.getItem("token");
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
        setRenter(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRepair = (roomId) => {
    setRoomId(roomId);
    setRepairModal(true);
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRenterInDormitory();
  }, []);

  return (
    <>
      <div
        className={`mt-8 bg-bgForm text-colorBlueDark rounded-lg shadow-md py-3 ${
          userIndormitory.length === 0 && renter.length === 1
            ? "max-h-[30vh]"
            : " max-h-[62vh]"
        }`}
      >
        <div className="text-center text-xl">สำหรับผู้เช่า</div>
        <div id="line" className="border-b-2 border-colorBlueDark"></div>
        <div className="mt-3 px-8 overflow-y-scroll max-h-[50vh] xl:mb-8 lg:mb-4">
          {/* TODO: เดี๋ยวจะกลับมาทำตอนทำระบบจองห้องพักเสร็จ */}
          {renter.length === 0 ? (
            <div className="text-center text-base text-colorBlueGray mb-3">
              ยังไม่มีหอพัก
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[28vh]">
              {renter.map((renter, i) => (
                <div key={i}>
                  <div className="relative text-lg">
                    {renter.renter?.dormitoryId?.name}
                    <span className="font-thin text-sm ml-1">
                      ({renter.renter?.roomId?.name})
                    </span>
                  </div>
                  <div className="px-6 text-colorBlueGray text-xs">
                    {renter.renter?.dormitoryId?.address?.address} ต.
                    {renter.renter?.dormitoryId?.address?.sub_district} อ.
                    {renter.renter?.dormitoryId?.address?.district} จ.
                    {renter.renter?.dormitoryId?.address?.province}{" "}
                    {renter.renter?.dormitoryId?.address?.zipcode}
                  </div>
                  <div className="flex justify-end items-center gap-x-2 mt-3 xl:mb-9 lg:mb-14">
                    {/* <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
                      จัดการห้อง
                    </button> */}
                    <Link
                      to={
                        (renter.invoice &&
                          renter.invoice?.invoiceStatus === "unpaid") ||
                        renter.invoice?.invoiceStatus === "pending"
                          ? `/invoice/${renter.invoice._id}`
                          : ""
                      }
                      className="indicator"
                    >
                      {(renter.invoice &&
                        renter.invoice?.invoiceStatus === "unpaid") ||
                      renter.invoice?.invoiceStatus === "pending" ? (
                        <span className="indicator-item badge badge-error text-xs text-bgColor h-5 w-3">
                          1
                        </span>
                      ) : null}
                      <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
                        บิล
                      </button>
                    </Link>
                    <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                    onClick={() => handleRepair(renter.renter?.roomId?._id)}>
                      แจ้งซ้อม
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {userIndormitory?.length === 0 ? null : (
            <div>
              <div className="divider">รายชื่อหอที่เชื่อมต่อ</div>
              <div className="overflow-y-auto max-h-[10vh] px-1 py-2">
                {userIndormitory.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="text-lg">
                      {i + 1}. {user.name}
                    </div>
                    <div className="flex items-center gap-x-1">
                      <button
                        className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                        onClick={() => openBookingModal(user._id)}
                      >
                        จองห้อง
                      </button>
                      <div
                        className="tooltip tooltip-left tooltip-warning"
                        data-tip="ยกเลิกเชื่อมต่อ"
                      >
                        <button
                          className="px-3 py-1 rounded-md bg-red-600 text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
                          onClick={() => DisconnectDormitory(user._id)}
                        >
                          <TiCancel className="text-bgColor h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full px-8 flex items-end">
          <button
            className="w-full px-3 py-1 rounded-md bg-colorBlueDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg"
            onClick={() => setSearchModal(true)}
          >
            เชื่อมต่อหอพัก
          </button>
        </div>
      </div>
    </>
  );
};

export default UserHome;
