import React from 'react'
import { SiHotelsdotcom } from "react-icons/si";
import { IoHome } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";

const HomeNav = ({userDetail, setOpenModal, openModal, setListModal}) => {
  return (
    <div className="bg-colorBlueDark h-16 w-full">
      <div className="flex justify-between items-center h-full px-10">
        <SiHotelsdotcom className="h-7 w-7 text-bgColor cursor-pointer" />
        <div className="flex gap-3 items-center">
          <button className="tooltip tooltip-left" data-tip="รายชื่อหอ" onClick={() => setListModal(true)}>
            <FaClipboardList className="h-5 w-5 text-bgColor cursor-pointer" />

          </button>
          <div className="bg-slate-300 h-8 w-40 rounded-e-full flex justify-between border-none">
            <div className="px-2 text-xs h-full relative">
              <div className="text-base font-mono font-semibold absolute -top-0">
                {userDetail.profile?.firstname}
              </div>
              <div className="text-xs absolute top-4 flex items-center">
                {userDetail && userDetail.status && (
                  <FaCircle
                    className={`mr-[2px] mt-[2px] h-2 w-2
                    ${
                      userDetail.status?.status === "active"
                        ? " text-green-500"
                        : " text-slate-500"
                    }
                    `}
                  />
                )}
                <div className="font-base">{userDetail?.role?.name}</div>
              </div>
            </div>
            <div className='flex items-center justify-end'>
              <img src={userDetail.profile?.img === "" ? "https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Prescription02&facialHairType=Blank&clotheType=ShirtScoopNeck&clotheColor=PastelRed&eyeType=Side&eyebrowType=RaisedExcited&mouthType=Vomit&skinColor=Brown" : userDetail.profile?.img} className="h-12 w-12 text-colorDark cursor-pointer shadow-lg mb-2" onClick={() => setOpenModal(!openModal)}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeNav