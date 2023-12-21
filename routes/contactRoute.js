const contactController = require("../controllers/contactController");
const router = require("express").Router();

router.post("/add-contact", contactController.addNewContact);
router.get("/search", contactController.searchContact);

module.exports = router;
