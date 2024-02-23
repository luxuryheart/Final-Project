import React, { useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import { PiBankFill } from "react-icons/pi";
import CreditCard from "./CreditCard";
import Promptpay from "./Promptpay";
import BankTransfer from "./BankTransfer";
import { RxCross2 } from "react-icons/rx";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
const stripe = Stripe("pk_test_ตัวเอง")


const PaymentType = ({
  banks,
  bill,
  setPaymentTypeOpen,
}) => {
  const [paymentMethods, setPaymentMethods] = useState("bank transfer");
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const handleRadioChange = (e, method) => {
    const methods = e.nativeEvent.target.checked;
    if (methods) {
      setPaymentMethods(method);
    }
  };

  const GetConfig = async () => {
    try {
      const response = await axios.get("/api/v1/config", {
        headers: {
            authtoken: localStorage.getItem("token"),
        }
    })
    const { publishableKey } = response.data
    setStripePromise(loadStripe(publishableKey))
    } catch (error) {
      console.log(error);
    }
  }

  const createPayment = async () => {
    try {
      const res = await axios.post("/api/v1/payment", {
        amount: bill.grandTotal,
        invoiceId: bill._id,
        method: paymentMethods
      }, {
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      });
      const { clientSecret } = res.data;
      setClientSecret(clientSecret);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetup = async (method) => {
    setStripePromise(null);
    setClientSecret("");
    setPaymentMethods(method);
    GetConfig();
    createPayment();
  };

  useEffect(() => {
    GetConfig()
    createPayment();
  }, [paymentMethods])

  useEffect(() => {
    if (stripePromise) {
      setStripePromise(stripePromise)
    }
    createPayment();
  }, [paymentMethods]);

  const option = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <div className="bg-colorBlueDark/50 z-20 absolute top-0 h-screen w-screen">
      <div className="flex justify-center items-center h-full">
        <div className="bg-bgForm card text-colorBlueDark h-fit max-h-[1000px] py-3 px-5 shadow-lg rounded-lg">
          <div className="flex items-center justify-end">
            <RxCross2
              className="h-6 w-6 cursor-pointer hover:scale-105 duration-300"
              onClick={() => setPaymentTypeOpen(false)}
            />
          </div>
          <div className="card-body">
            <div className="text-2xl text-center mb-3">
              เลือกประเภทการชำระเงิน
            </div>
            <div className="px-3 flex items-center gap-x-5">
              <label
                className="cursor-pointer"
                onChange={(e) => {
                  handleRadioChange(e, "card"); handleSetup("card");
                }}
              >
                <input type="radio" name="radio-1" className="peer sr-only" />
                <div className="shadow-lg rounded-md w-[170px] ring-2 ring-transparent peer-checked:ring-sky-500 peer-checked:ring-offset-2 hover:scale-105 duration-300">
                  <div className="px-3 py-3">
                    <FaCreditCard className="h-10 w-10" />
                    <div>บัตรเครดิต</div>
                  </div>
                </div>
              </label>
              <label
                className="cursor-pointer"
                onChange={(e) => {
                  handleRadioChange(e, "promptpay"); handleSetup("promptpay");
                }}
              >
                <input type="radio" name="radio-1" className="peer sr-only" />
                <div className="shadow-lg rounded-md w-[170px] ring-2 ring-transparent peer-checked:ring-sky-500 peer-checked:ring-offset-2 hover:scale-105 duration-300">
                  <div className="px-3 py-3">
                    <img
                      src="https://res.cloudinary.com/dydu8zpzo/image/upload/v1708420019/PromptPay-logo_vvsewy.png"
                      alt=""
                      className="h-[70px] w-full"
                    />
                  </div>
                </div>
              </label>
              <label
                className="cursor-pointer"
                onChange={(e) => handleRadioChange(e, "bank transfer")}
              >
                <input type="radio" name="radio-1" className="peer sr-only" />
                <div className="shadow-lg rounded-md w-[170px] ring-2 ring-transparent peer-checked:ring-sky-500 peer-checked:ring-offset-2 hover:scale-105 duration-300">
                  <div className="px-3 py-3">
                    <PiBankFill className="h-10 w-10" />
                    <div>โอนเงิน</div>
                  </div>
                </div>
              </label>
            </div>
            <div className="bg-bgForm rounded-lg">
            {
              paymentMethods === "bank transfer" ? (
                <BankTransfer
                  banks={banks}
                  setPaymentTypeOpen={setPaymentTypeOpen}
                  bill={bill}
                />
              ) : (
                stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={option}>
                    {paymentMethods === "card" && <CreditCard bill={bill} />}
                    {paymentMethods === "promptpay" && <Promptpay bill={bill} />}
                  </Elements>
                )
              )
            }
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentType;
