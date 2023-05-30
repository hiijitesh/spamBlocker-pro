const express = require("express")

const { dbConnection } = require("./database/dbConfig")

const app = express()

const authenticationRoutes = require("./routes/authRoute")
const contactRoutes = require("./routes/contactRoute")

const checkAuthentication = require("./middlewares/checkAuthentication")

app.use(express.json())

app.use(authenticationRoutes)
app.use(checkAuthentication)
app.use(contactRoutes)

dbConnection()
	.then(function () {
		app.listen(3000, function () {
			console.log("Server has started!")
		})
	})
	.catch(function (error) {
		console.log(error)
	})
