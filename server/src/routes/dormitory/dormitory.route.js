const express = require('express');
const dormitoryRouter = express.Router();
const auth = require('../../middleware/auth');
const dormitoryController = require('../../controllers/dormitory/dormitory.controller');
const dormitoryUserController = require('../../controllers/dormitory/userindormitory.controller');

dormitoryRouter.post('/dormitory', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.DormitoryCreate)
dormitoryRouter.post('/dormitory-rooms-floors-update', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.EditRoomsAndFloors)
dormitoryRouter.post('/dormitory-rooms-price', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.UpdatePriceForRoom)
dormitoryRouter.post('/dormitory-rooms-water-electric', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.UpdateWaterAndElectricPrice)
dormitoryRouter.get('/get-all-rooms/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.GetAllRooms)
dormitoryRouter.get('/get-meter-by-dormitory/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.GetMeterByDormitoryId)
dormitoryRouter.get('/get-bank/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.GetBankByDormitoryId)
dormitoryRouter.get('/get-bank-user/:id', auth.isAuthenticated, dormitoryController.GetBankByDormitoryIdForUser)
dormitoryRouter.put('/update-meter', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.UpdateMeter)
dormitoryRouter.post('/bank', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.BankAccount)
dormitoryRouter.get('/get-dormitory-by-user/:id', auth.isAuthenticated, dormitoryController.GetDormitoryByUser)
dormitoryRouter.get('/dormitory/:id', auth.isAuthenticated, dormitoryController.GetDormitoryByID)
dormitoryRouter.post('/dormitroy/booking', auth.isAuthenticated, dormitoryController.Booking)
dormitoryRouter.get('/dormitory', auth.isAuthenticated, dormitoryController.GetDormitory)
dormitoryRouter.get('/dormitory-connection', auth.isAuthenticated, dormitoryUserController.DormitoryConnectionRenter)
dormitoryRouter.post('/dormitory-connection', auth.isAuthenticated, dormitoryUserController.DormitoryConnection)
dormitoryRouter.post('/dormitory-search', auth.isAuthenticated, dormitoryUserController.DormitorySearchByID)
dormitoryRouter.get('/dormitory-user-connect' , auth.isAuthenticated, dormitoryUserController.DormitoryConnectionUser)
dormitoryRouter.put('/dormitory-user-connect', auth.isAuthenticated, dormitoryUserController.DisconnectDormitory)
dormitoryRouter.get('/dormitory-connection/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryUserController.DormitoryConnectionUserByID)
dormitoryRouter.post('/repair', auth.isAuthenticated, dormitoryController.Repair)


module.exports = dormitoryRouter;