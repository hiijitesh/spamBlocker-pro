/* eslint-disable no-console */
const express = require("express");

const { dbConnection } = require("./database/dbConfig");
const PORT = process.env.PORT || 65000;
const app = express();

const authenticationRoutes = require("./routes/authRoute");
const contactRoutes = require("./routes/contactRoute");
const AuthMiddleware = require("./middlewares/Auth");

app.use(express.json());

app.use(authenticationRoutes);
app.use(AuthMiddleware, contactRoutes);

dbConnection()
  .then(function () {
    app.listen(PORT, function () {
      console.log(`Server has started on port ${PORT}`);
    });
  })
  .catch(function (error) {
    console.log(error);
  });
