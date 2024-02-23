const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../../controllers/payment/payment.controller')
const auth = require('../../middleware/auth');

paymentRouter.get('/payment/:id', auth.isAuthenticated, paymentController.GetPayment);
paymentRouter.post('/bank-transfer', auth.isAuthenticated, paymentController.BankTransferPayment);
paymentRouter.post("/payment", auth.isAuthenticated, paymentController.Payment)
paymentRouter.get("/config", auth.isAuthenticated, paymentController.GetConfig)  

module.exports = paymentRouter;