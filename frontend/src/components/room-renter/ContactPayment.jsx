import React, { useEffect, useState } from 'react'
import { paymentType } from '../../utils/admin/paymentType'
import qrCode from '../../assets/images/qrcode.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { GetDormitoryByID } from '../../services/backoffice/dormitorybo';
import { FaCheck } from "react-icons/fa";

const ContactPayment = ({ setNext, contactData, users, list, setList, getRenterDetail, setRoomModal }) => {
    const [payment_type, setPaymentType] = useState("")
    const [totalList, setTotalList] = useState(0)
    const [totalContactDataDeposit, setTotalContactDataDeposit] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [bankAccount, setBankAccount] = useState([]);
    const [dormitory, setDormitory] = useState({});
    const { id } = useParams();
    const [paid, setPaid] = useState(false);   
    const [paidStatus, setPaidStatus] = useState(false);
    const [account, setAccount] = useState("");
    
    const addList = () => {
        setList([...list, {
            name: "",
            price: 0,
        }])
    }

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setList(prevList => prevList.map((item, i) => i === index ? { ...item, [name]: value } : item));
    }

    const removeItem = (indexToRemove) => {
        setList(prevList => prevList.filter((_, index) => index !== indexToRemove));
    }

    const calculatePrice = () => {
        let total = 0;
        list.forEach(item => {
            if (item.price === "") {
                item.price = 0;
            }
            total += parseInt(item.price);
        });
        return total;
    };

    const getBankAccount = async () => {
        try {
            const res = await axios.get(`/api/v1/get-bank/${id}`, {
                headers: {
                    authtoken: `${localStorage.getItem("token")}`,
                },
            });
            const dormitory = await GetDormitoryByID(id)
            if (res.data.success) {
                setBankAccount(res.data.bank);
            }
            if (dormitory) {
                setDormitory(dormitory)
            }
        } catch (error) {
            console.error("Error fetching bank accounts:", error);
        }
    };

    const addAccount = (e) => {
        const { value } = e.target;
        setAccount((prevAccount) => {
            const selectedBank = bankAccount.find((bank) => bank._id === value);
            if (selectedBank) {
                return `${selectedBank.account} ${selectedBank.bank} ${selectedBank.name}`;
            }
            return prevAccount;
        });
    }

    const getDormitoryById = async () => {
        try {
          const res = await GetDormitoryByID(id)
          if (res) {
            setDormitory(res)
          }
        } catch (error) {
          console.log(error);
        }
      }
    

    const handleSubmit = async (e) => {
        try {
            const res = await axios.post(`/api/v1/backoffice/contact-payment`, {
                contactData: {
                    startDate: contactData.startDate,
                    durationInMonth: contactData.durationInMonth,
                    personalId: contactData.personalId,
                    flag: "0",
                    deposit: contactData.deposit,
                    refundAmount: contactData.refundAmount,
                    waterMeter: contactData.waterMeter,
                    electricalMeter: contactData.electricalMeter,
                    note: contactData.note,
                    name: contactData.name,
                    tel: contactData.tel,
                    address: contactData.address,
                    dormitoryId: id,
                    floorId: contactData.floorId,
                    roomId: contactData.roomId,
                },
                contactBill: {
                    list: list,
                    total: totalPrice,
                    paymentType: payment_type,
                    paymentDate: contactData.startDate,
                    account: account,
                    paid: true,
                },
                dormitoryId: id,
            }, {
                headers: {
                    authtoken: `${localStorage.getItem("token")}`,
                },
            })
            if (res.data.success) {
                getRenterDetail();
                getDormitoryById();
                setRoomModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    useEffect(() => {
        const totalPrice = calculatePrice();
        setTotalPrice(totalPrice + totalContactDataDeposit);
        setTotalList(totalPrice);
    }, [list, totalContactDataDeposit]);

    useEffect(() => {
        setTotalContactDataDeposit(contactData.deposit - contactData.refundAmount);
    }, [contactData.deposit, contactData.refundAmount]);

    useEffect(() => {
        getBankAccount()
    }, [])

    console.log(account);

  return (
    <div>
        <div className='px-5 text-colorDark'>
            <div className='grid grid-cols-2 items-center gap-x-10'>
                <div>
                    <div id='header' className='flex items-center justify-between mb-1'>
                        <div className='text-lg'>ข้อมูลสัญญา</div>
                        <div className='text-xs text-bgColor flex gap-x-2'>
                            <button className='bg-bgCyan rounded-md px-1 py-1 hover:bg-slate-400 hover:scale-105 duration-300'>พิมพ์สัญญาเช่า</button>
                            <button className='bg-colorBlueDark rounded-md px-1 py-1 hover:bg-slate-400 hover:scale-105 duration-300'
                            onClick={() => setNext(0)}>แก้ไขข้อมูลสัญญา</button>
                        </div>
                    </div>
                    <div id='table' className='grid grid-cols-[35%_65%] items-center text-sm mb-16'>
                        <div className='border-colorBlueGray border-t-2 border-x-2 py-1 px-2'>ชื่อผู้เข้าพัก</div>
                        <div className='border-colorBlueGray border-t-2 border-e-2 py-1 px-2'>{contactData.name !== "" ? contactData.name : "ไม่มีข้อมูล"}</div>

                        <div className='border-colorBlueGray border-t-2 border-x-2 py-1 px-2'>ที่อยู่ผู้เข้าพัก</div>
                        <div className='border-colorBlueGray border-t-2 border-e-2 py-1 px-2 overflow-x-auto'><div className='truncate'>{contactData.address !== "" ? contactData.address : "ไม่มีข้อมูล"}</div></div>

                        <div className='border-colorBlueGray border-t-2 border-x-2 py-1 px-2'>วันที่ทำสัญญา</div>
                        <div className='border-colorBlueGray border-t-2 border-e-2 py-1 px-2'>{contactData.startDate !== "" ? contactData.startDate : "ไม่มีข้อมูล"}</div>

                        <div className='border-colorBlueGray border-t-2 border-x-2 py-1 px-2'>ระยะเวลาสัญญา</div>
                        <div className='border-colorBlueGray border-t-2 border-e-2 py-1 px-2'>{contactData.durationInMonth !== 0 || contactData.durationInMonth === "" ? contactData.durationInMonth : "ไม่มีข้อมูล"}</div>

                        <div className='border-colorBlueGray border-y-2 border-x-2 py-1 px-2'>วันที่สิ้นสุดสัญญา</div>
                        <div className='border-colorBlueGray border-y-2 border-e-2 py-1 px-2'>{contactData.endDate !== "" ? contactData.endDate : "ไม่มีข้อมูล"}</div>
                    </div>
                    <div className='mb-4'>
                        <div className='text-lg'>ใบเสร็จแรกเข้า</div>
                        <div className='px-3 mb-2'>
                            <p className='text-sm mb-1'>รายละเอียดหัวบิล</p>
                            <select className="select select-bordered w-full max-w-xs select-sm">
                                <option disabled selected>เลือกข้อมูลจากผู้เช่า</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                ))}
                            </select>
                        </div>
                        <div className='px-3 flex items-center text-base gap-x-2'>
                            <div className=''>รายการชำระเงิน</div>
                            <button className='bg-colorBlueDark text-bgColor text-xs rounded-md px-1 py-1 hover:bg-slate-400 hover:scale-105 duration-300'
                            onClick={() => addList()}>เพิ่มรายการ</button>
                        </div>
                        <div className='px-3 text-sm relative overflow-y-auto lg:max-h-20 xl:max-h-28 lg:h-20 xl:h-28'>
                        {list.map((item, index) => (
                            <div className='flex flex-row items-end mb-1 gap-x-2' key={index}>
                                <div>
                                    <p>รายการ</p>
                                    <input type="text" placeholder="รายละเอียด" className="input input-bordered w-full max-w-xs input-sm" name={"name"} value={item.name} onChange={(e) => handleChange(e, index)}/>
                                </div>
                                <div>
                                    <p className=''>จำนวนเงิน (บาท)</p>
                                    <input type="text" placeholder="0" className="input input-bordered w-full max-w-[80px] input-sm" name='price' value={item.price} onChange={(e) => handleChange(e, index)} pattern='[0-9]*'/>
                                </div>
                                <div className=''>
                                    <button className='mb-1 bg-red-600 text-bgColor text-xs rounded-md px-3 py-1 hover:bg-slate-400 hover:scale-105 duration-300' onClick={() => removeItem(index)}>ลบ</button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className='h-full px-10'>
                    <div>
                        <div className='text-lg'>วิธีการชำระเงิน</div>
                        <div className='flex items-center gap-x-2 text-sm mt-2 mb-4'>
                        {paymentType.map((item, index) => {
                            if (item.name !== "บัตรเครดิต") {
                                return (
                                    <div key={index} className='flex items-center gap-x-2'>
                                        <input type="radio" name="type" id="" className="radio radio-xs duration-300" defaultValue={"เงินสด"} value={item.name} onChange={(e) => setPaymentType(e.target.value)}/>
                                        <div>{item.name}</div>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                        </div>
                        <div className='text-center text-base mb-2'>
                            <p className='mb-1'>วันที่รับชำระเงิน<span className='text-red-500'>*</span></p>
                            <div className='bg-colorBlueDark/30 text-colorDark text-sm rounded-md py-1'>{contactData.startDate}</div>
                        </div>
                        {payment_type === "โอนเงิน" ? (
                            <div className='text-center text-base duration-300'>
                                <p className='mb-1'>บัญชีธนาคาร<span className='text-red-500'>*</span></p>
                                <select className="select select-bordered w-full max-w-xs select-sm" onChange={(e) => {setPaid(true); addAccount(e)}}>
                                    <option disabled selected>เลือกบัญชีธนาคาร</option>
                                    {bankAccount.map((bank, index) => (
                                        <option key={index} value={bank._id}>{bank.account + " " + bank.bank + " " + bank.name}</option>
                                    ))}
                                </select>
                                <div className={`flex items-center ${paidStatus === true ? "justify-between" : "justify-end"} mt-3`}>
                                    {paidStatus === true ? <FaCheck className='text-green-700'/> : null}
                                    <button className={`${paid === false ? "cursor-not-allowed bg-colorBlueDark/40": " bg-colorBlueDark text-bgColor hover:bg-slate-400 hover:scale-105"} text-xs rounded-md px-2 py-1 duration-300`} disabled={!paid}
                                    onClick={() => setPaidStatus(true)}>จ่ายแล้ว</button>
                                </div>
                                <div className='text-center mt-3 w-full flex items-center justify-center'>
                                    {/* <img src={qrCode} alt={qrCode} className='w-[180px] h-[180px]' /> */}
                                    <img src={`https://promptpay.io/${dormitory.contact?.tel[0]}/${totalPrice}.png`} alt='qrcode-promptpay' className='w-[180px] h-[180px]'/>
                                </div>
                                <div className='text-center text-green-600 text-lg'>รวมทั้งหมดราคา {totalPrice} บาท</div>
                            </div>
                        ) : 
                        <div className=''>
                            <div className='mt-[120px] mb-10 overflow-y-auto max-h-36'>
                                <div>
                                    <p>หมายเหตุ</p>
                                    <textarea className="textarea textarea-bordered mt-1 w-full textarea-lg" placeholder=""></textarea>
                                </div>
                            </div>
                            <div className='flex items-end justify-end sticky'>
                                <div className='text-green-600 text-lg'>รวมทั้งหมดราคา {totalPrice} บาท</div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="border-b-2 border-colorBlueDark/40 mt-5"></div>
        <div className="text-center mt-2">
            <button className="duration-300 bg-colorBlueDark rounded-md text-bgColor hover:bg-slate-400 px-5 py-2 text-sm"
            onClick={handleSubmit}>ชำระเงิน</button>
      </div>
    </div>
  )
}

export default ContactPayment