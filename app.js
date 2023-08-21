/* eslint-disable no-console */
const express = require("express");

const { dbConnection } = require("./database/dbConfig");

const app = express();

const authenticationRoutes = require("./routes/authRoute");
const contactRoutes = require("./routes/contactRoute");
const AuthMiddleware = require("./middlewares/Auth");

app.use(express.json());

app.use(authenticationRoutes);
// app.use(isAuthenticated);
app.use(AuthMiddleware, contactRoutes);

dbConnection()
  .then(function () {
    app.listen(3000, function () {
      console.log("Server has started!");
    });
  })
  .catch(function (error) {
    console.log(error);
  });
