import React from 'react'
import { FaCircle } from "react-icons/fa";

const UserHome = () => {
  return (
    <div className="bg-bgForm text-colorBlueDark rounded-lg shadow-md py-3">
    <div className="text-center text-xl">สำหรับผู้เช่า</div>
    <div id="line" className="border-b-2 border-colorBlueDark"></div>
    <div className="mt-3 px-8 overflow-y-scroll max-h-[80vh]">
      <div>
        <div className="relative text-lg">
          หอพักปันใจ{" "}
          <span className="font-thin text-sm">(ห้อง 102)</span>
          <FaCircle className="inline text-red-600" />
          <div className="text-bgColor absolute top-[5.5px] xl:right-[510px] lg:right-[255px] text-sm">
            2
          </div>
        </div>
        <div className="px-6 text-colorBlueGray text-xs">
          122/3 หมู่ 8 ต.จันทึก อ.จันทึก จ.เชียงใหม่ 50200
        </div>
        <div className="flex justify-end items-center gap-x-2 mt-3 mb-14">
          <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
            จัดการห้อง
          </button>
          <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
            บิล
          </button>
          <button className="px-3 py-1 rounded-md bg-colorDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
            แจ้งซ้อม
          </button>
        </div>
      </div>
    </div>
    <div className="w-full px-8">
      <button className="w-full px-3 py-1 rounded-md bg-colorBlueDark text-bgColor font-extralight text-sm font-serif text-center hover:bg-slate-400 hover:scale-110 duration-300 drop-shadow-lg">
        เชื่อมต่อหอพัก
      </button>
    </div>
  </div>
  )
}

export default UserHome