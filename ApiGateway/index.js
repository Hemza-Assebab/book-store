const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { USERS_API } = require("./URLs");

const app = express();

const optionsUsers = {
    target: USERS_API,
    changeOrigin: true,
    logger: console
}

const usersProxy = createProxyMiddleware(optionsUsers);

app.get("/", (req, res) => {
    res.status(200).json({message: "Hello"});
});

app.use("/users", usersProxy);

app.listen(5000, () => {
    console.log("Api Gateway running on http://localhost:5000");
})