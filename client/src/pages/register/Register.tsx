import { FC, useState } from "react"
import { Link } from "react-router-dom"
import IUserRegister from "../../interfaces/IUserRegister"

const Register: FC  = () => {
  const [user , setUser] = useState<IUserRegister>({
    username: "",
    email: "",
    password: "",
  });

  console.log(user.username)

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  const Submit = () => {
    console.log(user);
  }

  return (
    <div className="container mx-auto h-screen w-screen">
      <div className="xl:px-[460px] lg:px-[300px] md:px-[200px] sm:px-[150px] pt-10">
        <div className="flex flex-col items-center justify-center gap-y-1">
            {/* Header */}
            <div id="header" className="text-colorDark flex flex-col gap-y-[2px] items-center justify-center w-full">
              <p className="text-3xl font-serif	antialiased">สมัครสมาชิก</p>
              <div className="border-b-[1.75px] border-colorDark w-full"></div>
            </div>

            {/* Form */}
            <div id="form" className="mt-16 w-full">
              <div id="username" className="mb-4">
                <p className="text-[#797F8B] mb-1">Username</p>
                <input type="text" placeholder="Jhone" className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                    name="username"
                    value={user.username}
                    onChange={handleChange}  
                />
              </div>
              <div id="email" className="mb-4">
                <p className="text-[#797F8B] mb-1">Email</p>
                <input type="text" placeholder="example@gmail.com" className="input input-bordered w-full bg-[#D9D9D9] opacity-50"
                    name="email"
                    value={user.email}
                    onChange={(e) => handleChange(e)}   
                />
              </div>
              <div id="password" className="mb-4">
                <p className="text-[#797F8B] mb-1">Password</p>
                <input type="text" placeholder="123456" className="input input-bordered w-full bg-[#D9D9D9] opacity-50" 
                    name="password"
                    value={user.password}
                    onChange={(e) => handleChange(e)}
                />
              </div>
              <div id="confirm-password" className="mb-4">
                <p className="text-[#797F8B] mb-1">Confirm Password</p>
                <input type="text" placeholder="123456" className="input input-bordered w-full bg-[#D9D9D9] opacity-50" />
              </div>
            </div>

            {/* Submit button */}
            <button className="btn w-full bg-colorBlueDark text-backgroundColor font-extralight text-lg font-serif"
                onClick={Submit}
            >
              ลงทะเบียน
            </button>

            {/* Navigate to login */}
            <div className="flex justify-start items-center w-full">
              <Link to="/login"><span className="text-colorBlueDark underline mt-5 cursor-pointer hover:text-blue-800"> 
                  มีบัญชีแล้ว?
              </span></Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Register