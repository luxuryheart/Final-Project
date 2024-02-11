const express = require('express');
const backofficeRouter = express.Router();
const backofficeController = require('../../controllers/backoffice/backoffice.controller')
const auth = require('../../middleware/auth')

backofficeRouter.post('/backoffice/rooms', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateContact)
backofficeRouter.post('/backoffice/user-detail', auth.isAuthenticated, auth.authorizeRoles('admin'||'employee'), backofficeController.UpdateRenterDetails)
backofficeRouter.post('/backoffice/meter', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.MeterCalculate)
backofficeRouter.post('/backoffice/invoices', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateInvoice)

// TODO: สร้าง API GET RenterDetail
backofficeRouter.get('/backoffice/renter-detail/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetRenterDetail)
backofficeRouter.get('/backoffice/vehicle', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetVehicle)

// TODO: สร้าง contact พร้อม bill details
backofficeRouter.post('/backoffice/contact-payment', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.ContactPayment)

// get room filter with floor
backofficeRouter.get('/backoffice/floor-filter/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetFLoorFilter)
backofficeRouter.get('/backoffice/floors/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetFloorById)

module.exports = backofficeRouter;