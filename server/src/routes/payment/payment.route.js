const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../../controllers/payment/payment.controller')
const auth = require('../../middleware/auth');

paymentRouter.post('/checkout', auth.isAuthenticated, paymentController.PostPayment);
paymentRouter.get('/order/:id', auth.isAuthenticated, paymentController.GetOrder);
// paymentRouter.post('/webhook', express.raw({ type: "application/json" }), paymentController.PaymentHook)
paymentRouter.get('/payment/:id', auth.isAuthenticated, paymentController.GetPayment);
paymentRouter.post('/bank-transfer', auth.isAuthenticated, paymentController.BankTransferPayment);

// Omise
// paymentRouter.post('/api/omise', paymentController.OmisePayment)

// 2C2P
paymentRouter.post("/payment", auth.isAuthenticated, paymentController.Payment)
paymentRouter.get("/config", auth.isAuthenticated, paymentController.GetConfig)  

module.exports = paymentRouter;