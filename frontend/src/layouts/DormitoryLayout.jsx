import { Outlet, useLocation } from "react-router-dom";
import React, { useEffect } from 'react'
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const DormitoryLayout = ({text}) => {
  let { title } = useSelector((state) => state.titles)
  return (
    <>
        <div className="h-screen w-screen max-h-full">
            <Navbar title={title} />
            {<Outlet />}
        </div>  
    </>
  )
}

export default DormitoryLayout