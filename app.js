const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Register = require("./models/register");
const catchAsync = require("./utils/catchAsync");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const flash = require("connect-flash");

const { validateLogin, validateRegistration } = require("./schemas");

mongoose.connect("mongodb://127.0.0.1:27017/FIM", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(flash());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  const username = req.session.username;
  const userId = req.session.userId;
  res.render("home", { isLoggedIn, username, userId });
});

app.get("/login", (req, res) => {
  res.render("Pages/login", {
    successMessage: req.flash("success"),
    errorMessage: req.flash("error"),
  });
});

app.get("/register", (req, res) => {
  res.render("Pages/Register", {
    successMessage: req.flash("success"),
    errorMessage: req.flash("error"),
  });
});

app.post(
  "/login",
  validateLogin,
  catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await Register.findOne({ username });

    if (!user) {
      req.flash("error", "Username not found");
      return res.redirect("/login");
    }

    if (user.password !== password) {
      req.flash("error", "Incorrect Password, please try again");
      return res.redirect("/login");
    }
    req.session.isLoggedIn = true;
    req.session.username = username;
    req.session.userId = user._id;
    req.flash("success", "Successfully logged in");
    res.redirect("/");
  })
);

app.post("/register", validateRegistration, async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const existingEmailUser = await Register.findOne({ email });
    const existingUsernameUser = await Register.findOne({ username });
    const existingPassword = await Register.findOne({ password });

    if (existingEmailUser && existingUsernameUser && existingPassword) {
      req.flash("error", "Username,email and password already exist");
      return res.redirect("/register");
    } else if (existingEmailUser) {
      req.flash("error", "Email already exists");
      return res.redirect("/register");
    } else if (existingUsernameUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/register");
    } else if (existingPassword) {
      req.flash("error", "Password already exists");
      return res.redirect("/register");
    }

    const newRegisterUser = new Register({
      username,
      email,
      password,
    });

    await newRegisterUser.save();
    req.flash("success", "Registration Successful. You can login");
    res.redirect("/login");
  } catch (err) {
    next(new catchAsync(err.message, 500));
  }
});

app.get("/instructions", (req, res) => {
  res.render("Pages/Instructions");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no,Something went wrong";
  res.status(statusCode).render("errorMessage", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
