import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTitle } from "../../store/titleSlice";
import { manageDetail } from "../../utils/data/dormitory-home/data";
import { Link, useParams } from 'react-router-dom';

const DormitoryHome = ({ stateManegeBankMeter, stateManegeRoom, stateManegeRoomPrice, stateManegeRoomMeterPrice }) => {
  const dispatch = useDispatch();
  const text = "สร้างหอพัก";

  const { id } = useParams();

  useEffect(() => {
    dispatch(getTitle(text));
  }, [text]);
  return (
    <div className="container mx-auto">
        <div className="mt-24">
      {manageDetail.map((detail, i) => (
        <div className="flex items-center justify-between mb-5 mx-10 sm:mx-28 md:mx-48 lg:mx-60 xl:mx-96" key={i}>
          <div id="manage-room">
            <div className="flex flex-row gap-2 items-center justify-center">
                <div className="relative w-6 h-6">
                    <div className="absolute inset-0 text-center text-base text-bgColor rounded-full bg-colorBlueDark">{i+1}</div>
                </div>
              <div>{detail.name}</div>
            </div>
          </div>
          <Link to={detail.link+id}>
            <button className="px-3 py-1 rounded-lg bg-colorBlueDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
              ตั้งค่า
            </button>
          </Link>
        </div>
      ))}
      <Link className={`flex items-center justify-center mt-40 `} to={"/"}>
        <button className={`btn bg-colorBlueDark text-bgColor w-full max-w-lg `}>เสร็จสิ้น</button>
      </Link>
    </div>
    </div>
  );
};

export default DormitoryHome;
