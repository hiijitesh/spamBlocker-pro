const express = require("express")

const contactController = require("../controllers/contactController")

const router = express.Router()

router.get("/search-contact", contactController.searchContact)

router.post("/add-new-contact", contactController.addNewContact)

router.post("/mark-contact-as-spam", contactController.markContactAsSapm)

module.exports = router
