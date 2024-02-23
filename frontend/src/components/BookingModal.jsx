import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { MdBookmarkAdded } from "react-icons/md";


const BookingModal = ({ dormitoryId, setBookingModal }) => {
    const [dormitory, setDormitory] = useState({})
    const token = localStorage.getItem('token')
    const [date, setDate] = useState(new Date());
    const [roomId, setRoomId] = useState("");
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
    const [bookingAmount, setBookingAmount] = useState(0);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    
    const GetDormitoryByID = async () => {
        try {
            const res = await axios.get(`/api/v1/dormitory/${dormitoryId}`, {
                headers: {
                    authtoken: token
                }
            })
            if (res) {
                setDormitory(res.data.dormitory)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectRoom = (e) => {
        const { value } = e.target;
        setRoomId(value)
    }

    const handleBooking = async() => {
        try {
            const res = await axios.post('/api/v1/dormitroy/booking', {
                name: name,
                phone: phone,
                bookingDate: bookingDate,
                bookingStartDate: date.toISOString().slice(0, 10),
                bookingAmount: bookingAmount,
                note: note,
                roomId: roomId,
            }, {
                headers: {
                    authtoken: token
                }
            })
            if (res) {
                setBookingModal(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetDormitoryByID()
    }, [])
  return (
    <div className="bg-colorBlueDark/30 z-20 top-0 w-screen h-screen absolute">
      <div className="flex items-center justify-center h-full container mx-auto lg:px-48 xl:px-96">
        <div className="bg-bgForm text-colorBlueDark rounded-lg shadow-md px-5 py-5 w-full">
          <div className="grid grid-cols-3 items-center">
            <div></div>
            <div className="text-2xl xl:text-xl text-center font-bold">{dormitory.name}</div>
            <div className='flex items-center justify-end '>
                <RxCross2 className="h-6 w-6 cursor-pointer hover:scale-110 duration-300" onClick={() => setBookingModal(false)}/>
            </div>
          </div>
          <div className='text-lg font-semibold'>จองห้องพัก</div>
          <div className='px-2 mb-2 overflow-y-auto max-h-[72vh]'>
            <p className="mb-1 text-sm">เลือกห้อง</p>
            <select className="select select-sm select-bordered w-full max-w-2xl" onChange={handleSelectRoom} required>
                <option disabled selected>เลือกห้อง</option>
                {dormitory.floors?.map((floor, floorIndex) => (
                    floor.rooms?.map((room, roomIndex) => (
                    <option key={`${floorIndex}-${roomIndex}`} disabled={room.status?.name !== "ว่าง"} value={room._id}>{room.name} {room.status?.name}</option>
                    ))
                ))}
            </select>
            <div className='flex items-center gap-x-3 w-full'>
                <div className='mt-2 w-full'>
                    <p className="mb-1 text-sm">ชื่อ - นามสกุล</p>
                    <input type="text" placeholder="ชื่อ - นามสกุล" className="input input-sm input-bordered w-full max-w-xl" name='name' value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className='mt-2 w-full'>
                    <p className="mb-1 text-sm">เบอร์โทรศัพท์</p>
                    <input type="text" placeholder="เบอร์โทรศัพท์" className="input input-sm input-bordered w-full max-w-xl" name='phone' value={phone} onChange={(e) => setPhone(e.target.value)} required pattern="[0-9]{10}" maxLength={"10"}/>
                </div>
            </div>
            <div className='flex items-center gap-x-3 w-full'>
                <div className='mt-2 w-full'>
                    <p className="mb-1 text-sm">วันที่จอง <span className='text-red-500 text-xs'>*จำเป็น</span></p>
                    <input type="date" className="input input-sm input-bordered w-full max-w-xl" name='bookingDate' value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} required/>
                </div>
                <div className='mt-2 w-full'>
                    <p className="mb-1 text-sm">เงินจอง <span className='text-red-500 text-xs'>*จำเป็น</span></p>
                    <input type="number" placeholder="0" className="input input-sm input-bordered w-full max-w-xl" name='bookingAmount' value={bookingAmount} onChange={(e) => setBookingAmount(e.target.value)} min='0' required/>
                </div>
            </div>
            <div className='mt-2 w-full'>
                <p className="mb-1 text-sm">วันที่เข้าทำสัญญา</p>
                <div className="flex items-center justify-center">
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
            <div className='mt-2 w-full'>
                <p className="mb-1 text-sm">หมายเหตุ</p>
                <textarea className="textarea textarea-bordered w-full" placeholder="หมายเหตุ" name='note' value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>
          </div>
            <div className='text-center '>
                <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={handleBooking}><MdBookmarkAdded />จอง</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal