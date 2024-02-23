import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";

const RepairModal = ({ roomId, setRepairModal }) => {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [meetDate, setMeetDate] = useState(new Date().toISOString().slice(0, 10));
    const [detail, setDetail] = useState("");

    const handleSubmit = async () => {
        try {
          const res = await axios.post(
            `/api/v1/repair`,
            {
              roomId,
              date,
              meetDate,
              description: detail,
            },
            {
              headers: {
                authtoken: `${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.data.success) {
            setRepairModal(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <div className="bg-colorBlueDark/30 z-20 top-0 w-screen h-screen absolute">
        <div className="flex items-center justify-center h-full container mx-auto lg:px-48 xl:px-80">
            <div className="bg-bgForm  rounded-lg shadow-md px-5 py-5 w-full">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-xl font-semibold">แจ้งซ่อม</div>
                    <button onClick={() => setRepairModal(false)}>
                        <RxCross2 className="h-7 w-7 cursor-pointer" />
                    </button>
                </div>
                <div className='divider'></div>
                <div className="grid grid-cols-3 gap-x-3 items-center mb-5">
                <div>
                    <p className="text-sm mb-1">วันที่แจ้ง <span className="text-red-500 text-xs">* จำเป็น</span></p>
                    <input type="date" className="input input-bordered w-full max-w-xl" name="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                </div>
                <div>
                    <p className="text-sm mb-1">วันที่นัดซ่อม <span className="text-red-500 text-xs">* จำเป็น</span></p>
                    <input type="date" className="input input-bordered w-full max-w-xl" name="meetDate" value={meetDate} onChange={(e) => setMeetDate(e.target.value)}/>
                </div>
            </div>
            <div className="mb-3">
                <p className="text-sm mb-1">รายละเอียด</p>
                <textarea className="textarea textarea-lg textarea-bordered w-full" placeholder="รายละเอียด" value={detail} onChange={(e) => setDetail(e.target.value)}></textarea>
            </div>
            <div className="flex items-center justify-end gap-x-2 ">
                <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={handleSubmit}>บันทึก</button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default RepairModal