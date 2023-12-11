const router = require("express").Router();

router.post("/", authController.userSignup);

module.exports = router;
