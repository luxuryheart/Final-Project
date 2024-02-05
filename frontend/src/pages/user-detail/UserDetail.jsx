import React, { useState } from "react";
import { Gender } from "../../utils/user-detail/data";
import { Role } from "../../utils/user-detail/data";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  document.title = "JongHor | User-detail";
  const navigate = useNavigate();
  const [detail, setDetail] = useState({
    firstname: "",
    lastname: "",
  });
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleRole = (e) => {
    const { value } = e.target;
    let updatedValue = value;
    if (value === "เจ้าของหอ") {
      updatedValue = "admin";
    } else if (value === "พนักงาน") {
      updatedValue = "employee";
    } else {
      updatedValue = "user";
    }
    setRole(updatedValue);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      axios
        .put("/api/v1/user-update", {
          firstname: detail.firstname,
          lastname: detail.lastname,
          gender: gender,
          role: role,
        }, {
          headers: {
            authtoken: `${token}`,
          },
        })
        .then(async(res) => {
          const role = res.data.formattedUserDetail.user.role;
          localStorage.removeItem("token");
          localStorage.setItem("token", res.data.token);
          if (role === "admin") {
            navigate("/dormitory");
          } else if (role === "employee" || role === "user") {
            navigate("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto h-screen w-screen">
      <div className="xl:px-[460px] lg:px-[300px] md:px-[200px] sm:px-[150px] pt-28">
        <div className="flex flex-col items-center justify-center gap-y-1">
          {/* Header */}
          <div
            id="header"
            className="text-colorDark flex flex-col gap-y-[2px] items-center justify-center w-full"
          >
            <p className="text-3xl font-serif	antialiased">ข้อมูลผู้ใช้</p>
            <div className="border-b-[1.75px] border-colorDark w-full"></div>
          </div>

          {/* Form */}
          <form id="form" className="mt-16 w-full" onSubmit={handleSubmit}>
            <div id="firstname" className="mb-4">
              <p className="text-[#797F8B] mb-1">Firstname</p>
              <input
                type="text"
                placeholder="Jhone"
                className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="firstname"
                value={detail.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div id="lastname" className="mb-4">
              <p className="text-[#797F8B] mb-1">Lastname</p>
              <input
                type="text"
                placeholder="Doe"
                className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                name="lastname"
                value={detail.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <p className="text-colorDark text-base">เพศ :</p>
              <div className="px-5 mt-2 flex justify-between items-center">
                {Gender.map((item, i) => (
                  <div className="flex items-center gap-x-2" key={i}>
                    <input
                      type="radio"
                      name={`radio-1`}
                      className="radio"
                      required
                      value={item}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <p className="text-colorDark text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-20">
              <p className="text-colorDark text-base">ตำแหน่ง :</p>
              <div className="px-5 mt-2 flex justify-between items-center">
                {Role.map((item, i) => (
                  <div className="flex items-center gap-x-2" key={i}>
                    <input
                      type="radio"
                      name={`radio-2`}
                      className="radio"
                      required
                      value={item}
                      onChange={handleRole}
                    />
                    <p className="text-colorDark text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn w-full bg-colorBlueDark text-bgColor font-extralight text-lg font-serif"
              type="submit"
            >
              เสร็จสิ้น
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
