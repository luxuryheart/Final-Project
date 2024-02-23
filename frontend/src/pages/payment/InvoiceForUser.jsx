import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { FaPrint } from "react-icons/fa6";
import { IoReturnUpBack } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import PaymentType from "../../components/payment/PaymentType";

const InvoiceForUser = () => {
  const [bill, setBill] = useState({});
  const { invoiceid } = useParams();
  const token = localStorage.getItem("token");
  const [paymentTypeOpen, setPaymentTypeOpen] = useState(false);
  const [banks, setBanks] = useState([]);

  const getBillById = async() => {
    try {
      const res = await axios.get(`/api/v1/inoviced/${invoiceid}`, {
        headers: {
          authtoken: `${token}`,
        },
      })  
      if (res.data.success) {
        setBill(res.data.invoice)
      }
    } catch (error) {
        console.log(error);
    }
  }

  const getBankByID = async() => {
    try {
      const res = await axios.get(`/api/v1//get-bank-user/${bill.dormitoryId?._id}`, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setBanks(res.data.bank)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBillById()
    getBankByID()
  }, [invoiceid, paymentTypeOpen])

  return (
    <div className="relative">
      {paymentTypeOpen && <PaymentType banks={banks} bill={bill} setPaymentTypeOpen={setPaymentTypeOpen} />}
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center pt-10 gap-x-4 overflow-y-auto max-h-[90vh] text-colorBlueDark xl:mx-80 lg:mx-60 ">
          <div className="text-2xl mb-5">ใบแจ้งหนี้</div>
          <div className="bg-bgForm my-2 rounded-md shadow-md w-full px-4 py-5">
              <div className="flex items-center justify-between" id="header">
                <Link to={'/'}>
                  <button className="btn btn-sm bg-colorBlueDark/40 text-bgColor"><IoReturnUpBack /> กลับ</button>
                </Link>
                <div>
                </div>
              </div>
              <div className="text-end text-xl text-colorDark mt-2">
                ใบแจ้งหนี้ (Invoice)
              </div>
              <div className="flex items-center justify-between text-lg mb-1">
                <div>{bill.dormitoryId?.name}</div>
                <div className="flex items-center text-base gap-x-1">
                  สถานะ:{" "}
                  <div
                    className={`${
                      bill.invoiceStatus === "paid"
                        ? "bg-green-600"
                        : bill.invoiceStatus === "unpaid"
                        ? "bg-red-600"
                        : "bg-orange-600"
                    } px-1 py-1 rounded-md text-bgColor text-xs`}
                  >
                    {bill.invoiceStatus === "paid"
                      ? "จ่ายแล้ว"
                      : bill.invoiceStatus === "unpaid"
                      ? "ยังไม่จ่าย"
                      : "กำลังดำเนินการ"}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <div>
                  {bill.dormitoryId?.address?.address} ต.
                  {bill.dormitoryId?.address?.sub_district} อ.
                  {bill.dormitoryId?.address?.district} จ.
                  {bill.dormitoryId?.address?.province}
                </div>
                <div className="">เลขที่: {bill.no}</div>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <div>โทร: {bill.dormitoryId?.contact?.tel[0]}</div>
                <div className="">
                  ชื่อ: {bill.renterDetailId?.userId?.profile?.firstname}{" "}
                  {bill.renterDetailId?.userId?.profile?.lastname}
                </div>
              </div>
              <div className="text-sm text-end">
                วันที่: {bill.date?.day}-{bill.date?.month}-{bill.date?.year}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="text-center">
                      <th></th>
                      <th>รายการ</th>
                      <th>มิเตอร์ใหม่ - เก่า</th>
                      <th>จํานวน</th>
                      <th>ราคา</th>
                      <th>รวมเงิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.lists?.map((list, index) => (
                      <tr key={index} className="text-center">
                        <th>{index + 1}</th>
                        <td>{list.description}</td>
                        <td>
                          {list.meter === null || list.meter === undefined || list.meter === ""
                            ? "-"
                            : list.meter}
                        </td>
                        <td>
                          {list.unit } 
                        </td>
                        <td>
                          {list.price}
                        </td>
                        <td>{list.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-2xl flex justify-between items-center font-semibold mt-8 px-5">
                <div>
                  รวมเป็นเงิน {bill.grandTotal} บาท
                </div>
                <div>
                  <button className="btn btn-sm btn-success text-bgColor hover:scale-110 duration-300" onClick={() => {setPaymentTypeOpen(true)}}><GiMoneyStack />ชำระเงิน</button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceForUser