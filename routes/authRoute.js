const express = require("express")

const isAuthenticated = require("../middlewares/checkAuthentication")
const authController = require("../controllers/authController")

const router = express.Router()

router.post("/signup", authController.userSignup)

router.post("/login", authController.userLogin)

router.post("/logout", authController.userLogout)

router.post("/get-access-token", authController.getAccessToken)

router.post("/add-user-email", isAuthenticated, authController.addUserEmail)

module.exports = router
