export const menu = [
    {
        name: "ข้อมูลห้องพัก",
        path: "room-management",
    },
    {
        name: "แจ้งซ่อม",
        path: "repair",
    },
    {
        name: "จดมิเตอร์",
        path: "water-meter" || "electric-meter",
    },
    {
        name: "บิล",
        path: "bill",
    },
    {
        name: "ข้อมูลผู้ใช้",
        path: "renter-management",
    },
    {
        name: "ข้อมูลหอพัก",
        path: "dormitory-setting",
    },
    {
        name: "หน้าหลัก",
        path: "/",
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
    },
    {
        name: "ข้อมูลผู้ใช้",
        submenu: [
            {subname: "ผู้เช่า", path: "renter-management"},
            {subname: "ผู้ใช้งานทั่วไป", path: "users-management"},
        ],
        open: false,
    },
    {
        name: "บิล",
        submenu: [
            {subname: "จ่ายบิล", path: "bill"},
            {subname: "บิลทั้งหมด", path: "bill-all"},
        ],
        open: false,
    },
    {
        name: "ข้อมูลหอพัก",
        submenu: [
            {subname: "หอพัก", path: "dormitory-setting"},
            {subname: "บัญชีธนาคาร", path: "dormitory-bank"},
        ],
        open: false,
    }
]