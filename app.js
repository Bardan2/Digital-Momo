const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

// const { registerUser, loginUser } = require("./controller/auth/authController");

// Routes here

const authRouter = require("./routes/authRoute");
// const { promises } = require("nodemailer/lib/xoauth2");

// Route end here

// tell node to use dotenv
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);
// test api to check if server is live or not
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am alive",
  });
});

// user Apis...
app.use("", authRouter);
// /register
//  /login
// example: here...
// app.use("/hello", authRouter);
// /hello/register
// /hello/login

// end

const PORT = process.env.PORT;
// listen server
app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
