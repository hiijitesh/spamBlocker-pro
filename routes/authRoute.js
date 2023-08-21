const AuthMiddleware = require("../middlewares/Auth");
const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", authController.userSignup);
router.post("/login", authController.userLogin);
router.post("/logout", authController.userLogout);
router.post("/access-token", authController.getAccessToken);
router.post("/add-email", AuthMiddleware, authController.addUserEmail);

module.exports = router;
