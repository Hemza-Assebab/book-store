const express = require("express");
const {register, login, logout, index, show, update, destroy} = require("../controllers/usersController");
const authAdminMiddleware = require("../middlewares/adminAuth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", authAdminMiddleware, index);
router.get("/:id", authAdminMiddleware, show);
router.put("/:id", authAdminMiddleware, update);
router.delete("/:id", authAdminMiddleware, destroy);

module.exports = router;