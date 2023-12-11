/* eslint-disable no-console */
const express = require("express");
const PORT = process.env.PORT || 6500;

const { dbConnection } = require("./database/dbConfig");
const app = express();

const authenticationRoutes = require("./routes/authRoute");
const contactRoutes = require("./routes/contactRoute");
const AuthMiddleware = require("./middlewares/Auth");

app.use(express.json());

app.get("/", (req, res) => {
  const htmlContent = "<html><body><h1>Hello, Spammers!</h1></body></html>";
  res.send(htmlContent);
});

app.use(authenticationRoutes);
app.use(AuthMiddleware, contactRoutes);

dbConnection()
    .then(function () {
        app.listen(PORT, function () {
            console.log(`Server is running on the port ${PORT}`);
        });
    })
    .catch(function (error) {
        console.log(error);
    });
