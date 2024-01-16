import { Link } from "react-router-dom"


const Login = () => {
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
            <div id="form" className="mt-16 w-full">
              <div id="username-email" className="mb-4">
                <p className="text-[#797F8B] mb-1">Username or email</p>
                <input type="text" placeholder="example@gmail.com" className="input input-bordered w-full bg-[#D9D9D9] opacity-50" />
              </div>
              <div id="password" className="mb-4">
                <p className="text-[#797F8B] mb-1">Password</p>
                <input type="text" placeholder="123456" className="input input-bordered w-full bg-[#D9D9D9] opacity-50" />
              </div>
            </div>
            <div className="flex justify-between items-center w-full mb-20">
                <div id="remember-me" className="flex items-center gap-x-2 ">
                    <input type="checkbox" checked={false} className="checkbox" />
                    <p className="inline-block text-xs text-colorDark">Remember me</p>
                </div>
                <div>
                    <p className="text-colorBlueGray text-xs">ลืมรหัสผ่านใช่มั้ย?</p>
                </div>
            </div>

            {/* Submit button */}
            <button className="btn w-full bg-colorBlueDark text-backgroundColor font-extralight text-lg font-serif">
              ลงทะเบียน
            </button>

            {/* Navigate to register */}
            <div className="flex justify-start items-center w-full">
            <Link to="/register"><span className="text-colorBlueDark underline mt-5 cursor-pointer hover:text-blue-800"> 
                  มีบัญชีแล้ว?
              </span></Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login