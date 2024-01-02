const express = require("express");
const ErrorHandler = require("./util/ErrorHandeler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const user = require("./router/user.router");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
//helmet
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("uploads"));
app.use(cookieParser());

//import router
app.use("/api/user", user);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
//its for errorHandling
app.use(ErrorHandler);

module.exports = app;
