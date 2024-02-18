const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth')
// const cron = require('node-cron');

userRouter.post('/register', userController.Register);
userRouter.post('/login', userController.Login);
userRouter.get('/users', auth.isAuthenticated, auth.authorizeRoles('admin'), userController.getAllUser);
userRouter.put('/user-update', auth.isAuthenticated, userController.updateProfileUser);
userRouter.get('/user-detail', auth.isAuthenticated, userController.getUserDetail);
userRouter.get('/inoviced/:id', auth.isAuthenticated, userController.GetInvoicedByID)

// cron.schedule('* * * * *', () => {
//     userController.getAllUser()
//     console.log('running a task every minute');
// })

module.exports = userRouter;