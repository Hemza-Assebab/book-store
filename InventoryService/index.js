const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const inventoryRouter = require("./routes/inventoryRoutes");
const routeNotFound = require("./middlewares/routeNotFound");
const requestBodyTrim = require("./middlewares/requestBodyTrim");
const cors = require("cors");

const app = express();
connectDB();

app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestBodyTrim);
app.use("/api/inventory", inventoryRouter);
app.use(routeNotFound);

app.listen(process.env.PORT, () => {
    console.log(`Inventory service running on http://localhost:${process.env.PORT}`); 
})