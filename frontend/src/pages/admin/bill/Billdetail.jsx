import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

const Billdetail = () => {
  const { invoiceid, id } = useParams();
  const token = localStorage.getItem("token");
  const [bill, setBill] = useState({});
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [buttonSwitch, setButtonSwitch] = useState(false);
  const navigate = useNavigate();

  const unitArray = [
    "ยูนิต", "เดือน", "วัน", "เครื่อง", "ชิ้น", "หน่วย", "กิโลกรัม", "บาท", "บาท/หน่วย", "บาท/ชิ้น", "บาท/เครื่อง", 
  ]

  const getBillById = async() => {
    try {
      const res = await axios.get(`/api/v1/backoffice/inoviced/${invoiceid}`, {
        headers: {
          authtoken: `${token}`,
        },
      })
      console.log(res.data.invoice);
      if (res.data.success) {
        setBill(res.data.invoice)
      }
    } catch (error) {
        console.log(error);
    }
  }

  const UpdateInvoice = async() => {
    try {
      const res = await axios.put(`/api/v1/backoffice/invoiced`, {
        invoiceId: invoiceid,
        roomId: bill.roomId._id,
        list: {
          description: description,
          amount: amount,
          price: price,
          unit: unit,
          meter: "",
          total: amount * price
        }
      }, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setDescription("")
        setAmount(0)
        setPrice(0)
        setUnit("")
        getBillById()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const DeleteList = async(e, listId, index) => {
    try {
      const res = await axios.delete(`/api/v1/backoffice/invoiced/${invoiceid}`, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setTimeout(() => navigate(`/admin/bill-all/${id}`), 1000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e, index, listId) => {
    const { value, name } = e.target;
    setBill((prevBill) => {
      const updatedLists = prevBill.lists.map((listItem, i) => {
        if (i === index) {
          return { ...listItem, [name]: value };
        }
        return listItem;
      });
      return {
        ...prevBill,
        lists: updatedLists,
      };
    });
  };
  
  
  

  const UpdateList = async(e, listId, index) => {
    try {

      // const res = await axios.put(`/api/v1/backoffice/list`, {
      //   description: description,
      //   amount: amount,
      //   price: price,
      //   unit: unit
      // }, {
      //   headers: {
      //     authtoken: `${token}`
      //   }
      // })
      // if (res.data.success) {
      //   setDescription("")
      //   setAmount(0)
      //   setPrice(0)
      //   setUnit("")
      //   getBillById()
      // }
    } catch (error) {
      console.log(error)
    }
  }

  const DeleteInvoice = async() => {
    try {
      const res = await axios.delete(`/api/v1/backoffice/invoiced/${invoiceid}`, {
        headers: {
          authtoken: `${token}`
        }
      })
      if (res.data.success) {
        setTimeout(() => navigate(`/admin/bill-all/${id}`), 1000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBillById()
  }, [])
  return (
    <div className="px-5 py-3 text-colorBlueDark ">
      <div className="text-2xl flex items-center mt-2 font-bold mb-5">
        Invoice# {bill.no}
      </div>
      <div className="grid xl:grid-cols-[68%30%] gap-x-4 overflow-y-auto max-h-[90vh] mb-60">
        <div className="bg-bgForm my-2 rounded-md shadow-md w-full px-4 py-5">
          <div className="flex items-center justify-between" id="header">
            <div className="text-red-600 flex items-center gap-x-1 text-sm cursor-pointer">
              <FaTrashAlt className="h-3 w-3" />
              <div className="hover:underline hover:scale-105 duration-300" onClick={DeleteInvoice}>
                ลบ
              </div>
            </div>
            <div>
              <button className="btn btn-sm bg-colorBlueDark text-bgColor">
                <FaPrint />
                พิมพ์
              </button>
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
                  {bill.invoiceStatus === "paid" ? null : <th>action</th>}
                </tr>
              </thead>
              <tbody>
                {bill.lists?.map((list, index) => (
                  <tr key={index} className="text-center">
                    <th>{index + 1}</th>
                    <td>{buttonSwitch && index >= 3 ? <input type="text" className="input text-center input-bordered w-full max-w-xs btn-sm" name="description" value={list.description} onChange={(e) => handleChange(e, index, list._id)} /> : list.description}</td>
                    <td>
                      {list.meter === null || list.meter === undefined || list.meter === ""
                        ? "-"
                        : list.meter}
                    </td>
                    <td>
                      {buttonSwitch && index >= 3 ? <input type="number" className="input text-center input-bordered w-full max-w-xs btn-sm" value={amount} onChange={(e) => setAmount(e.target.value)} /> : list.amount + " " + list.unit } 
                    </td>
                    <td>
                      {buttonSwitch && index >= 3 ? <input type="number" className="input text-center input-bordered w-full max-w-xs btn-sm" value={price} onChange={(e) => setPrice(e.target.value)} /> : list.price}
                    </td>
                    <td>{list.total}</td>
                    {index >= 3 && bill.invoiceStatus !== "paid" ? (
                      <td className={`flex items-center justify-center gap-x-3 ${buttonSwitch ? " mt-2" : " "}`}>
                        <div className="tooltip" data-tip="แก้ไข">
                          {buttonSwitch ? (
                            <FaCheck className="cursor-pointer hover:scale-110 duration-300 text-green-600" onClick={(e) => { UpdateList(e, list._id, index); setButtonSwitch(false) }}/>
                          ):
                            <FaPen className="cursor-pointer hover:scale-110 duration-300" onClick={(e) => setButtonSwitch(true) }/>
                          }
                        </div>
                        <div className="tooltip" data-tip="ลบ">
                          <ImCross className="cursor-pointer text-red-600 hover:scale-110 duration-300" onClick={(e) => DeleteList(e, list._id, index)}/>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={`text-2xl text-end font-semibold mt-5 ${bill.invoiceStatus === "paid" ? " mb-5" : " "} px-5`}>
            รวมเป็นเงิน {bill.grandTotal} บาท
          </div>
          {bill.invoiceStatus === "paid" ? null : (
            <div className="mt-4 px-1 text-lg mb-5">
              <div className="mb-2">เพิ่มค่าบริการ</div>
              <div className="flex items-center justify-around gap-x-2">
                <div>
                  <div className="text-sm mb-1">ค่าบริการ</div>
                  <labelabel className="input input-bordered max-w-xl w-full flex items-center gap-2">
                    ค่าบริการ
                    <input
                      type="text"
                      className="grow"
                      placeholder="รายละเอียด"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </labelabel>
                </div>
                <div>
                  <div className="text-sm mb-1">ราคา</div>
                  <input
                    type="number"
                    placeholder="ราคา"
                    className="input input-bordered w-[150px] max-w-xs"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">จำนวน</div>
                  <input
                    type="number"
                    placeholder="จำนวน"
                    className="input input-bordered w-[100px] max-w-xs"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">หน่วย</div>
                  <select
                    className="select select-bordered w-[100px] max-w-xs"
                    name="unit"
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option disabled selected>
                      เลือกหน่วย
                    </option>
                    {unitArray.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-6">
                  <button
                    className="btn bg-colorBlueDark text-bgColor"
                    onClick={UpdateInvoice}
                  >
                    <FaPlus />
                    เพิ่ม
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="text-lg mb-2">Note</div>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="เช่น รายละเอียดค่าปรับ"
            ></textarea>
          </div>
        </div>
        <div>
          <div className="bg-bgForm px-4 py-5 my-2 rounded-md shadow-md w-full">
            <div className="flex items-center justify-between">
              <div>ค้างชำระ</div>
              <div
                className={`text-3xl font-bold ${
                  bill.invoiceStatus === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {bill.invoiceStatus === "paid" ? "ชำระแล้ว" : bill.grandTotal}
              </div>
            </div>
          </div>
          <div className="bg-bgForm px-4 py-5 my-2 rounded-md shadow-md border-2 border-green-600">
            <div className="text-lg">รับเงิน</div>
            <div className="grid lg:grid-cols-2 gap-x-2 gap-y-4 items-center">
              <div className="xl:col-span-2">
                <p className="text-sm mb-1">จำนวนเงิน</p>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="number"
                    className="grow text-end px-2"
                    placeholder="จำนวนเงิน"
                  />
                  <div>บาท</div>
                </label>
              </div>
              <div className="xl:col-span-2">
                <p className="text-sm mb-1">
                  ชำระเงินโดย{" "}
                  <span className="text-red-600 text-sm">*จำเป็น</span>
                </p>
                <select
                  className="select select-bordered w-full max-w-sm"
                  required
                >
                  <option disabled selected>
                    วิธีการชำระ
                  </option>
                  <option>เงินสด</option>
                  <option>โอนเงิน</option>
                </select>
              </div>
              <div className="col-span-2">
                <p className="text-sm mb-1">
                  วันที่รับเงิน{" "}
                  <span className="text-red-600 text-sm">*จำเป็น</span>
                </p>
                <input
                  type="date"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  required
                />
              </div>
              <div className="col-span-2">
                <p className="text-sm mb-1">หมายเหตุ</p>
                <textarea className="textarea textarea-bordered w-full"></textarea>
              </div>
            </div>
            <div className="text-center mt-4">
              <p>รับเงินทั้งหมด</p>
              <div className="text-3xl font-bold">{bill.grandTotal}</div>
            </div>
            <div className="mt-5">
              <button className={`btn btn-success w-full text-bgColor text-lg ${bill.invoiceStatus === "paid" ? " btn-disabled" : " "}`}>
                รับเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billdetail;
