const express = require('express');
const backofficeRouter = express.Router();
const backofficeController = require('../../controllers/backoffice/backoffice.controller')
const auth = require('../../middleware/auth')

backofficeRouter.post('/backoffice/rooms', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateContact)
backofficeRouter.post('/backoffice/user-detail', auth.isAuthenticated, auth.authorizeRoles('admin'||'employee'), backofficeController.UpdateRenterDetails)
backofficeRouter.post('/backoffice/meter', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.MeterCalculate)

module.exports = backofficeRouter;