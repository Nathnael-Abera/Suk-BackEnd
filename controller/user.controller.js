const path = require("path");
const ErrorHandler = require("../util/ErrorHandeler");
const User = require("../model/user");
const fs = require("fs");

module.exports = {
  //create user with single file upload
  createUser: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
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
      //create user
      const newUser = await User.create(user);
      console.log(newUser);

      res.send({
        success: true,
        message: "User created successfully",
        newUser,
      });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  },
  //upload single file
};
