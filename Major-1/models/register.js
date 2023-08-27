const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegisterSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("Register", RegisterSchema);
