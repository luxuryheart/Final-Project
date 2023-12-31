const express = require('express');
const dormitoryRouter = express.Router();
const auth = require('../../middleware/auth');
const dormitoryController = require('../../controllers/dormitory/dormitory.controller');

dormitoryRouter.post('/dormitory', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.DormitoryCreate)
dormitoryRouter.post('/dormitory-rooms-floors-update', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.EditRoomsAndFloors)
dormitoryRouter.post('/dormitory-rooms-price', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.UpdatePriceForRoom)
dormitoryRouter.post('/dormitory-rooms-water-electric', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.UpdateWaterAndElectricPrice)
dormitoryRouter.get('/get-all-rooms/:id', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.GetAllRooms)

module.exports = dormitoryRouter;