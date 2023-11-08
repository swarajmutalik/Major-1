const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const Register = require("./models/register");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://127.0.0.1/File-Integrity-Monitor", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.get("/", (req, res) => {
  res.render("home");
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

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Register.findOne({ username });

  if (!user) {
    req.flash("error", "Username not found");
    return res.redirect("/login");
  }

  if (user.password !== password) {
    req.flash("error", "Incorrect Password, Please try again");
    return res.redirect("/login");
  }

  req.session.isLoggedIn = true;
  req.session.username = username;
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

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

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newRegisterUser = new Register({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newRegisterUser.save();
    req.flash("success", "Registration Successful. You can login");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

app.get("/instructions", (req, res) => {
  res.render("Pages/Instructions");
});

app.get("/download-file",(req,res) =>{
  res.download("C:/Users/dwive/Desktop/maj/Major-1/Major-1/Files/FileWatchDog.zip");
});
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
