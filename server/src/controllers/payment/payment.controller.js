require("dotenv").config();
("use strict");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret =
  "whsec_ad0978dee7bfe9145878cbb28dddef7128a029fba1f41b33795d839563d48097";

const omise = require("omise");

const omiseClient = omise({
  secretKey: process.env.OMISE_SECRET_KEY,
  publicKey: process.env.OMISE_PUBLIC_KEY,
  omiseVersion: "2019-05-29",
});

const { v4: uuidv4 } = require("uuid");
const { paymentModel } = require("../../models/payment/payment.model");
const { invoicedModel } = require("../../models/backoffice/invoice.model");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PostPayment = async (req, res, next) => {
  try {
    const { userId, invoice } = req.body;

    const orderId = uuidv4();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["promptpay"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: invoice.invoiceId,
            },
            unit_amount: invoice.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.YOUR_DOMAIN}/success/${orderId}`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel`,
    });

    const orderData = {
        userId: userId,
      orderId: orderId,
      invoiceId: invoice.invoiceId,
      price: invoice.price,
      status: session.status,
      sessionId: session.id,
      paymentType: "promptpay",
    };

    const payment = await paymentModel.create(orderData);

    if (payment) {
      return res.status(200).json({
        success: true,
        message: "Payment success",
        payment,
        sessionId: session.id
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const GetOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const payment = await paymentModel.findOne({ orderId: orderId });

    if (payment) {
      return res.status(200).json({
        success: true,
        message: "Payment success",
        payment,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const PaymentHook = async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"];
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
  
      switch (event.type) {
        case "checkout.session.completed":
          const paymentData = event.data.object;
          console.log(paymentData);
          const sessionId = paymentData.id;
  
          // อัปเดตสถานะการชำระเงินในฐานข้อมูล
          const updatedPayment = await paymentModel.findOneAndUpdate(
            { sessionId: sessionId },
            { status: paymentData.payment_status },
            { new: true }
          );
  
          console.log("Updated payment:", updatedPayment);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
          res.send();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
   

// const OmisePayment = async(req, res, next) => {
//     try {
//         const { source } = req.body;
//         // const customer = await omiseClient.customers.create({
//         //     email: "Jhone@gmail.com",
//         //     description: "test",
//         //     card: "tokn_test_5ysaawcvs0iy8h8fdo6"
//         // });

//         // const charge = await omiseClient.charges.create({
//         //     amount: 10000,
//         //     currency: 'thb',
//         //     customer: customer.id
//         // })

//         console.log(source);

//     } catch (error) {
//         console.error("Error: ", error);
//     }
// }

const GetPayment = async (req, res, next) => {
    try {
        const payment = await paymentModel.findOneAndUpdate({ orderId: req.params.id }, {
            status: "completed",
        }, { new: true });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        const invoiced = await invoicedModel.findOneAndUpdate({ _id: payment.invoiceId }, {
            invoiceStatus: "paid",
        }, { new: true });

        if (!invoiced) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
         
        return res.status(200).json({ success: true, data: payment });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const BankTransferPayment = async (req, res, next) => {
  try {
    const user = req.user;
    const data = req.body;

    const uploadedResponse = await cloudinary.uploader.upload(data.img, {
      upload_preset: "final_img",
      public_id: `${user._id}`,
    });

    const payment = await paymentModel.findOne({ invoiceId: data.invoiceId });
    if (!payment) {
      const payment = await paymentModel.create({
        invoiceId: data.invoiceId,
        date: new Date(),
        price: data.price,
        paymentType: "bank transfer",
        userId: user._id,
        orderId: uuidv4(),
        sessionId: uuidv4(),
        img: uploadedResponse.secure_url,
        status: "pending",
      })
      if (payment) {
        await invoicedModel.findOneAndUpdate({ _id: data.invoiceId }, {
          invoiceStatus: "pending",
          img: uploadedResponse.secure_url,
        }, { new: true })
        return res.status(200).json({
          success: true,
          message: "Payment success",
          payment,
        })
      }
    }
    await paymentModel.findOneAndUpdate({ invoiceId: data.invoiceId }, {
      $set: {
        img: uploadedResponse.secure_url,
        status: "pending",
      }
    })
    await invoicedModel.findOneAndUpdate({ _id: data.invoiceId }, {
      $set: {
        invoiceStatus: "pending",
        img: uploadedResponse.secure_url,
      }
    })
    return res.status(200).json({
      success: true,
      message: "Payment success",
      payment
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { PostPayment, GetOrder, PaymentHook, GetPayment, BankTransferPayment };
