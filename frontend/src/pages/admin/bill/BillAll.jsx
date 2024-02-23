import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCircle } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';

const BillAll = () => {
  const [billAll, setBillAll] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [status, setStatus] = useState("");

  console.log(status);

  const getAllBill = async() => {
    try {
      const res = await axios.get(`/api/v1/backoffice/invoiced-list/${id}?date=${date}`, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setBillAll(res.data.invoice)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filterInVoice = async() => {
    try {
      const res = await axios.get(`/api/v1/backoffice/invoiced-filter/${id}?date=${date}&status=${status}`, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setBillAll(res.data.invoice)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllBill()
  }, [date])

  return (
    <div className="px-5 mt-6 text-colorBlueDark">
      <div className="text-2xl font-bold mb-5">บิล - ค่าห้องรายเดือน</div>
      <div className="bg-colorBlueDark/30 py-5 rounded-t-md">
        <div className="px-5 text-colorBlueDark mb-3 text-xl">ค้นหา</div>
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-x-2 ">
            <select className="select select-bordered-primary  w-full max-w-xs select-sm" onChange={(e) => setStatus(e.target.value)}>
              <option disabled selected>
                สถานะ
              </option>
              <option value={"unpaid"}>ยังไม่ชำระ</option>
              <option value={"paid"}>ชำระแล้ว</option>
              <option value={"pending"}>กำลังดำเนินการ</option>
            </select>
            <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={() => filterInVoice()}>
              ค้นหา
            </button>
            <span className="text-colorBlueDark cursor-pointer hover:underline hover:scale-105 duration-300" onClick={() => getAllBill()}>
              รีเซ็ต
            </span>
          </div>
          <input
            type="month"
            name="date"
            id="date"
            value={date}
            min={new Date().toISOString().slice(0, 7)}
            className="input input-bordered input-sm"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-bgForm rounded-b-md">
        {billAll.length > 0 ? (
          <div className="grid lg:grid-cols-4 xl:grid-cols-6 lg:gap-x-2 xl:gap-x-4 xl:gap-y-6 lg:gap-y-3 py-5 px-3">
            {billAll.map((bill, i) => (
              <div className="border-2 rounded-md shadow-sm px-2 py-1" key={i}>
                <div className="flex items-center justify-between text-xl font-semibold">
                  <div>{bill.roomId.name}</div>
                  <div>{bill.grandTotal}</div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                  <div>ห้อง</div>
                  <div>ยอดเงิน</div>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-x-1 text-xs">
                    <FaCircle className={`h-3 w-3 ${bill.invoiceStatus === "paid" ? "text-green-500" : bill.invoiceStatus === "unpaid" ? "text-red-500" : "text-yellow-500"}`} />
                    {bill.invoiceStatus === "paid" ? "ชำระแล้ว" : bill.invoiceStatus === "unpaid" ? "ยังไม่ชำระ" : "กำลังดำเนินการ"}
                  </div>
                  <Link to={`/admin/bill-detail/${id}/${bill._id}`}>
                    <button className="btn btn-sm">รายละเอียด</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-3xl font-bold text-center py-10">
            ไม่พบข้อมูล
          </div>
        )}
      </div>
    </div>
  );
}

export default BillAll