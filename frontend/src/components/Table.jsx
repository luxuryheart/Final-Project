import React from "react";

const Table = ({rooms, floor}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr className="">
            <th>เลขห้อง</th>
            <th>ชื่อห้องที่ต้องการแก้ไข</th>
            <th>สถานะ</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th></th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
