const contactController = require("../controllers/contactController");
const router = require("express").Router();

router.post("/add-contact", contactController.addNewContact);
router.post("/mark-spam", contactController.markContactAsSpam);
router.get("/search-contact", contactController.searchContact);

module.exports = router;
