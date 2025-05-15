require("dotenv").config();
const express = require("express");
const {register, login, logout, refreshAccessToken, index, show, update, destroy} = require("../controllers/usersController");
const authAdminMiddleware = require("../middlewares/adminAuth");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/refreshAccessToken", refreshAccessToken);
router.get("/", authAdminMiddleware, index);
router.get("/:id", authAdminMiddleware, show);
router.put("/:id", authAdminMiddleware, update);
router.delete("/:id", authAdminMiddleware, destroy);

module.exports = router;