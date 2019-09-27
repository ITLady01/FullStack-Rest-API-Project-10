"use strict"; // Help write better code

// Loading modules
const express = require("express"); // Bring in the express module
const morgan = require("morgan");
const bodyParser = require("body-parser"); // logic to parse the JSON in the incoming request
const { sequelize } = require("./models");
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

const app = express(); // Create the Express app - controls how the app behaves when restful requests are made to it

// Enables cors requests
app.use(cors());

(async () => {
  try {
    await sequelize.authenticate(); // Test the connection to the database
    console.log("Connection to the database was successful");
    await sequelize.sync(); // Sync the models
    console.log("Models are synchronized with the database");
  } catch (err) {
    console.log("Connection to the database was unsuccessful" + " " + err);
  }
})();

// setup morgan which gives us HTTP request logging
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setup your api routes here
app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/courses"));

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my REST API project! Thank you for visiting my page!"
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    errors: {}
  });
});

// specify port to serve the app on
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
