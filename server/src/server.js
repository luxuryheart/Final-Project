const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const dbConnect = require('./config/db');

//midleware config
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

// import route
const userRouter = require('./routes/user.route');
const dormitoryRouter = require('./routes/dormitory/dormitory.route')
const backofficeRouter = require('./routes/backoffice/backoffice.route')
const paymentRouter = require('./routes/payment/payment.route')

// user routes
app.use('/api/v1', userRouter, dormitoryRouter, backofficeRouter, paymentRouter);

// db connection and server listening
dbConnect()
    .then(()=> {
        console.log('MongoDB is connected');
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(err => console.log(err));
