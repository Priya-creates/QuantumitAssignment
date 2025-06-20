const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      dob,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.status(200).json({
      status: "success",
      message: "User registered successfully",
      token: token,
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failure",
      message: err.message,
    });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Email or password is incorrect",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res.status(200).json({
      status: "success",
      token: token,
      message: "User loggedIn successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      status: "failure",
      message: err.message || "Internal server error ",
    });
  }
};

exports.userDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      status: "success",
      message: "User has sucessfully registered!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failure",
      message: err.message || "Internal server error",
    });
  }
};
