import { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import axios from "axios";

const token = localStorage.getItem("token");
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.common["authtoken"] = token;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

import { Bill, BillAll, Home, Login, RenterManagement, UsersManagement, BillDetail, InvoiceForUser, DormitorySetting, DormitoryBank, Repair } from "./routes/index";
import { Register } from "./routes/index";
import { UserDetail } from "./routes/index";
import { Layout } from "./routes/index";
import { DormitoryCreate } from "./routes/index";
import { DormitoryHome } from "./routes/index";
import { RoomsManagement } from "./routes/index";
import { RoomsPrice } from "./routes/index";
import { RoomsMeterPrice } from "./routes/index";
import { DormitoryBankMeter } from "./routes/index";
import { AdminLayout } from "./routes/index";
import AdminRoute from "./routes/protected-route/AdminRoute";
import { RoomManagementBo } from "./routes/index";
import { WaterMeter } from "./routes/index";
import { ElectricalMeter } from "./routes/index";
import Success from "./pages/payment/Success";

function App() {
  const [token, setToken] = useState(null);

  //admin dormitory constance
  const [roomModal, setRoomModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [floorId, setFloorId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [stateManegeBankMeter, setStateManegeBankMeter] = useState(false);
  const [stateManegeRoom, setStateManegeRoom] = useState(false);
  const [stateManegeRoomPrice, setStateManegeRoomPrice] = useState(false);
  const [stateManegeRoomMeterPrice, setStateManegeRoomMeterPrice] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    axios.defaults.headers.common["authtoken"] = storedToken;
  }, [token]);

  return (
    <>
      <div className="bg-bgColor h-screen w-screen max-h-full">
        <Router>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                {/* Loading ... */}
              </div>
            }
          >
            <Routes>

              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user-detail" element={<UserDetail />} />
              <Route path="/success/:id" element={<Success />} />
              <Route path="/invoice/:invoiceid" element={<InvoiceForUser />} />

              {/* Private Pages Create Dormitory */}
              <Route path="/dormitory" element={<Layout />}>
                <Route index element={<DormitoryCreate />} />
                <Route path="home/:id" element={<DormitoryHome />} stateManegeBankMeter={stateManegeBankMeter} stateManegeRoom={stateManegeRoom} stateManegeRoomPrice={stateManegeRoomPrice} stateManegeRoomMeterPrice={stateManegeRoomMeterPrice}/>
                <Route path="bank-meter/:id" element={<DormitoryBankMeter setStateManegeBankMeter={setStateManegeBankMeter}/>} />
                <Route path="rooms-management/:id" element={<RoomsManagement setStateManegeRoom={setStateManegeRoom}/>}/>
                <Route path="rooms-price/:id" element={<RoomsPrice setStateManegeRoomPrice={setStateManegeRoomPrice}/>} />
                <Route path="rooms-meter-price/:id" element={<RoomsMeterPrice setStateManegeRoomMeterPrice={setStateManegeRoomMeterPrice}/>}/>
              </Route>

              {/* Admin Pages */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout
                      roomModal={roomModal}
                      setRoomModal={setRoomModal}
                      roomId={roomId}
                      setRoomId={setRoomId}
                      floorId={floorId}
                      setFloorId={setFloorId}
                      roomName={roomName}
                      setRoomName={setRoomName}
                    />
                  </AdminRoute>
                }
              >
                <Route
                  path="room-management/:id"
                  element={
                    <RoomManagementBo
                      setRoomModal={setRoomModal}
                      setRoomId={setRoomId}
                      setFloorId={setFloorId}
                      setRoomName={setRoomName}
                      roomModal={roomModal}
                    />
                  }
                />
                <Route index path="water-meter/:id" element={<WaterMeter />} />
                <Route path="electrical-meter/:id" element={<ElectricalMeter />}/>
                <Route path="bill/:id" element={<Bill />}/>
                <Route path="bill-all/:id" element={<BillAll />}/>
                <Route path="bill-detail/:id/:invoiceid" element={<BillDetail />}/>
                <Route path="renter-management/:id" element={<RenterManagement />}/>
                <Route path="users-management/:id" element={<UsersManagement />}/>
                <Route path="dormitory-setting/:id" element={<DormitorySetting />}/>
                <Route path="dormitory-bank/:id" element={<DormitoryBank />}/>
                <Route path="repair/:id" element={<Repair />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  );
}

export default App;
