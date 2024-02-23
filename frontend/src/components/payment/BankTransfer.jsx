import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

const BankTransfer = ({ banks, setPaymentTypeOpen, bill }) => {
  const [slip, setSlip] = useState('');
  const { invoiceid } = useParams();

  const handelFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSlip(reader.result);
    };
    reader.readAsDataURL(file); 
  };
  
  const handleSubmitFile = async(e) => {
    e.preventDefault()
    if (!slip) {
      return
    }
    try {
      const res = await axios.post('/api/v1/bank-transfer', {
        img: slip,
        invoiceId: invoiceid,
        price: bill.grandTotal
      }, {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        setPaymentTypeOpen(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='mt-5 '>
      <div className='flex flex-col gap-y-3 py-2 justify-center items-center overflow-y-auto max-h-[28vh]'>
        {banks.map((bank, i) => (
          <div key={i} className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body flex flex-row items-center gap-x-2">
              <img src={bank.img} alt={bank.name} className='h-12 w-12'/>
              <div>
                <h2 className="card-title">{bank.bank}</h2>
                <p>{bank.account} {bank.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-5 flex justify-between'>
        <input type="file" className="file-input file-input-bordered w-full max-w-sm file-input-sm" onChange={handelFileInputChange}/>
        <button className="btn btn-sm bg-colorBlueDark text-bgColor" onClick={handleSubmitFile}>ยืนยัน</button>
      </div>
    </div>
  );
}

export default BankTransfer;
