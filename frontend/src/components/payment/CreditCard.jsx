import React, { useState } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

const CreditCard = ({ bill }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/success/${bill._id}`,
      },
    });

    if (error) {
      setMessage(error.message);
    }

    setIsProcessing(false);
  }
  return (
    <div className='px-10 py-5'>
      <PaymentElement options={{layout: 'tabs'}}/>
      <button onClick={handleSubmit} disabled={isProcessing} className='btn btn-sm w-full mt-5 bg-success text-bgColor'>ชำระเงิน</button>
    </div>
  )
}

export default CreditCard