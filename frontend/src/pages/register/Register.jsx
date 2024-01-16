import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const register = () => {
  document.title = "JongHor | Register";
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password === confirmPassword) {
      try {
        axios
          .post("/api/v1/register", {
            username: user.username,
            email: user.email,
            password: user.password,
          })
          .then((res) => {
            if (res.data.success === true) {
              navigate('/login');
            }
          });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setError(true);
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
    }
  };
  return (
    <div className="container mx-auto h-screen w-screen">
      <div className="xl:px-[460px] lg:px-[300px] md:px-[200px] sm:px-[150px] pt-10">
        <div className="flex flex-col items-center justify-center gap-y-1">
          {/* Header */}
          <div
            id="header"
            className="text-colorDark flex flex-col gap-y-[2px] items-center justify-center w-full"
          >
            <p className="text-3xl font-serif	antialiased">สมัครสมาชิก</p>
            <div className="border-b-[1.75px] border-colorDark w-full"></div>
          </div>

          {/* Form */}
          <form id="form" className="mt-16 w-full" onSubmit={handleSubmit}>
            <div id="username" className="mb-4">
              <p className="text-[#797F8B] mb-1">Username</p>
              <input
                type="text"
                placeholder="Jhone"
                className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
            <div id="email" className="mb-4">
              <p className="text-[#797F8B] mb-1">Email</p>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div id="password" className="mb-4">
              <p className="text-[#797F8B] mb-1">Password</p>
              <input
                type="password"
                placeholder="123456"
                className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <div id="confirm-password" className="mb-4">
              <p className="text-[#797F8B] mb-1">Confirm Password</p>
              <input
                type="password"
                placeholder="123456"
                className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value), setError(false);
                }}
              />
            </div>
            {error && <div className="text-red-700">{errorMessage}</div>}
            <button
              className="btn w-full bg-colorBlueDark text-bgColor font-extralight text-lg font-serif"
              type="submit"
            >
              ลงทะเบียน
            </button>
          </form>
          {/* Submit button */}

          {/* Navigate to login */}
          <div className="flex justify-start items-center w-full">
            <Link to="/login">
              <span className="text-colorBlueDark underline mt-5 cursor-pointer hover:text-blue-800">
                มีบัญชีแล้ว?
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
