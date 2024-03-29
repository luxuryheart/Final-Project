const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth')

userRouter.post('/register', userController.Register);
userRouter.post('/login', userController.Login);
userRouter.get('/users', auth.isAuthenticated, auth.authorizeRoles('admin'), userController.getAllUser);
userRouter.put('/user-update', auth.isAuthenticated, userController.updateProfileUser);
userRouter.get('/user-detail', auth.isAuthenticated, userController.getUserDetail);
userRouter.get('/inoviced/:id', auth.isAuthenticated, userController.GetInvoicedByID)
userRouter.get('/user', auth.isAuthenticated, userController.GetUser)
userRouter.put('/user', auth.isAuthenticated, userController.UpdateUser)

module.exports = userRouter;