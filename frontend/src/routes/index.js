import {lazy} from "react"

export const Login = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/login/Login")), 1000);
    })
);
export const Register = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/register/Register")), 1000);
    })
);
export const UserDetail = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/user-detail/UserDetail")), 1000);
    })
);
export const Layout = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../layouts/DormitoryLayout")), 1000);
    })
);
export const DormitoryCreate = lazy(
    () =>
        new Promise((resolve) => {
            setTimeout(() => resolve(import("../pages/dormitory-create/DormitoryCreate")), 1000);
        })
);
export const Home = lazy(
    () =>
        new Promise((resolve) => {
            setTimeout(() => resolve(import("../pages/home/Home")), 1000);
        })
);
export const DormitoryHome = lazy(
    () =>
        new Promise((resolve) => {
            setTimeout(() => resolve(import("../pages/dormitory-home/DormitoryHome")), 1000);
        })
);
export const RoomsManagement = lazy(
    () =>
        new Promise((resolve) => {
            setTimeout(() => resolve(import("../pages/rooms-management/RoomsManagement")), 1000);
        })
);
export const RoomsPrice = lazy(
  () => 
      new Promise((resolve) => {
        setTimeout(() => resolve(import("../pages/rooms-price/RoomsPrice")), 1000);
      })
)
export const RoomsMeterPrice = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/room-meter-price/RoomMeterPrice")), 1000);
    })
)

export const DormitoryBankMeter = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/dormitory-manage-bank-meter/DormitoryBankMeter")), 1000);
    })
)

// admin
export const AdminLayout = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../layouts/AdminLayout")), 1000);
    })
)

export const Dashboard = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/dashboard/Dashboard")), 1000);
    })
)

export const RoomManagementBo = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/room-management/RoomManagement")), 1000);
    })
)

// Meter
export const MeterLayout = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/meter/MeterLayout")), 1000);
    })
)

export const WaterMeter = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/meter/WaterMeter")), 1000);
    })
)

export const ElectricalMeter = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/meter/ElectricalMeter")), 1000);
    })
)

export const Bill = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/bill/Bill")), 1000);
    })
)

export const BillAll = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/bill/BillAll")), 1000);
    })
)

export const BillDetail = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/bill/Billdetail")), 1000);
    })
)

export const RenterManagement = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/user-management/RenterManagement")), 1000);
    })
)

export const UsersManagement = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/user-management/UsersManagement")), 1000);
    })
)

export const InvoiceForUser = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/payment/InvoiceForUser")), 1000);
    })
)

export const DormitorySetting = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/dormitory-setting/DormitorySetting")), 1000);
    })
)

export const DormitoryBank = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/dormitory-setting/DormitoryBank")), 1000);
    })
)

export const Repair = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("../pages/admin/repair/Repair")), 1000);
    })
)

// export const DormitoryMeter = lazy(
//   () =>
//     new Promise((resolve) => {
//       setTimeout(() => resolve(import("../pages/dormitory-setting/DormitoryMeter")), 1000);
//     })
// )
