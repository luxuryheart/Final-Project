import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
require('dotenv').config();

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/`);
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (error: Error) => console.log(error));

