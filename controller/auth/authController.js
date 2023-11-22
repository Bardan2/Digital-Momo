const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

// Register api.....
exports.registerUser = async (req, res) => {
  const { email, password, phoneNumber, username } = req.body;
  if (!email || !password || !phoneNumber || !username) {
    return res.status(400).json({
      message: "Please provide email, password, phoneNumber",
    });
  }

  // check if that email user alredy exist or not
  const userFound = await User.find({ userEmail: email });
  if (userFound.length > 0) {
    return res.status(400).json({
      message: "User with that email already registered",
    });
  }

  //   else
  await User.create({
    userName: username,
    userPhoneNumber: phoneNumber,
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 10),
  });

  res.status(201).json({
    message: "User registered successfully",
  });
};

// Login user....
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide your email, password",
    });
  }
  // check if that email user exists or not
  const userFound = await User.find({ userEmail: email });
  if (userFound.length == 0) {
    return res.status(404).json({
      message: "User with that email is not Registerd",
    });
  }

  // password...check
  const isMatched = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatched) {
    // generate token
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } else {
    res.status(404).json({
      message: "Invalid Password",
    });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }

  // check if that email is registered or not
  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }

  // send OTP to that email
  const otp = Math.floor(1000 + Math.random() * 9000);
  // OTP save..
  userExist[0].otp = otp;
  await userExist[0].save();
  await sendEmail({
    email: email,
    subject: "Your OTP for digitalmomo forgot password. Change your password",
    message: `${otp}`,
  });
  res.status(200).json({
    message: "OTP sent successfully!",
  });
};

// verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide Email and OTP",
    });
  }

  // check if that otp is correct or not of that email
  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(404).json({
      message: "Email is not registered!",
    });
  }
  if (userExists[0].otp !== otp) {
    res.status(400).json({
      message: "Invalid OTP",
    });
  } else {
    // dispost the otp so cannot be used next time the same otp
    userExists[0].otp = undefined;
    await userExists[0].save();
    res.status(200).json({
      message: "OTP is correct",
    });
  }
};

// Reset Password and confirm Password...
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email, newPassword, confirmPassword",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "newPassword and confirmPassword doesn't match",
    });
  }

  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(404).json({
      message: "User email not registered",
    });
  }

  userExists[0].userPassword = bcrypt.hashSync(newPassword, 10);
  await userExists[0].save();

  res.status(200).json({
    message: "Password changed successfully",
  });
};
