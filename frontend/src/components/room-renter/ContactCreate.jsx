import React, { useState, useEffect } from 'react'
import { rangeMonth } from '../../utils/admin/rangeContactDate';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContactCreate = ({ next, setNext, contactData, setContactData, users }) => {
    const [meters, setMeters] = useState({});
    const { id } = useParams()
    const token = localStorage.getItem("token");
    const [usersConnect, setUsersConnect] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactData((prevContactData) => ({
          ...prevContactData,
          [name]: value,
        }));
    }

    const handleSelect = (e) => {
        const { value } = e.target;
        const selectedUser = usersConnect.find((user) => user.username === value);
        if (selectedUser) {
            setContactData((prevContactData) => ({
                ...prevContactData,
                name: selectedUser.profile.firstname + " " + selectedUser.profile.lastname,
                userId: selectedUser._id,
                personalId: selectedUser.personalId,
                tel: selectedUser.tel,
                address: selectedUser.address?.address + " " + selectedUser.address?.province + " " + selectedUser.address?.district + " " + selectedUser.address?.sub_district + " " + selectedUser.address?.zipcode
            }));
        }
    }
    const currentDate = () => {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 3); 
    
        const formattedToday = today.toISOString().slice(0, 10);
        const formattedMaxDate = maxDate.toISOString().slice(0, 10);
    
        setContactData((prevContactData) => ({
            ...prevContactData,
            startDate: formattedToday ? formattedToday : formattedMaxDate,
            endDate: formattedMaxDate,
        }));
    }

    const handleSelectDate= (e) => {
        const { value, name } = e.target;
        if (name === "startDate") {
            const startDate = new Date(value);
            const durationInMonths = parseInt(contactData.durationInMonth);
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + durationInMonths));

            setContactData((prevContactData) => ({
                ...prevContactData,
                startDate: value,
                endDate: endDate.toISOString().slice(0, 10),
            }))
        } else if (name === "durationInMonth") {
            const startDate = new Date(contactData.startDate); 
            const durationInMonths = parseInt(value); 
    
            const endDate = new Date(startDate.setMonth(startDate.getMonth() + durationInMonths));
    
            setContactData((prevContactData) => ({
                ...prevContactData,
                durationInMonth: value,
                endDate: endDate.toISOString().slice(0, 10),
            }));
        }

    }

    const getMeter = async() => {
        try {
          const res = await axios.get(`/api/v1/get-meter-by-dormitory/${id}`, {
            headers: {
              authtoken: `${token}`,
            },
          })
          if (res.data.success) { 
            setMeters(res.data.meters)
          }
        } catch (error) {
          console.log(error);
        }
      }

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
    }

    useEffect(() => {
        currentDate()
        getMeter()
        getUserInDormitory()
    }, [])
    
  return (
    <div className=''>
        <div className='px-5 text-colorDark overflow-y-auto lg:max-h-[55vh] xl:max-h-[60vh]'>
            <div className='mb-2'>
                <p className='mb-1'>กรุณากรอกรายละเอียดสัญญาเช่า</p>
                <select className="select select-bordered w-full max-w-full select-sm" onChange={handleSelect}>
                    <option disabled selected>เลือกข้อมูลจากผู้เช่า</option>
                    {usersConnect.map((user, index) => (
                        <option value={user.username} key={index}>{user.username}</option>
                    ))}
                </select>
            </div>
            <div className='mb-2'>
                <div className='grid grid-cols-[25%_45%_27%] gap-x-3 w-full text-sm mb-2'>
                    <div>
                        <p className='mb-1'>ชื่อผู้เข้าพัก</p>
                        <input type="text" placeholder="ชื่อ - นามสกุล" name='name' value={contactData.name} className="input input-bordered w-full max-w-full" onChange={(e) => handleChange(e)}/>
                    </div>
                    <div>
                        <p className='mb-1'>เลขบัตรประจำตัวประชาชน</p>
                        <input type="text" placeholder="1-1xxx-xxxx-xxxx" name='personalId' value={contactData.personalId} className="input input-bordered w-full max-w-full" onChange={(e) => handleChange(e)}/>
                    </div>
                    <div>
                        <p className='mb-1'>เบอร์โทรศัพท์</p>
                        <input type="text" placeholder="0xx-xxxx-xxx" name='tel' value={contactData.tel} onChange={(e) => handleChange(e)} className="input input-bordered w-full max-w-full" />
                    </div>
                </div>
            </div>
            <div className='mb-2 text-sm'>
                <p className='mb-1'>ที่อยู่ผู้เข้าพัก</p>
                <input type="text" placeholder="122/3 หมู่ x ต. xxx อ. xxx จ. xxx" name='address' value={contactData.address} onChange={(e) => handleChange(e)} className="input input-bordered w-full max-w-full" />
            </div>
            <div className='grid grid-cols-[25%_25%_25%_15%] items-center gap-x-3 mb-2 text-sm'>
                <div className=''>
                    <p className='mb-1'>วันที่ทำสัญญา</p>
                    <input type="date" placeholder="ว/ด/ป" name='startDate' value={contactData.startDate} onChange={(e) => handleSelectDate(e)} className="input input-bordered w-full max-w-full input-sm" />
                </div>
                <div className=''>
                    <p className='mb-1'>ระยะเวลาสัญญา</p>
                    <select className="select select-bordered w-full max-w-full select-sm" name='durationInMonth' onChange={(e) => handleSelectDate(e)}>
                        <option disabled selected>เลือกระยะเวลา</option>
                        {rangeMonth.map((item, index) => (
                            <option value={item.amount} key={index}>{item.amount} เดือน</option>
                        ))}
                    </select>
                </div>
                <div className=''>
                    <p className='mb-1'>วันที่สิ้นสุดสัญญา</p>
                    <input type="date" placeholder="ว/ด/ป" name='endDate' value={contactData.endDate} onChange={(e) => handleChange(e)} className="input input-bordered w-full max-w-full input-sm" />
                </div>
            </div>
            <div className='grid grid-cols-[25%_25%_50%] items-center gap-x-3 mb-2 text-sm'>
                <div className=''>
                    <p className='mb-1'>เงินประกันบาท (บาท)</p>
                    <input type="text" placeholder="0" name='deposit' value={contactData.deposit} onChange={(e) => handleChange(e)} className="input input-bordered w-full max-w-full" />
                </div>
                <div className=''>
                    <p className='mb-1'>หักจากค่าจอง (บาท)</p>
                    <input type="text" placeholder="0" name='refundAmount' value={contactData.refundAmount} onChange={(e) => handleChange(e)} id='' className="input input-bordered w-full max-w-full" />
                </div>
            </div>
            <div className='flex items-center text-sm gap-x-2 mb-4'>
                <input type="checkbox" name="haveDeposit" value={contactData.haveDeposit} onChange={(e) => handleChange(e)} id="" className=''/>
                <div>มีค่าจองห้องพัก</div>
            </div>
            <div>
                <p>สัญญาสำหรับผู้เข้าพักใหม่ (ระบบจะใช้เลขมิเตอร์แรกเข้าในการคำนวณเงิน)</p>
                <div className='grid grid-cols-2 items-center gap-x-10 mt-1 mb-2'>
                    <select className="select select-bordered w-full max-w-sm select-sm mb-2" name={"waterTypeId"} onChange={(e) => handleChange(e)}>
                        <option disabled selected>เลือกประเภทค่าน้ำ</option>
                        {meters.waterMeter && meters.waterMeter.map((item, index) => (
                            <option value={item._id} key={index}>{item.name}</option>
                        ))}
                    </select>
                    <select className="select select-bordered w-full max-w-sm select-sm mb-2" name='electricalTypeId' onChange={(e) => handleChange(e)}>
                        <option disabled selected>เลือกประเภทค่าน้ำ</option>
                        {meters.electricalMeter && meters.electricalMeter.map((item, index) => (
                            <option value={item._id} key={index}>{item.name}</option>
                        ))}
                    </select>
                    <div>
                        <p className='text-sm mb-1'>เลขมิเตอร์น้ำประปา (เข้าพัก)</p>
                        <input type="text" placeholder="0" name='waterMeter' value={contactData.waterMeter} onChange={(e) => handleChange(e)} className="input input-bordered w-full max-w-xl input-sm" />
                    </div>
                    <div>
                        <p className='text-sm mb-1'>เลขมิเตอร์ไฟฟ้า (เข้าพัก)</p>
                        <input type="text" placeholder="0" name='electricalMeter' value={contactData.electricalMeter} onChange={(e) => handleChange(e)} className="input input-bordered w-full max-w-xl input-sm" />
                    </div>
                </div>
                <textarea className="textarea textarea-bordered w-full" name="note" value={contactData.note} onChange={(e) => handleChange(e)} placeholder="หมายเหตุ"></textarea>
            </div>
        </div>
        <div className="border-b-2 border-colorBlueDark/40 mt-5"></div>
        <div className="text-center mt-2">
            <button className="duration-300 bg-colorBlueDark rounded-md text-bgColor hover:bg-slate-400 px-5 py-2 text-sm"
            onClick={() => setNext(1)}>ต่อไป</button>
      </div>
    </div>
  )
}

export default ContactCreate