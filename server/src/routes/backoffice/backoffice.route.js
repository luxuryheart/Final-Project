const express = require('express');
const backofficeRouter = express.Router();
const backofficeController = require('../../controllers/backoffice/backoffice.controller')
const auth = require('../../middleware/auth')

backofficeRouter.post('backoffice/rooms', auth.isAuthenticated, auth.authorizeRoles('admin'), backofficeController.CreateContact)

module.exports = backofficeRouter;