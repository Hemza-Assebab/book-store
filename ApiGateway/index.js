const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { USER_API, BOOK_API, INVENTORY_API, ORDER_API } = require("./URLs");

const app = express();

const optionsUser = {
    target: USER_API,
    changeOrigin: true,
    logger: console
}

const optionsBook = {
    target: BOOK_API,
    changeOrigin: true,
    logger: console
}

const optionsInventory = {
    target: INVENTORY_API,
    changeOrigin: true,
    logger: console
}

const optionsOrder = {
    target: ORDER_API,
    changeOrigin: true,
    logger: console
}

const usersProxy = createProxyMiddleware(optionsUser);
const booksProxy = createProxyMiddleware(optionsBook);
const inventoryProxy = createProxyMiddleware(optionsInventory);
const orderProxy = createProxyMiddleware(optionsOrder);

app.get("/", (req, res) => {
    res.status(200).json({message: "Hello"});
});

app.use("/users", usersProxy);
app.use("/books", booksProxy);
app.use("/inventory", inventoryProxy);
app.use("/orders", orderProxy);

app.listen(5000, () => {
    console.log("Api Gateway running on http://localhost:5000");
})