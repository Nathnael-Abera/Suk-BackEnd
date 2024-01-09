const path = require("path");
const ErrorHandler = require("../util/ErrorHandeler");
const User = require("../model/user");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../nodeMailer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../util/sendToken");

module.exports = {
  //create user with single file upload
  createUser: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return next(new ErrorHandler("Please enter email & password", 400));
      }
      const filename = req.file.filename;
      const filePath = path.join(filename);
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        //delete uploaded file
        const fileUrl = `uploads/${filename}`;
        fs.unlink(fileUrl, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Error deleting file" });
          }
        });
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user = {
        name,
        email,
        password,
        avatar: filePath,
      };
      const createActivationToken = (user) => {
        const activationToken = jwt.sign(
          user,
          process.env.ACTIVATION_TOKEN_SECRET,
          {
            expiresIn: "5m",
          }
        );
        return activationToken;
      };
      //user activation
      const activationToken = createActivationToken(user);
      const activationUrl = `${process.env.CLIENT_URL}/user/activate/${activationToken}`;

      try {
        sendMail({
          email: user.email,
          subject: "Email Verification",
          message: `Hello ${user.name}, Please Click on the link to verify your email. This link is valid for 5 minutes. ${activationUrl}`,
        });
        res.status(201).json({
          sucsses: true,
          message: `please check your email:- ${user.email} to activate your account`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  },

  //activate user
  userActivation: catchAsyncErrors(async (req, res, next) => {
    try {
      //verfay activation token
      const { activation_token } = req.body;
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid Token", 400));
      }
      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = User.create({
        name,
        email,
        password,
        avatar,
      });
      //send token
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),

  //login user
  loginUser: catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }
      //send token
      sendToken(user, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
};
