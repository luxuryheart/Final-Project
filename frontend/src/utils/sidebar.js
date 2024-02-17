export const menu = [
    // {
    //     name: "Dashboard",
    //     path: "dashboard",
    //     // icon: <MdDashboard />,
    // },
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
        name: "บิล",
        path: "bill",
        // icon: <RiBillLine />,
    },
    {
        name: "ข้อมูลผู้ใช้",
        path: "user-management",
        // icon: <BiSolidUserAccount />,
    },
    // {
    //     name: "บัญชี",
    //     path: "account",
    //     // icon: <FaMoneyCheckAlt />,
    // },
    {
        name: "ข้อมูลหอพัก",
        path: "dormitory-setting",
        // icon: <MdOutlineApartment />,
    },
    // {
    //     name: "รายงาน",
    //     path: "report",
    //     // icon: <TbReportSearch />,
    // },
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
            {subname: "ผู้เช่า", path: "user-management"},
            {subname: "พนักงาน", path: "employee-management"},
        ],
        open: false,
        path: "/",
        // icon: <FaRegCircle />,
    },
    {
        name: "บิล",
        submenu: [
            {subname: "จ่ายบิล", path: "bill"},
            {subname: "บิลทั้งหมด", path: "bill-all"},
        ],
        open: false,
        path: "/",
        // icon: <FaRegCircle />,
    },
]