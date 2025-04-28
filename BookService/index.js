const express = require("express");
const booksRouter = require("./routes/booksRouter");
const routeNotFound = require("./middlewares/routeNotFound");
const requestBodyTrim = require("./middlewares/requestBodyTrim");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json());
app.use(requestBodyTrim);
app.use("/api/books", booksRouter);
app.use(routeNotFound);

app.listen(process.env.PORT, () => {
    console.log(`Book service running on http://localhost:${process.env.PORT}`);
})