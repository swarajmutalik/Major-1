const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegisterSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username cannot be left blank"],
  },

  email: {
    type: String,
    required: [true, "Email cannot be left blank"],
  },

  password: {
    type: String,
    required: [true, "Password cannot be left blank"],
  },

  hashedPassword: {
    type: String,
  },
});

module.exports = mongoose.model("Register", RegisterSchema);
