import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <>
      <div className="h-screen w-screen max-h-screen max-w-screen">
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
