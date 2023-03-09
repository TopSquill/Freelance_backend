const { User } = require("../models");
const { default: UserTypes } = require("../utils/constants/UserTypes");
const { parseEmailToken } = require("../utils/function/user");

const UserController = {
  signup: async (req, res) => {
    const { name, email, password, userType } = req.body;

    try {
      const existingUserWithEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (existingUserWithEmail) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // const existingUserWithMobile = await User.findOne({
      //   where: {
      //     mobileNo: mobile,
      //   },
      // });

      // if (existingUserWithEmail) {
      //   return res
      //     .status(400)
      //     .json({ message: "User with this mobile already exists" });
      // }

      const newUser = await User.create({ name, email, password, userType });

      delete newUser.dataValues.password;
      return res.status(201).json({ user: newUser });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
    }
  },
  verifyEmail: async (req, res) => {
    const { token } = req.params;
    const {userId, verifyToken} = parseEmailToken(token);

    try {
      const success = await User.verifyUserEmail(userId, verifyToken);

      return res.status(200).send({ success });
    } catch(err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  verifyPhone: async (req, res) => {
    try {
      return res.status(200).send()
    } catch(err) {
      return res.status(400).json({ message: err.message });
    }
  },
  getUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = User.findByPk(userId);

      if (user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message() });
    }
  },
  resendVerificationMail: async (req, res) => {
    const { userId } = req.body;

    try {
      const user = User.findByPk(userId);
      const success = await User.verifyUserEmail(user);
      res.status(200).send({ success })
    } catch (error) {
      res.status(500).json({ message: error.message() });
    }
  },
  login: async (req, res) => {

  },
  getAllProjects: async (req, res) => {
    const { userId } = req.query;

    try {
      res.status(200).json({ user: await User.getAllProjects(userId) });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = UserController;
