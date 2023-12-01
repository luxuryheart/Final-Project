const express = require('express');
const dormitoryRouter = express.Router();
const auth = require('../../middleware/auth');
const dormitoryController = require('../../controllers/dormitory/dormitory.controller');

dormitoryRouter.post('/dormitory', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.DormitoryCreate)
dormitoryRouter.post('/dormitory-rooms-floors-update', auth.isAuthenticated, auth.authorizeRoles('admin'), dormitoryController.EditRoomsAndFloors)

module.exports = dormitoryRouter;