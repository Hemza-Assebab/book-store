const express = require("express");
const booksRouter = require("./routes/booksRouter");
const routeNotFound = require("./middlewares/routeNotFound");
const requestBodyTrim = require("./middlewares/requestBodyTrim");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestBodyTrim);
app.use("/api/books", booksRouter);
app.use(routeNotFound);

app.listen(process.env.PORT, () => {
    console.log(`Book service running on http://localhost:${process.env.PORT}`);
})