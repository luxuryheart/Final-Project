import React from "react";

// TODO: ทำฟังก์ชั่น update renter detail 
const RenterDetail = () => {
  return (
    <div className="">
      <div className="mb-1 px-5">
        ข้อมูลเพิ่มเติม{" "}
        <span className="text-red-500 text-xs">*ไม่จำเป็นต้องกรอกทุกช่อง</span>
      </div>
      <div className="overflow-y-auto max-h-[50vh] px-5">
        <div className="flex items-center justify-around gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>Email</p>
            <input
              type="text"
              placeholder="กรอก Email"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
          <div className="text-sm w-full">
            <p>Facebook</p>
            <input
              type="text"
              placeholder="กรอกชื่อ Facebook"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
          <div className="text-sm w-full">
            <p>Line ID</p>
            <input
              type="text"
              placeholder="กรอก Line ID"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
        </div>
        <div className="flex items-center justify-around gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>สถานบันการศึกษา / สถานที่ทำงานปัจจุบัน</p>
            <input
              type="text"
              placeholder="กรอกชื่อสถานบันการศึกษา / สถานที่ทำงานปัจจุบัน"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
          <div className="text-sm w-full">
            <p>คณะ / แผนก</p>
            <input
              type="text"
              placeholder="กรอกคณะ / แผนก"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-[40%_35%_25%] gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>ชั้นปี / ตำแหน่ง</p>
            <input
              type="text"
              placeholder="กรอกชั้นปี / ตำแหน่ง"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
          <div className="text-sm w-full">
            <p>รหัสนักศึกษา</p>
            <input
              type="text"
              placeholder="กรอกรหัสนักศึกษา"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-[45%_25%_25%] gap-x-3 mb-2">
          <div className="text-sm w-full">
            <p>บุคคลที่สามารถติดต่อได้ในกรณีฉุกเฉิน</p>
            <input
              type="text"
              placeholder="ชื่อ - นามสกุล"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
          <div className="text-sm w-full">
            <p>ความสัมพันธ์</p>
            <input
              type="text"
              placeholder="เช่น บิดา"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
          <div className="text-sm w-full">
            <p>เบอร์โทรศัพท์</p>
            <input
              type="text"
              placeholder="08x-xxx-xxxx"
              className="input input-bordered w-full max-w-lg"
            />
          </div>
        </div>
        <div className="mb-2">
            <div className="text-sm">
                <div className="flex gap-x-2 items-center mb-1">
                    <p>ยานพาหนะที่นำมาใช้</p>
                    <button className="duration-300 bg-colorBlueDark rounded-md text-bgColor hover:bg-slate-400 px-3 py-1 text-xs">เพิ่ม</button>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-x-3">
                        <div className="text-base w-1/4 grid grid-cols-[50%_80%] items-center gap-x-3">
                            <div>คันที่ {1}</div>
                            <select name="" id="" className="text-xs px-2 py-1 border rounded-md bg-slate-100 duration-300">
                                <option value="">0</option>
                            </select>
                        </div>
                        <div className="w-2/4 ml-20">
                            <input type="text" placeholder="ทะเบียนรถ" className="input input-bordered w-full max-w-xs input-sm" />
                        </div>
                        <div className="w-full">
                            <input type="text" placeholder="รายละเอียด" className="input input-bordered w-full max-w-xs input-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p className="text-sm">หมายเหตุ</p>
            <textarea className="textarea textarea-bordered w-full" placeholder=""></textarea>
        </div>
      </div>
      <div className="border-b-2 border-colorBlueDark/40 mt-5"></div>
      <div className="text-center mt-2">
        <button className="duration-300 bg-colorBlueDark rounded-md text-bgColor hover:bg-slate-400 px-4 py-2 text-sm">แก้ไข</button>
      </div>
    </div>
  );
};

export default RenterDetail;
