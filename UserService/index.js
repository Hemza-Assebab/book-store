const express = require("express");
const usersRouter = require("./routes/usersRouter");
const routeNotFound = require("./middlewares/routeNotFound");
const requestBodyTrim = require("./middlewares/requestBodyTrim");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(requestBodyTrim);
app.use("/api/users", usersRouter);
app.use(routeNotFound);

app.listen(process.env.PORT, () => {
    console.log(`User service running on http://localhost:${process.env.PORT}`); 
});