import { FC, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import initializeApp from "./app/init";

// importing pages
const Layout = lazy(() => import("./layout/Layout"));
// const Register = lazy(() => import("./pages/register/Register"));
// const Login = lazy(() => import("./pages/login/Login"));

// set timeout 
const Login = lazy(() => new Promise<{ default: FC }>((resolve) => {
  setTimeout(() => resolve(import("./pages/login/Login")), 1000)
}))
const Register = lazy(() => new Promise<{ default: FC }>((resolve) => {
  setTimeout(() => resolve(import("./pages/register/Register")), 1000)
}))

// Initializing different libraries
initializeApp()

function App() {
  return (
    <>
      <div className="bg-backgroundColor h-screen w-screen max-h-full">
        <Router>
          {/* <Suspense> */}
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading ...</div>}>
            <Routes>
              {/* <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/documentation" element={<Documentation />} /> */}
              
              {/* Place new routes over this */}
              {/* <Route path="/app/*" element={<Layout />} />

              <Route path="*" element={<Navigate to={token ? "/app/welcome" : "/login"} replace />}/> */}

              <Route path="/admin/*" element={<Layout />}/>

              {/* Public Pages */}
              <Route path="/register" element={<Register />}/>
              <Route path="/login" element={<Login />}/>

            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  );
}

export default App
