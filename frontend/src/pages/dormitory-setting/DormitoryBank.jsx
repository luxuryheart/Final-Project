import React, { useState, useEffect } from 'react'
import { banks } from '../../utils/data/bank/bank'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const DormitoryBank = () => {
    const [bank, setBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [bankAccount, setBankAccount] = useState([]);
    const [bankImg, setBankImg] = useState("");
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [openEdit, setOpenEdit] = useState(false);
    const [row, setRow] = useState(0);
    const [bankAccountEdit, setBankAccountEdit] = useState([]);

    const handleInputChange = (e) => {
      const input = e.target.value;
      const formattedInput = input
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{6})(\d)/, "$1-$2-$3");

      setAccountNumber(formattedInput);
    };

    const handleImgBank = (e) => {
        const { value, name } = e.target;
        const selectedBank = banks.find((bank) => bank.name === value);
        const selectedBankImg = selectedBank.img;
        setBankImg(selectedBankImg);
    }
    
    const handleCreateBank = async (e) => {
      try {
        const res = await axios.post(
          "/api/v1/bank",
          {
            dormitoryId: id,
            bank: bank,
            account: accountNumber,
            name: accountName,
            img: bankImg,
            flag: "0",
          },
          {
            headers: {
              authtoken: `${token}`,
            },
          }
        );
        if (res.data.success) {
          setAccountName("");
          setAccountNumber("");
          setBank("");
          setTimeout(() => getBankAccount(), 1000);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getBankAccount = async () => {
        const res = await axios.get(`/api/v1/get-bank/${id}`, {
          headers: {
            authtoken: `${token}`,
          },
        })
        if (res.data.success) {
          setBankAccount(res.data.bank)
          setBankAccountEdit(res.data.bank)
        }
    }

    const handleEditChange = (e, index) => {
      const { name, value } = e.target;
      if (name === "account") {
        const formattedInput = value
          .replace(/\D/g, "")
          .replace(/(\d{3})(\d{6})(\d)/, "$1-$2-$3");
        const updatedBankAccountEdit = bankAccountEdit.map((item, idx) => {
          if (idx === index) {
            return { ...item, account: formattedInput };
          }
          return item;
        });
        setBankAccountEdit(updatedBankAccountEdit);
      } else if (name === "name") {
        const updatedBankAccountEdit = bankAccountEdit.map((item, idx) => {
          if (idx === index) {
            return { ...item, name: value };
          }
          return item;
        });
        setBankAccountEdit(updatedBankAccountEdit);
      }
    }
   
    const UpdateList = async(index) => {
      try {
        const res = await axios.put(`/api/v1/backoffice/bank`, {
          bankId: bankAccountEdit[index]._id,
          account: bankAccountEdit[index].account,
          name: bankAccountEdit[index].name,
        }, {
          headers: {
            authtoken: `${token}`
          }
        })
        if (res.data.success) {
          getBankAccount()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const DeleteList = async(index) => {
      try {
        const res = await axios.delete(`/api/v1/backoffice/bank/${bankAccountEdit[index]._id}?dormitoryid=${id}`, {
          headers: {
            authtoken: `${token}`
          }
        })
        if (res.data.success) {
          getBankAccount()
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
        getBankAccount()
      }, [])

  return (
    <div className='className="mx-auto max-h-screen h-screen max-w-[200vh] xl:w-[100vh ] w-full"'>
      <div className="px-5 py-5 text-colorBlueDark">
        <div className="text-2xl font-semibold ">บัญชีธนาคาร</div>
        <div className="divider"></div>
        <div className="bg-colorBlueDark/30 py-5 rounded-t-md px-5 text-colorBlueDark shadow">
          <div className='text-lg font-semibold underline'>เพิ่มบัญชีธนาคาร</div>
          <div className="w-full mt-3 mb-5 grid grid-cols-[30%30%20%10%] items-center gap-x-2">
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
                onChange={(e) => {
                  setBank(e.target.value);
                  handleImgBank(e);
                }}
              >
                <option disabled selected>
                  เลือกธนาคาร
                </option>
                {banks.map((bank, i) => (
                  <option key={i} value={bank.name} name={bank.name}>
                    <img src={bank.img} alt="" />
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
        </div>
        <div className="bg-bgForm px-5 py-5">
          {bankAccount.map((bank, index) => (
            <div>
              <div className="flex items-center justify-between" key={index}>
                <div className="flex items-center gap-x-2">
                  <img src={bank.img} alt="" className="w-16 h-16" />
                  <div className="text-sm">
                    <div className="font-semibold">ธนาคาร : {bank.bank}</div>
                    <div>ชื่อบัญชี : {bank.name}</div>
                    <div>เลขบัญชี : {bank.account}</div>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="tooltip" data-tip="แก้ไข">
                    {/* <FaCheck className="cursor-pointer hover:scale-110 duration-300 text-green-600" onClick={(e) => { UpdateList(e, list._id, index); setButtonSwitch(false) }}/> */}
                    <FaPen
                      className="cursor-pointer hover:scale-110 duration-300"
                      onClick={() => { setOpenEdit(!openEdit); setRow(index) }}
                    />
                  </div>
                  <div className="tooltip" data-tip="ลบ">
                    <ImCross
                      className="cursor-pointer text-red-600 hover:scale-110 duration-300"
                      onClick={() => { DeleteList(index) }}
                    />
                  </div>
                </div>
              </div>
              {openEdit && index === row && (
                <div className='mt-3 px-7 flex gap-x-2'>
                  <input
                    type="text"
                    placeholder="ชื่อบัญชี"
                    className="input input-sm input-bordered w-[13rem] max-w-xs"
                    name='name'
                    value={bankAccountEdit[index].name} 
                    onChange={(e) => handleEditChange(e, index)}
                  />  
                  <input
                    type="text"
                    placeholder="เลขบัญชี"
                    className="input input-sm input-bordered w-[10rem] max-w-xs"
                    value={bankAccountEdit[index].account} 
                    maxLength={12}
                    name='account'
                    onChange={(e) => handleEditChange(e, index)}
                  /> 
                  <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={() => { UpdateList(index); }}>แก้ไข</button>
                  <div className='flex items-center text-colorBlueGray cursor-pointer hover:underline hover:text-colorBlueDark duration-300' onClick={() => { setOpenEdit(false), getBankAccount()}}>ยกเลิก</div>
                </div>
              )}
              <div className="divider"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DormitoryBank