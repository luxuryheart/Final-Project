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
      setTimeout(() => resolve(import("../pages/register/register")), 1000);
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
