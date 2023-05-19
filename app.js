const epxress = require("express");
const connectDB = require("./config/mongoConnector");
const app = epxress();
const userRoutes = require("./routes/userRoutes");
const error = require("./middlewares/error");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });
connectDB();

// using middleware
app.use(epxress.json());
app.use(epxress.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(cors());

// import routes
app.use("/api/v1", userRoutes);


// error midleware
app.use(error);

module.exports = app;
