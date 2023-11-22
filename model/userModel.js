const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userShema = new Schema({
  userEmail: {
    type: String,
    required: [true, "Email must be provided"],
  },
  userPhoneNumber: {
    type: Number,
    required: [true, "PhoneNumber must be provided"],
  },
  userName: {
    type: String,
    required: [true, "Username must be provided"],
  },
  userPassword: {
    type: String,
    required: [true, "Password must be provided"],
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  otp :  {
    type : Number
  }
});

const User = mongoose.model("User", userShema);

module.exports = User;
