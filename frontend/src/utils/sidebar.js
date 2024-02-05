export const menu = [
    {
        name: "Dashboard",
        path: "dashboard",
        // icon: <MdDashboard />,
    },
    {
        name: "ข้อมูลห้องพัก",
        path: "room-management",
        // icon: <PiListDashesFill />,
    },
    {
        name: "จดมิเตอร์",
        path: "water-meter" || "electric-meter",
        // icon: <FaTachometerAlt />,
    },
    {
        name: "บัญชี",
        path: "account",
        // icon: <FaMoneyCheckAlt />,
    },
    {
        name: "ข้อมูลผู้ใช้",
        path: "users-detail",
        // icon: <BiSolidUserAccount />,
    },
    {
        name: "ข้อมูลหอพัก",
        path: "dormitory-detail",
        // icon: <MdOutlineApartment />,
    },
    {
        name: "จ่ายบิล",
        path: "bill",
        // icon: <RiBillLine />,
    },
    {
        name: "รายงาน",
        path: "report",
        // icon: <TbReportSearch />,
    },
    {
        name: "หน้าหลัก",
        path: "/",
        // icon: <FaPowerOff />,
    } 
]

export const subMenu = [
    {
        name: "จดมิเตอร์",
        submenu: [
            {subname: "มิเตอร์น้ำ", path: "water-meter"},
            {subname: "มิเตอร์ไฟ", path: "electrical-meter"},
        ],
        open: false,
        // icon: <FaRegCircle />,
    },
    {
        name: "ข้อมูลผู้ใช้",
        submenu: [
            {subname: "ผู้เช่า", path: "renter-detail"},
            {subname: "พนักงาน", path: "employee-detail"},
        ],
        open: false,
        path: "/",
        // icon: <FaRegCircle />,
    },
]