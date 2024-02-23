import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const Login = () => {
	document.title = "JongHor | Login";
	const navigate = useNavigate()
	const [user, setUser] = useState({
		username: "",
		password: "",
	})

	const handleChange = (e) => {
		const {name, value} = e.target;
		setUser((prevUser) => ({
			...prevUser,
			[name]: value
		}));
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			axios.post("/api/v1/login", {
				userlogin: user.username,
				password: user.password,
			})
			.then((res) => {
				if(res.data.success === true) {
					localStorage.setItem("token", res.data.token)
					const user = jwtDecode(res.data.token);
					const profile = user.user.profile
					const dormitory = getDormitoryByUser(user.user._id)	
					if (profile.firstname === "" && profile.lastname === "" && profile.gender === "") {
						navigate("/user-detail")
					} else if (dormitory.length === 0) {
						navigate("/dormitory");
					} else {
						navigate('/')
					}
				}
			})
		} catch (error) {
			console.log(error);
		}
	}

	const getDormitoryByUser = async(id) => {
		try {
			const res = await axios.get(`/api/v1/get-dormitory-by-user/${id}`, {
				headers: {
					authtoken: `${localStorage.getItem("token")}`,
				},
			})
			if (res.data.success) {
				return res.data.dormitory
			}
		} catch (error) {
			console.log(error);
		}
	}

  return (
    <div className="container mx-auto h-screen w-screen ">
    <div className="xl:px-[460px] lg:px-[300px] md:px-[200px] sm:px-[150px] pt-32">
      <div className="flex flex-col items-center justify-center gap-y-1">
          {/* Header */}
          <div id="header" className="text-colorDark flex flex-col gap-y-[2px] items-center justify-center w-full">
            <p className="text-3xl font-serif	antialiased">เข้าสู่ระบบ</p>
            <div className="border-b-[1.75px] border-colorDark w-full"></div>
          </div>

          {/* Form */}
          <form id="form" className="mt-16 w-full" onSubmit={handleSubmit}>
            <div id="username-email" className="mb-4">
              <p className="text-[#797F8B] mb-1">Username or email</p>
              <input type="text" placeholder="example@gmail.com" className="input input-bordered w-full bg-[#D9D9D9] opacity-50" 
			  	name='username'
				value={user.username}
				onChange={handleChange}
				required
			  />
            </div>
            <div id="password" className="mb-4">
              <p className="text-[#797F8B] mb-1">Password</p>
              <input type="password" placeholder="123456" className="input input-bordered w-full bg-[#D9D9D9] opacity-50" 
			  	name='password'
				value={user.password}
				onChange={handleChange}
				required
			  />
            </div>
			{/* <div className="flex justify-between items-center w-full mb-20">
				<div id="remember-me" className="flex items-center gap-x-2 ">
					<input type="checkbox" checked className="checkbox" />
					<p className="inline-block text-xs text-colorDark">Remember me</p>
				</div>
				<div>
					<p className="text-colorBlueGray text-xs">ลืมรหัสผ่านใช่มั้ย?</p>
				</div>
			</div> */}
			<div className='mb-20'></div>
			{/* Submit button */}
			<button className="btn w-full bg-colorBlueDark text-bgColor font-extralight text-lg font-serif"
				type="submit"
			>
				ลงทะเบียน
			</button>
          </form>


          {/* Navigate to register */}
          <div className="flex justify-start items-center w-full">
          <Link to="/register"><span className="text-colorBlueDark underline mt-5 cursor-pointer hover:text-blue-800"> 
                ยังไม่มีมีบัญชีใช่มั้ย?
            </span></Link>
          </div>
      </div>
    </div>
  </div>
  )
}

export default Login