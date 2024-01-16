import { Suspense, useEffect } from "react"
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

function App() {
  console.log("App.jsx: ", token);
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
                <Route path="home" element={<DormitoryHome />}/>
                <Route path="rooms-management" element={<RoomsManagement />}/>
                <Route path="rooms-price" element={<RoomsPrice />}/>
              </Route>

            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  )
}

export default App
