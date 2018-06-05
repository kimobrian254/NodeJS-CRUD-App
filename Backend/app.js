const express = require("express");
const app = express();
const router = express.Router();
const logger = require("morgan");
const loggerW = require("winston");
let cookieParser = require("cookie-parser");

require("dotenv").config();
const createError = require("http-errors");
const auth = require("./utils/auth");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded( { extended: false }));
app.use(cookieParser());

app.use(auth.passport.initialize());

router.post("/signup", auth.signupUser);
router.post("/login", auth.loginUser);
router.post("/secure", auth.passport.authenticate("jwt", { session: false}), (req, res)=> {
  res.json({message: "Success! You can not see this without a token"});
});

require("./routes")(router);

app.use(`/api/${process.env.version}/`, router);

app.use("*", (req, res) => {
  res.status(404).send(createError(404));
});

app.use((err, req, res, next) => {
  loggerW.error(err);
  res.status(500).send(createError(500, "Something Broke! Try Again"));
});
module.exports = app;
