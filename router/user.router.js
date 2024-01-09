const router = require("express").Router();
const { upload } = require("../multer.js");

const {
  createUser,
  userActivation,
  loginUser,
} = require("../controller/user.controller.js");

router.post("/create-user", upload.single("file"), createUser);
router.post("/activate", userActivation);
router.post("/login", loginUser);

module.exports = router;
