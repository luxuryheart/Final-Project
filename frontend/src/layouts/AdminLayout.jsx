import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RoomModal from "../components/RoomModal";

const AdminLayout = ({roomModal,setRoomModal,roomId,setRoomId,floorId,setFloorId,roomName,setRoomName,}) => {
  return (
    <>
      <div className="h-screen w-screen max-h-screen max-w-screen">
        {roomModal && (
          <RoomModal
            setRoomModal={setRoomModal}
            roomId={roomId}
            setRoomId={setRoomId}
            floorId={floorId}
            setFloorId={setFloorId}
            roomName={roomName}
            setRoomName={setRoomName}
          />
        )}
        <div className="grid lg:grid-cols-[20%80%] xl:grid-cols-[15%85%]">
          <Sidebar />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
