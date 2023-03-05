const { User } = require("../models");
const { default: UserTypes } = require("../utils/constants/UserTypes");

const UserController = {
  signup: async (req, res) => {
    const { email, password, userType } = req.body;
    // if (!Object.values(UserTypes).includes(userType)) {
    //   return res
    //       .status(400)
    //       .json({ message: "Invalid user type" });
    // }

    try {
      const existingUser = await User.findByEmail(email);

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const newUser = await User.create({ email, password, userType });

      return res.status(201).json({ user: newUser });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  },
  getUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = User.findByPk(userId);

      if (user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch(error) {
      res.status(500).json({ message: error.message() });
    }

  }
};

module.exports = UserController;
