const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const Register = require("./models/register");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("Pages/login");
});

app.get("/register", (req, res) => {
  res.render("Pages/Register");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Register.findOne({ username });

  if (!user) {
    return res.status(401).send("Username not found");
  }

  if (user.password !== password) {
    return res.status(401).send("Incorrect password");
  }

  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existingEmailUser = await Register.findOne({ email });
  const existingUsernameUser = await Register.findOne({ username });
  const existingPassword = await Register.findOne({ password });

  if (existingEmailUser && existingUsernameUser && existingPassword) {
    return res.status(400).send("Username,email and password already exist");
  } else if (existingEmailUser) {
    return res.status(400).send("Email already exists");
  } else if (existingUsernameUser) {
    return res.status(400).send("Username already exists");
  } else if (existingPassword) {
    return res.status(400).send("Password already exists");
  }
  
  const newRegisterUser = new Register({ username, email, password });

  try {
    await newRegisterUser.save();
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

