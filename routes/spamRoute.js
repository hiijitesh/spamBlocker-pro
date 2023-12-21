const spamController = require("../controllers/spamController");
const { isAuthenticated } = require("../middlewares/Auth");
const router = require("express").Router();

router.post("/mark-spam", isAuthenticated, spamController.markContactAsSpam);

module.exports = router;
