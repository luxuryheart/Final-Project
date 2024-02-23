import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiPictureInPictureExitFill } from "react-icons/ri";

const ContactDetail = ({ roomId, setRoomModal }) => {
  const [contact, setContact] = useState(null);

  const getContact = async () => {
    try {
      const res = await axios.get(`/api/v1/backoffice/contact/${roomId}`, {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setContact(res.data.contact);
      } else {
        setContact(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CancelContact = async () => {
    try {
      const res = await axios.delete(`/api/v1/backoffice/contact/${contact._id}?roomId=${roomId}`, {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setTimeout(() => setRoomModal(false), 1000)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContact();
  }, []);
  return (
    <div>
        {contact && contact !== null && contact !== undefined ? (
            <div className="px-5 text-colorBlueDark">
              <div className="text-lg mb-2">สัญญา</div>
              <div className='bg-colorBlueDark/30 rounded-t-md py-5 px-5 text-colorDark'>
                <div>รายละเอียดสัญญา</div>
              </div>
              <div className='bg-bgForm border-2 border-colorBlueDark/30 py-3 '>
                <div className="grid grid-cols-2 items-center">
                  <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                    <div className='text-colorDark text-sm px-5 font-bold'>ห้อง</div>
                    <div className='text-colorDark text-sm px-5'>{contact.roomId?.name}</div>
                  </div>
                  <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                    <div className='text-colorDark text-sm px-5 font-bold'>วันที่เริ่มต้นสัญญา</div>
                    <div className='text-colorDark text-sm px-5'>{contact.contactStartDate ? new Date(contact.contactStartDate).toLocaleDateString() : ''}</div>
                  </div>
                  <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                    <div className='text-colorDark text-sm px-5 font-bold'>ค่าห้อง</div>
                    <div className='text-colorDark text-sm px-5'>{parseFloat(contact.roomId?.roomCharge).toFixed(2)} บาท</div>
                  </div>
                  <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                    <div className='text-colorDark text-sm px-5 font-bold'>ระยะเวลาสัญญา</div>
                    <div className='text-colorDark text-sm px-5'>{contact.rangeContact} เดือน</div>
                  </div>
                  <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                    <div className='text-colorDark text-sm px-5 font-bold'>เงินประกัน</div>
                    <div className='text-colorDark text-sm px-5'>{parseFloat(contact.deposit).toFixed(2)} บาท</div>
                  </div>
                  <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                    <div className='text-colorDark text-sm px-5 font-bold'>วันที่สิ้นสุดสัญญา</div>
                    <div className='text-colorDark text-sm px-5'>{contact.contactEndDate ? new Date(contact.contactEndDate).toLocaleDateString() : ''}</div>
                  </div>
                  <div>
                    <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                      <div className='text-colorDark text-sm px-5 font-bold'>มิเตอร์น้ำวันเข้าพัก</div>
                      <div className='text-colorDark text-sm px-5'>{parseFloat(contact.waterMeter).toFixed(2)} หน่วย</div>
                    </div>
                    <div className='grid grid-cols-2 items-center mb-2 max-w-[300px]'>
                      <div className='text-colorDark text-sm px-5 font-bold'>มิเตอร์ไฟวันเข้าพัก</div>
                      <div className='text-colorDark text-sm px-5'>{parseFloat(contact.electricalMeter).toFixed(2)} หน่วย</div>
                    </div>
                  </div>
                </div>
                </div>
              <div className="bg-colorBlueDark/30 py-5 px-5 text-colorDark">
                <div>ผู้เช่า</div>
              </div>
              <div>
              <div className="overflow-x-auto text-colorBlueDark font-semibold bg-bgForm border-2 border-colorBlueDark/30">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="w-5"></th>
                        <th>ชื่อ - นามสกุล</th>
                        <th>เบอร์โทรศัพท์</th>
                        <th>email</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <img src={contact?.userId?.profile?.img} alt="Avatar Tailwind CSS Component" />
                            </div>
                          </div>
                        </td>
                        <td>
                          {contact?.name}
                        </td>
                        <td>{contact?.tel}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-2 text-end">
                <button class="btn btn-sm bg-red-600 text-bgColor font-serif" onClick={CancelContact}><RiPictureInPictureExitFill />ยกเลิกสัญญา / ย้ายออก</button>
              </div>
            </div>
        ):(
            <div className="text-2xl text-center mt-10 text-colorBlueGray">ยังไม่มีสัญญา</div>
        )}
    </div>
    );
};

export default ContactDetail;
