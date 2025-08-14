const express = require("express");
const { register, login, getMe } = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth");
const ROLES = require("../constants/roles");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth(ROLES.CUSTOMER, ROLES.ADMIN), getMe);

module.exports = router;
