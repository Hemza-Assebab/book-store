const express = require("express");
const {register, login, index, show, update, destroy} = require("../controllers/usersController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", index);
router.get("/:id", show);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;