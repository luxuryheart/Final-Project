import { Suspense, useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom' 
import axios from "axios"


const token = localStorage.getItem('token')
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['authtoken'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

import { Home, Login } from "./routes/index"
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
import { Dashboard } from "./routes/index";
import AdminRoute from "./routes/protected-route/AdminRoute";
import { RoomManagementBo } from "./routes/index";
import { WaterMeter } from "./routes/index";
import { ElectricalMeter } from "./routes/index";
import { MeterLayout } from "./routes/index";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    axios.defaults.headers.common['authtoken'] = storedToken;
  }, [token]);
  return (
    <>
      <div className="bg-bgColor h-screen w-screen max-h-full">
        <Router>
          {/* <Suspense> */}
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading ...</div>}>
            <Routes>
              {/* <Route path="/admin/*" element={<Layout />}/> */}

              {/* Public Pages */}
              <Route path="/" element={<Home />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/user-detail" element={<UserDetail />}/>

              {/* Private Pages Create Dormitory */}
              <Route path="/dormitory" element={<Layout />}>
                <Route index element={<DormitoryCreate />}/>
                <Route path="home/:id" element={<DormitoryHome />}/>
                <Route path="bank-meter/:id" element={<DormitoryBankMeter />}/>
                <Route path="rooms-management/:id" element={<RoomsManagement />}/>
                <Route path="rooms-price/:id" element={<RoomsPrice />}/>
                <Route path="rooms-meter-price/:id" element={<RoomsMeterPrice />}/>
              </Route>

              {/* Admin Pages */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route path="dashboard/:id" element={<Dashboard />}/>
                <Route path="room-management/:id" element={<RoomManagementBo />}/>
                <Route index path="water-meter/:id" element={<WaterMeter />}/>
                <Route path="electrical-meter/:id" element={<ElectricalMeter />}/>
                  {/* TODO: เดี๋ยวมาทำ route path sidebar ทีหลัง */}
                {/* <Route path="meter" element={<MeterLayout />}>
                  <Route index path="water/:id" element={<WaterMeter />}/>
                  <Route path="electrical/:id" element={<ElectricalMeter />}/>
                </Route> */}
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  )
}

export default App
