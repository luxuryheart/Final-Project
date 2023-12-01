const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth')

userRouter.post('/register', userController.Register);
userRouter.post('/login', userController.Login);
userRouter.get('/user', auth.isAuthenticated, auth.authorizeRoles('admin'), userController.getAllUser);
userRouter.put('/user-update', auth.isAuthenticated, userController.updateProfileUser);

module.exports = userRouter;