const contactController = require("../controllers/contactController");
const router = require("express").Router();

router.get("/search-contact", contactController.searchContact);
router.post("/add-contact", contactController.addNewContact);
router.post("/mark-spam", contactController.markContactAsSpam);

module.exports = router;
