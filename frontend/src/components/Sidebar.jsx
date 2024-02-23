import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import { menu } from "../utils/sidebar";
import { subMenu } from "../utils/sidebar";

// Icon
import { MdDashboard } from "react-icons/md";
import { PiListDashesFill } from "react-icons/pi";
import { FaTachometerAlt } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BiSolidUserAccount } from "react-icons/bi";
import { MdOutlineApartment } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaPowerOff } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaScrewdriverWrench } from "react-icons/fa6";

const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dormitory, setDormitory] = useState({});
  let location = useLocation();
  const path = location.pathname.split("/").slice(2);
  const [subMenuState, setSubMenuState] = useState(
    subMenu.map((item) => ({ name: item.name, open: item.open }))
  );

  const getDormitoryById = async () => {
    try {
      const res = await axios.get(`/api/v1/get-all-rooms/${id}`);
      if (res.data.success) {
        setDormitory(res.data.dormitoryDetail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenSubmenu = (e, itemName, path) => {
    e.preventDefault();
    setSubMenuState((prevState) =>
      prevState.map((item) => ({
        name: item.name,
        open: item.name === itemName ? !item.open : item.open,
      }))
    );
    if (itemName === "หน้าหลัก") {
      navigate(`${path}`);
    } else {
      navigate(`${path}/${id}`);
    }
  };

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    getDormitoryById();
  }, []);

  return (
    <div className="h-screen bg-colorBlueDark text-bgColor lg:w-full md:w-1/5">
      <div className="flex flex-col items-center justify-between h-screen">
        <div className="xl:w-full lg:w-full md:w-full">
          <div className="flex flex-col items-center justify-center mt-5 mb-5 relative">
            <div className="indicator">
              <div className="text-2xl">{dormitory.name}</div>
              <FaCircle className="h-2 w-2 text-green-500 indicator-item " />
            </div>
            <div className="text-sm absolute top-6">BACKOFFICE</div>
          </div>
          <div className="border-b-2 border-bgColor/70 w-full"></div>
          {menu.map((item, index) => (
            <div key={index} className="mt-2 px-4">
              <div
                className={`hover:bg-bgColor/60 hover:text-colorDark cursor-pointer ${
                  (path[0] === item.path && path[0] === "water-meter") || (item.name === "จดมิเตอร์" && path[0] === "electrical-meter")
                    ? "bg-colorBlueGray/60 rounded-sm text-colorDark"
                    : (path[0] === item.path && path[0] == "bill") || (item.name === "บิล" && path[0] == "bill-all") 
                    ? "bg-colorBlueGray/60 rounded-sm text-colorDark" 
                    : (path[0] === item.path && path[0] == "dormitory-setting") || (item.name === "ข้อมูลหอพัก" && path[0] == "dormitory-bank") || (item.name === "ข้อมูลหอพัก" && path[0] == "dormitory-meter") 
                    ? "bg-colorBlueGray/60 rounded-sm text-colorDark"
                    : (path[0] === item.path && path[0] == "users-management") || (item.name === "ข้อมูลผู้ใช้" && path[0] == "renter-management")
                    ? "bg-colorBlueGray/60 rounded-sm text-colorDark"
                    : path[0] === item.path
                    ? "bg-bgColor rounded-e-full text-colorDark"
                    : " "
                } hover:rounded-e-full py-1 px-1 duration-300 flex items-center justify-between gap-x-1`}
                onClick={(e) => handleOpenSubmenu(e, item.name, item.path)}
              >
                <div className="flex items-center gap-x-1 px-1">
                  {item.name === "Dashboard" ? (
                    <MdDashboard className="h-5 w-5" />
                  ) : item.name === "ข้อมูลห้องพัก" ? (
                    <PiListDashesFill className="h-5 w-5" />
                  ) : item.name === "ข้อมูลผู้ใช้" ? (
                    <BiSolidUserAccount className="h-5 w-5" />
                  ) : item.name === "จดมิเตอร์" ? (
                    <FaTachometerAlt className="h-5 w-5" />
                  ) : item.name === "บัญชี" ? (
                    <FaMoneyCheckAlt className="h-5 w-5" />
                  ) : item.name === "ข้อมูลหอพัก" ? (
                    <MdOutlineApartment className="h-5 w-5" />
                  ) : item.name === "รายงาน" ? (
                    <TbReportSearch className="h-5 w-5" />
                  ) : item.name === "หน้าหลัก" ? (
                    <IoHome />
                  ) : item.name === "แจ้งซ่อม" ? (
                    <FaScrewdriverWrench />
                  ) : <RiBillLine />  
                  }
                  <div className="inline">{item.name}</div>{" "}
                </div>{" "}
                {subMenuState.map((subItem, subIndex) => {
                  if (item.name === subItem.name) {
                    return subItem.open ? (
                      <IoIosArrowUp className="inline" key={subIndex}/>
                    ) : (
                      <IoIosArrowDown className="inline" key={subIndex}/>
                    );
                  }
                })}
              </div>
              {subMenu.map((submenu, index) => {
                return subMenuState.map((subItem, subIndex) => {
                  if (
                    item.name === submenu.name &&
                    subItem.name === submenu.name &&
                    subItem.open
                  ) {
                    return submenu.submenu.map((subSubItem, subSubIndex) => (
                      <div
                        onClick={() =>
                          // navigate(
                          //   `${
                          //     item.path === "meter"
                          //       ? + "meter/" + subSubItem.path + "/" + id
                          //       : " "
                          //   }`
                          // )
                          navigate(`${subSubItem.path}/${id}`)
                        }
                        className={`px-4 mt-[6px] text-bgColor flex flex-row items-center cursor-pointer hover:bg-bgColor/60 hover:text-colorDark hover:rounded-e-full duration-300 ${
                          path[0] === subSubItem.path 
                            ? " bg-bgColor rounded-e-full text-colorDark"
                            : ""
                        }`}
                        key={subSubIndex}
                      >
                        <div className="flex items-center gap-x-1" key={index}>
                          <FaRegCircle className="h-3 w-3 text-colorBlueGray font-bold" />
                          {subSubItem.subname}
                        </div>
                      </div>
                    ));
                  }
                  return null;
                });
              })}
            </div>
          ))}
        </div>
        <div className="bottom-0 w-full">
          <div className="border-b-2 border-bgColor/70 w-full"></div>
          <div
            className="flex items-center justify-center gap-x-1 cursor-pointer py-3 hover:bg-colorBlueGray/60 duration-300"
            onClick={Logout}
          >
            <FaPowerOff className="text-red-500" />
            ออกจากระบบ
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
