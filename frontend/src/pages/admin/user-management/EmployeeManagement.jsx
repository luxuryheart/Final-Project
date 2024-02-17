import axios from 'axios';
import React from 'react'

const EmployeeManagement = () => {
  let OmiseCard = window.OmiseCard;
  console.log(OmiseCard);

  Omise.setPublicKey("pkey_test_5ys5x2qwx52pkxzhg04");

  const token1 = "src_test_5ys9h5hj48t23tksh7x"

  {/*
    
  */}

  OmiseCard.configure({
    defaultPaymentMethod: "credit_card",
    otherPaymentMethods: [],
  });

  const invoiceId = "1234"

  const CreateSource = () => {
    OmiseCard.open({
      amount: 1000,
      currency: "thb",
      onCreateTokenSuccess: async(amount, token) => {
        await axios.post("/api/v1/api/api/omise", {
          data: {
            amount,
            token,
            invoiceId: invoiceId
          }
        })
    }
    });
  }
  
  return (
    <div>
      <button onClick={CreateSource}>เพิ่มพนักงาน</button>
    </div>
  )
}

export default EmployeeManagement