import express from 'express';
import mongoose from 'mongoose';
const { connect } = mongoose;

import bodyParser from 'body-parser';
const { json, urlencoded } = bodyParser;

import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())



/* configure body-parser */
app.use(json())
app.use(urlencoded({ extended: true }))

import { auth_route, user_route, product_route, cart_route, order_route, payment_route } from './routes/index.js';

app.use('/api/v1/auth', auth_route);
app.use('/api/v1/users', user_route);
app.use('/api/v1/products', product_route);
app.use('/api/v1/carts', cart_route);
app.use('/api/v1/orders', order_route);
// app.use('/api/v1/orderpayment', payment_route);


import { URI } from './config/database-config-example.js';

/* connecting to the database */
connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

/* listen for requests */
app.listen(9000, () => {
    console.log("Server is listening on port 9000");
});