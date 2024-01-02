const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Minimum password length is 6 characters"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  avatar: {
    type: String,

    //   public_id: {
    //     type: String,
    //     // required: true,
    //   },
    //   url: {
    //     type: String,
    //     // required: true,
    //   },
    // },
  },
  phoneNumber: {
    type: String,
  },
  address: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // timestamps
  createdAt: { type: Date, default: Date.now },
});

// hash password before saving
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = require("bcrypt").hashSync(user.password, 8);
  next();
});
// method to compare password (used for logging in)
userSchema.methods.comparePassword = function (password) {
  return require("bcrypt").compareSync(password, this.password);
};
//jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
module.exports = mongoose.model("User", userSchema);
