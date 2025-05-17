const express = require("express");
const connectDB = require("./config/db");
const ordersRouter = require("./routes/ordersRouter");
const routeNotFound = require("./middlewares/routeNotFound");
const requestBodyTrim = require("./middlewares/requestBodyTrim");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(requestBodyTrim);
app.use("/api/orders", ordersRouter);
app.use(routeNotFound);

app.listen(process.env.PORT, () => {
    console.log(`Order service running on http://localhost:${process.env.PORT}`);
});