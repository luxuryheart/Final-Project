const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth')

userRouter.post('/register', userController.Register);
userRouter.post('/login', userController.Login);
userRouter.get('/users', auth.isAuthenticated, auth.authorizeRoles('admin'), userController.getAllUser);
userRouter.put('/user-update', auth.isAuthenticated, userController.updateProfileUser);
userRouter.get('/user-detail', auth.isAuthenticated, userController.getUserDetail);

module.exports = userRouter;