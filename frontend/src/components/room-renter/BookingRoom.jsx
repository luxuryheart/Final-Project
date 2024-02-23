import axios from "axios";
import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaEdit } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
const BookingRoom = ({ roomId, setRoomModal }) => {
  const [date, setDate] = useState(new Date());

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [bookingAmount, setBookingAmount] = useState(0);
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");
  const [bookingDetail, setBookingDetail] = useState(null);
  const [bookingRoomUpdate, setBookingRoomUpdate] = useState(null);
  const [usersConnect, setUsersConnect] = useState([]);
  const { id } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const handleBookingRoom = async () => {
    try {
      const res = await axios.post(
        "/api/v1/backoffice/booking",
        {
          name: name,
          phone: phone,
          bookingDate: bookingDate,
          bookingStartDate: date.toISOString().slice(0, 10),
          bookingAmount: bookingAmount,
          note: note,
          roomId: roomId,
          userId: userId,
        },
        {
          headers: {
            authtoken: token,
          },
        }
      );
      if (res.data.success) {
        setTimeout(() => setRoomModal(false), 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBooikngRoomByRoomID = async () => {
    try {
      const res = await axios.get(`/api/v1/backoffice/booking/${roomId}`, {
        headers: {
          authtoken: token,
        },
      });
      if (res.data.success) {
        setBookingDetail(res.data.booking);
        setBookingRoomUpdate(res.data.booking);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CancelBooking = async () => {
    try {
      const res = await axios.delete(
        `/api/v1/backoffice/booking/${bookingDetail._id}?roomId=${roomId}`,
        {
          headers: {
            authtoken: token,
          },
        }
      );
      if (res.data.success) {
        setTimeout(() => setRoomModal(false), 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInDormitory = async () => {
    try {
      const res = await axios.get(`/api/v1/dormitory-connection/${id}`, {
        headers: {
          authtoken: `${token}`,
        },
      });
      if (res.data.success) {
        setUsersConnect(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    const selectedUser = usersConnect.find((user) => user._id === value);
    if (selectedUser) {
      setUserId(selectedUser._id);
      setName(
        selectedUser.profile?.firstname + " " + selectedUser.profile?.lastname
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetail((prevBookingDetail) => ({
      ...prevBookingDetail,
      [name]: value,
    }));
  };

  const UpdateBooking = async () => {
    try {
      const res = await axios.put(`/api/v1/backoffice/booking`,
        {
          bookingId: bookingDetail._id,
          name: bookingDetail.name,
          phone: bookingDetail.tel,
          bookingDate: bookingDetail.bookingDate,
          bookingStartDate: bookingDetail.bookingStartDate,
          bookingAmount: bookingDetail.bookingAmount,
        },
        {
          headers: {
            authtoken: token,
          },
        }
      );
      if (res.data.success) {
        setEditOpen(false);
        setTimeout(() => getBooikngRoomByRoomID(), 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBooikngRoomByRoomID();
    getUserInDormitory();
  }, []);

  return (
    <div>
      {bookingDetail &&
      bookingDetail !== null &&
      bookingDetail !== undefined ? (
        !editOpen ? (
          <div className="px-5 text-colorBlueDark">
            <div className="text-lg mb-2">ข้อมูลผู้จอง</div>
            <div className="bg-colorBlueDark/30 rounded-t-md py-5 px-5 text-colorDark">
              <div>รายละเอียดผู้เข้าพัก</div>
            </div>
            <div className="bg-bgForm border-2 border-colorBlueDark/30 py-3">
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  ชื่อ - นามสกุล
                </div>
                <div className="text-colorDark text-sm px-5">
                  {bookingDetail.name}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  เบอร์โทรศัพท์
                </div>
                <div className="text-colorDark text-sm px-5">
                  {bookingDetail.tel}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  ห้อง
                </div>
                <div className="text-colorDark text-sm px-5">
                  {bookingDetail.roomId?.name}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  จองวันที่
                </div>
                <div className="text-colorDark text-sm px-5">
                  {bookingDetail.bookingDate
                    ? new Date(bookingDetail.bookingDate).toLocaleDateString()
                    : ""}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  วันที่เข้าทำสัญญา
                </div>
                <div className="text-colorDark text-sm px-5">
                  {bookingDetail.bookingStartDate
                    ? new Date(
                        bookingDetail.bookingStartDate
                      ).toLocaleDateString()
                    : ""}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  เงินจอง
                </div>
                <div className="text-colorDark text-sm px-5">
                  {parseFloat(bookingDetail.bookingAmount).toFixed(2)} บาท
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end">
              <button
                className="btn btn-sm bg-colorBlueDark text-bgColor px-5 mx-1"
                onClick={() => setEditOpen(true)}
              >
                <FaEdit />
                แก้ไข
              </button>
              <button
                className="btn btn-sm bg-red-500 text-bgColor"
                onClick={CancelBooking}
              >
                <TiCancel className="h-4 w-4" />
                ยกเลิกจอง
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 text-colorBlueDark">
            <div className="text-lg mb-2">ข้อมูลผู้จอง</div>
            <div className="bg-colorBlueDark/30 rounded-t-md py-5 px-5 text-colorDark">
              <div>รายละเอียดผู้เข้าพัก</div>
            </div>
            <div className="bg-bgForm border-2 border-colorBlueDark/30 py-3">
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  ชื่อ - นามสกุล
                </div>
                <input
                  type="text"
                  placeholder="ชื่อ - นามสกุล"
                  className="input input-sm input-bordered w-full max-w-xs"
                  value={bookingDetail.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  เบอร์โทรศัพท์
                </div>
                <input
                  type="text"
                  placeholder="เบอร์โทรศัพท์"
                  className="input input-sm input-bordered w-full max-w-xs"
                  value={bookingDetail.tel}
                  name="tel"
                  onChange={handleChange}
                  maxLength={10}
                />
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  ห้อง
                </div>
                <div className="text-colorDark text-sm px-5">
                  {bookingDetail.roomId?.name}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  จองวันที่
                </div>
                <input
                  type="date"
                  name="bookingDate"
                  className="input input-sm input-bordered w-full max-w-xs"
                  value={bookingDetail.bookingDate}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  วันที่เข้าทำสัญญา
                </div>
                <input
                  type="date"
                  name="bookingStartDate"
                  className="input input-sm input-bordered w-full max-w-xs"
                  value={bookingDetail.bookingStartDate}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 items-center mb-2 max-w-[300px]">
                <div className="text-colorDark text-sm px-5 font-bold">
                  เงินจอง
                </div>
                <input
                  type="number"
                  placeholder={bookingDetail.bookingAmount}
                  className="input input-sm input-bordered w-full max-w-xs"
                  value={bookingDetail.bookingAmount}
                  name="bookingAmount"
                  onChange={handleChange}
                />
              </div>
            </div>
            {editOpen ? (
              <div className="mt-3 flex items-center justify-end">
                <button
                  className="btn btn-sm bg-slate-500 text-bgColor px-5 mx-1"
                  onClick={() => {setEditOpen(false); getBooikngRoomByRoomID()}}
                >
                  ยกเลิก
                </button>
                <button
                  className="btn btn-sm btn-success text-bgColor"
                  onClick={UpdateBooking}
                >
                  <FaCheck  className="h-4 w-4" />
                  ตกลง
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-end">
                <button
                  className="btn btn-sm bg-colorBlueDark text-bgColor px-5 mx-1"
                  onClick={() => setEditOpen(true)}
                >
                  <FaEdit />
                  แก้ไข
                </button>
                <button
                  className="btn btn-sm bg-red-500 text-bgColor"
                  onClick={CancelBooking}
                >
                  <TiCancel className="h-4 w-4" />
                  ยกเลิกจอง
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="px-5 text-colorDark">
          <div className="text-lg">เพิ่มข้อมูลการจอง</div>
          <div className="mb-3">
            <p className="text-sm mb-1">เลือกข้อมูลจากผู้ใช้</p>
            <select
              className="text-xs py-1 select select-sm select-bordered w-full max-w-xs"
              onChange={handleSelect}
            >
              <option disabled selected>
                เลือกข้อมูลจากผู้ใช้
              </option>
              {usersConnect.length > 0 ? (
                usersConnect.map((user) => (
                  <option value={user._id}>{user.username}</option>
                ))
              ) : (
                <option disabled>ไม่พบผู้ใช้</option>
              )}
            </select>
          </div>
          <div className="flex items-center gap-x-5 w-full">
            <div className="w-full">
              <p className="text-sm mb-1">ชื่อ - นามสกุล</p>
              <input
                type="text"
                placeholder="ชื่อ - นามสกุล"
                className="input input-sm input-bordered w-full max-w-xl"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <p className="text-sm mb-1">เบอร์โทรศัพท์</p>
              <input
                type="text"
                placeholder="เบอร์โทรศัพท์"
                className="input input-sm input-bordered w-full max-w-xl"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-2 items-center">
            <div className="overflow-y-auto max-h-[45vh] h-50 flex flex-col justify-center">
              <p className="text-sm mb-1 mt-2">วันที่เข้าทำสัญญา</p>
              <div className="xl:flex items-center justify-center">
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  showOutsideDays
                  required
                  disabled={
                    new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
                  }
                />
              </div>
            </div>
            <div className="h-full">
              <div className="mt-2">
                <p className="text-sm mb-2">
                  วันที่จอง{" "}
                  <span className="text-red-500 text-sm">*จำเป็น</span>
                </p>
                <input
                  type="date"
                  placeholder="Type here"
                  required
                  className="input input-sm input-bordered w-full lg:max-w-[365px] xl:max-w-[450px]"
                  name="bookingDate"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <p className="text-sm mb-2">
                  เงินจอง <span className="text-red-500 text-sm">*จำเป็น</span>
                </p>
                <input
                  type="number"
                  placeholder="0"
                  required
                  className="input input-sm input-bordered w-full lg:max-w-[365px] xl:max-w-[450px]"
                  name="bookingAmount"
                  value={bookingAmount}
                  onChange={(e) => setBookingAmount(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <p className="text-sm mb-2">รายละเอียด</p>
                <textarea
                  className="textarea textarea-bordered w-full lg:max-w-[365px] xl:max-w-[450px]"
                  placeholder="รายละเอียด"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
              <div className="text-end mr-5 mt-8">
                <button
                  className="btn btn-sm bg-colorBlueDark text-bgColor"
                  onClick={handleBookingRoom}
                >
                  จอง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRoom;
