const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { SECRET } = require("../utils/config");
const User = require("../models/user");
const Session = require("../models/session");
const { tokenValidate } = require("../utils/middleware");

router.get("/", tokenValidate, async (req, res) => {
  return res.status(200).json(req.session);
});

router.post("/", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({
    where: {
      userName: req.body.userName,
    },
  });
  if (!user) {
    return res.status(401).json({
      error: "Can't find user",
    });
  }
  const passwordCorrect = await bcrypt.compare(
    body.password,
    user.passwordHash
  );

  if (!passwordCorrect) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  if (user.status === "locked") {
    return res.status(401).json({
      error: "account locked, please contact an administrator",
    });
  }

  const userForToken = {
    userName: user.userName,
    id: user.id,
    status: user.status,
    infoCompleted: user.infoCompleted,
  };

  const token = jwt.sign(userForToken, SECRET);
  await Session.create({ token: token, userId: user.id, status: user.status, infoCompleted: user.infoCompleted });
  res.status(200).json({
    token: token,
    userName: userForToken.userName,
    userId: userForToken.id,
    status: userForToken.status,
    infoCompleted: userForToken.infoCompleted
  });
});
module.exports = router;
