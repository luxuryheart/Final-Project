const express = require('express');
const backofficeRouter = express.Router();
const backofficeController = require('../../controllers/backoffice/backoffice.controller')
const roomBOController = require('../../controllers/backoffice/roombo.controller')
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
backofficeRouter.get('/backoffice/water-units/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetWaterUnits)
backofficeRouter.get('/backoffice/electric-units/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetElectricUnits)

// create meter unit prt month
backofficeRouter.post('/backoffice/meter-units', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateMeterUnit)
// get room and floor by meter unit per month
backofficeRouter.get('/backoffice/room-by-meter-units/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetRoomByMeterUnit)
backofficeRouter.put('/backoffice/meter-units', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateMeterUnit)
// create electric unit prt month
backofficeRouter.post('/backoffice/electric-units', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateElectricUnitPerMonth);
// backofficeRouter.get('/backoffice/meter-units/:id/:date', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetMeterUnit)
backofficeRouter.get('/backoffice/room-by-elec-meter-units/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetElectricalMeterUnit)
backofficeRouter.put('/backoffice/electric-units', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateElectricUnitPerMonth);

// create invoice
backofficeRouter.post('/backoffice/invoiced', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateInvoiced)
backofficeRouter.put('/backoffice/invoiced', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateInvoicedList)
backofficeRouter.get('/backoffice/invoiced-list/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetInvoicedList)
backofficeRouter.get('/backoffice/inoviced/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetInvoicedByID)
backofficeRouter.delete('/backoffice/list/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.DeleteInvoicedList)
backofficeRouter.put('/backoffice/list', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateList)
backofficeRouter.delete('/backoffice/invoiced/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.DeleteInvoiced)
backofficeRouter.put('/backoffice/list-update', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateListData)
backofficeRouter.post('/backoffice/invoiced-all', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateInvoicedAll)

// room backoffice
backofficeRouter.get('/backoffice/room/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), roomBOController.GetRoomByID)
backofficeRouter.put('/backoffice/room', auth.isAuthenticated, auth.authorizeRoles('admin'), roomBOController.UpdateRoom)
backofficeRouter.put('/backoffice/water-meter', auth.isAuthenticated, auth.authorizeRoles('admin'), roomBOController.UpdateWaterMeter)
backofficeRouter.put('/backoffice/electric-meter', auth.isAuthenticated, auth.authorizeRoles('admin'), roomBOController.UpdateElectricMeter)

// get dormitory
backofficeRouter.get('/backoffice/dormitory/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetDormitoryByID)
backofficeRouter.put('/backoffice/dormitory', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateDormitory)
backofficeRouter.delete('/backoffice/dormitory/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.DeleteDormitory)
backofficeRouter.put('/backoffice/bank', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateBank)
backofficeRouter.delete('/backoffice/bank/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.DeleteBank)

// user 
backofficeRouter.get('/backoffice/user/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetUserByDormitoryID)

// payment by admin
backofficeRouter.post('/backoffice/payment', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.PaymentByAdmin)
backofficeRouter.get('/backoffice/payment/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetPaymentByAdmin)
backofficeRouter.post('/backoffice/bank-transfer', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.BankTransferPayment)

// booking
backofficeRouter.post('/backoffice/booking', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.BookingByAdmin)
backofficeRouter.get('/backoffice/booking/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetBookingByRoomID)
backofficeRouter.delete('/backoffice/booking/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CancelBookingByAdmin)
backofficeRouter.put('/backoffice/booking', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateBookingByAdmin)

// contact 
backofficeRouter.get('/backoffice/contact/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetContactByRoomID)
backofficeRouter.delete('/backoffice/contact/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CancelContactByID)
backofficeRouter.get('/backoffice/renter/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetRenterByDormitoryID)
backofficeRouter.put('/backoffice/user-disconnect', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.DisconnectUser)


// repair
backofficeRouter.post('/backoffice/repair', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.RepairByAdmin)
backofficeRouter.get('/backoffice/repair', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.GetRepair)
backofficeRouter.put('/backoffice/repair', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.UpdateRepairByAdmin)
// backofficeRouter.delete('/backoffice/repair/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CancelRepairByAdmin)

module.exports = backofficeRouter;