import axios from "axios";
import React, { useEffect, useState } from "react";
import { banks } from "../../utils/data/bank/bank";
import { Link, useParams } from "react-router-dom";

const DormitoryBankMeter = () => {

  const [bankAccount, setBankAccount] = useState([]);
  const [meters, setMeters] = useState([]);
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [waterPerUnit, setWaterPerUnit] = useState(0);
  const [waterPerMonth, setWaterPerMonth] = useState(0);
  const [electricalPerUnit, setElectricalPerUnit] = useState(0);
  const [electricalPerMonth, setElectricalPerMonth] = useState(0);
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // pagination for bankAccount
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const lastIndex = currentPage * recordsPerPage; // 1 * 3 = 3
  const firstIndex = lastIndex - recordsPerPage; // 3 - 3 = 0
    
  // const records = Array.isArray(bankAccount) && bankAccount.length > 0
  //   ? bankAccount.slice(Math.max(0, firstIndex), Math.min(lastIndex, bankAccount.length))
  //   : [];

  const records = bankAccount.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(bankAccount.length / recordsPerPage);
  // const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  const getBankAccount = async () => {
    const res = await axios.get(`/api/v1/get-bank/${id}`, {
      headers: {
        authtoken: `${token}`,
      },
    })
    if (res.data.success) {
      setBankAccount(res.data.bank)
    }
  }

  const getMeter = async() => {
    try {
      const res = await axios.get(`/api/v1/get-meter-by-dormitory/${id}`, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) { 
        setMeters(res.data.meters)
        setWaterPerUnit(res.data.meters.waterMeter[0].price)
        setWaterPerMonth(res.data.meters.waterMeter[1].price)
        setElectricalPerUnit(res.data.meters.electricalMeter[0].price)
        setElectricalPerMonth(res.data.meters.electricalMeter[1].price)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    const input = e.target.value;
    const formattedInput = input
      .replace(/\D/g, "") 
      .replace(/(\d{3})(\d{6})(\d)/, "$1-$2-$3"); 

    setAccountNumber(formattedInput);
  };
  
  const handleElectricalChange = (e) => {
    const { name, value } = e.target;
  
    setMeters((prevMeters) => ({
      ...prevMeters,
      electricalMeter: prevMeters.electricalMeter.map((meter) =>
        meter.name === name ? { ...meter, price: parseFloat(value) } : meter
      ),
    }));
  };

  const handleWaterChange = (e) => {
    const { name, value } = e.target;

    setMeters((prevMeters) => ({
      ...prevMeters,
      waterMeter: prevMeters.waterMeter.map((meter) =>
        meter.name === name ? { ...meter, price: parseFloat(value) } : meter
      ),
    }))
  }

  const handleElectricalUpdate = async(e, id) => {
    e.preventDefault()
    const price = meters.electricalMeter.find((meter) => meter._id === id).price
    try {
      const res = await axios.put(`/api/v1//update-meter`, {
        flag: "1",
        id: id,
        price: price
      }, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setTimeout(() => getMeter(), 1000)
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleWaterUpdate = async(e, id) => {
    e.preventDefault()
    const price = meters.waterMeter.find((meter) => meter._id === id).price
    try {
      const res = await axios.put(`/api/v1//update-meter`, {
        flag: "2",
        id: id,
        price: price
      }, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setTimeout(() => getMeter(), 1000)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateBank = async(e) => {
    try {
      const res = await axios.post("/api/v1/bank", {
        dormitoryId: id,
        bank: bank,
        account: accountNumber,
        name: accountName,
        flag: "0",
      }, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setAccountName("")
        setAccountNumber("")
        setBank("")
        setTimeout(() => getBankAccount(), 1000)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const changePage = (id) => {
    setCurrentPage(id);
  }

  const handleDeleteBank = async(e, id) => {
    try {
      const res = await axios.post(`/api/v1/bank`, {
        dormitoryId: id,
        bankId: id,
        flag: "1"
      }, {
        headers: {
          authtoken: `${token}`,
        },
      })
      if (res.data.success) {
        setTimeout(() => getBankAccount(), 1000)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBankAccount()
    getMeter()
  }, [])

  return (
    <div className="container mx-auto h-screen w-screen text-colorBlueDark">
      <div className="xl:px-[300px] lg:px-[200px] md:px-[100px] sm:px-[50px] px-5 py-5">
        <div className="flex flex-col items-center justify-center gap-y-1 bg-bgForm rounded-lg shadow-md w-full">
          <div className="flex flex-col justify-center items-start w-full px-5 py-5 text-xl">
            <div>บัญชีธนาคาร</div>
            <img src={"../assets/images/bank.png"} alt="" />
            <div className="w-full mt-3 mb-5 grid grid-cols-[30%30%20%10%] items-center justify-center gap-x-2">
              <div className="w-full text-sm">
                <p>ชื่อบัญชี</p>
                <input
                  type="text"
                  placeholder="ป้อนชื่อบัญชี"
                  className="input input-bordered w-full max-w-xs mt-1"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div className="w-full text-sm">
                <p>เลขบัญชี</p>
                <input
                  type="text"
                  placeholder="เลขบัญชี"
                  className="input input-bordered w-full max-w-xs mt-1"
                  pattern="\d{3}-\d{6}-\d"
                  value={accountNumber}
                  onChange={handleInputChange}
                  maxLength={12}
                />
              </div>
              <div className="w-full text-sm">
                <p>ธนาคาร</p>
                <select
                  className="select w-full max-w-xs input-bordered mt-1"
                  onChange={(e) => setBank(e.target.value)}
                >
                  <option disabled selected>
                    เลือกธนาคาร
                  </option>
                  {banks.map((bank, i) => (
                    <option key={i} value={bank.name} name={bank.name}>
                      <img src={banks.img}></img>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full text-sm text-center">
                <br />
                <button
                  className="btn bg-colorBlueDark text-bgColor w-full"
                  onClick={handleCreateBank}
                >
                  เพิ่ม
                </button>
              </div>
            </div>
            {(bankAccount.length === 0) | (bankAccount === null) ? (
              <div className="text-sm text-center w-full text-colorBlueGray">
                <p>ยังไม่มีบัญชีธนาคาร</p>
              </div>
            ) : (
              // TODO: มาทำตารางให้เสร็จเหลือแค่นี้
              <div className="overflow-x-auto w-full">
                <div className="h-[22vh]">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="text-center">
                        <th></th>
                        <th>ชื่อบัญชี</th>
                        <th>เลขบัญชี</th>
                        <th>ธนาคาร</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankAccount && bankAccount.length > 0
                        ? records.map((bank, i) => (
                            <tr className="text-center" key={i + 1}>
                              <th>{i + 1}</th>
                              <div className="overflow-x-scroll min-w-[12vh] w-[12vh]">
                                <td>{bank.name}</td>
                              </div>
                              <td>{bank.account}</td>
                              <td>{bank.bank}</td>
                              <td>
                                <button
                                  className="hover:scale-125 duration-300"
                                  onClick={(e) =>
                                    handleDeleteBank(e, bank._id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-5 h-5"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
                <div className="join text-sm">
                  <button
                    className="join-item bg-colorBlueDark/10 px-2 py-1 text-center text-xs hover:bg-colorBlueDark/20"
                    onClick={prePage}
                  >
                    Prev
                  </button>
                  {numbers.map((n, i) => (
                    <button
                      className={`join-item bg-colorBlueDark/10 px-3 py-1 text-center hover:bg-colorBlueDark/20${
                        currentPage === n
                          ? " active:bg-colorBlueDark/20 focus:bg-colorBlueDark/20 "
                          : " "
                      }`}
                      key={i}
                      onClick={() => changePage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="join-item bg-colorBlueDark/10 px-2 py-1 text-center text-xs hover:bg-colorBlueDark/20"
                    onClick={nextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-start w-full px-5 text-xl mb-5">
            <div>ค่าน้ำค่าไฟ</div>
            <div className="grid grid-cols-4 w-full gap-x-2 md:gap-x-3 mt-5 px-5">
              {meters &&
                meters.electricalMeter &&
                meters.electricalMeter.map((meter, i) => (
                  <div
                    key={i}
                    className="bg-red-300 px-3 py-2 rounded-lg shadow-lg text-center text-red-800 text-lg relative"
                  >
                    {meter.name === "คิดตามหน่วยจริง" ? (
                      <p className="text-sm mb-3">
                        {meter.name} หน่วยละ {electricalPerUnit} บาท
                      </p>
                    ) : (
                      <p className="text-sm mb-3">
                        {meter.name} {electricalPerMonth} บาท/เดือน
                      </p>
                    )}
                    <input
                      type="number"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs mb-2"
                      value={meter.price}
                      name={meter.name}
                      onChange={(e) => {
                        const numericInput = e.target.value.replace(/\D/g, "");
                        handleElectricalChange(e);
                      }}
                    />
                    <button
                      className="text-center bg-colorBlueDark text-bgColor w-full py-2 rounded-lg text-sm shadow-sm hover:bg-slate-400 duration-300 hover:scale-110"
                      onClick={(e) => handleElectricalUpdate(e, meter._id)}
                    >
                      อัพเดต
                    </button>
                    <div className="absolute -top-5 -left-2 bg-red-100 rounded-xl text-sm text-red-500 px-2 py-1 border border-yellow-500">
                      ค่าไฟ
                    </div>
                  </div>
                ))}
              {meters &&
                meters.waterMeter &&
                meters.waterMeter.map((meter, i) => (
                  <div
                    key={i}
                    className="bg-sky-400 px-3 py-2 rounded-lg shadow-lg text-center text-sky-900 text-lg relative"
                  >
                    {meter.name === "คิดตามหน่วยจริง" ? (
                      <p className="text-sm mb-3">
                        {meter.name} หน่วยละ {waterPerUnit} บาท
                      </p>
                    ) : (
                      <p className="text-sm mb-3">
                        {meter.name} {waterPerMonth} บาท/เดือน
                      </p>
                    )}
                    <input
                      type="number" // Changed from "text" to "number"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs mb-2"
                      value={meter.price}
                      name={meter.name}
                      onChange={(e) => {
                        const numericInput = e.target.value.replace(/\D/g, "");
                        handleWaterChange(e);
                      }}
                    />
                    <button
                      className="text-center bg-colorBlueDark text-bgColor w-full py-2 rounded-lg text-sm shadow-sm hover:bg-slate-400 duration-300 hover:scale-110"
                      onClick={(e) => handleWaterUpdate(e, meter._id)}
                    >
                      อัพเดต
                    </button>
                    <div className="absolute -top-5 -left-2 bg-sky-100 rounded-xl text-sm text-sky-500 px-2 py-1 border border-green-500">
                      ค่าน้ำ
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div id="button">
            <Link
              to={`/dormitory/home/${id}`}
              className="w-[70vh] flex justify-center mb-5"
            >
              <button className="py-2 rounded-md  hover:bg-slate-400 hover:scale-105 duration-300 active:scale-95 w-1/2 bg-colorBlueDark text-bgColor font-extralight text-base font-serif text-center">
                เสร็จสิ้น
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DormitoryBankMeter;
