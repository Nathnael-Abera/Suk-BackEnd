const router = require("express").Router();
const { upload } = require("../multer.js");

const { createUser } = require("../controller/user.controller.js");

router.post("/create-user", upload.single("file"), createUser);

module.exports = router;
