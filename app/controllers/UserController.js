const { User } = require("../models");
const { default: UserTypes } = require("../utils/constants/UserTypes");
const { parseEmailToken, getUser } = require("../utils/function/user");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../models");
const { AlreadyVerifyMailError } = require("../utils/errors/users");
const { showError } = require("../utils/function/common");
const { getJWTToken } = require("../utils/function/user");

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

      await User.create({ name, email, password, userType }, { returning: false });

      return res.status(201).json({ success: true, message: 'Verification mail has been sent' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: showError(error) });
      }
    }
  },
  verifyEmail: async (req, res) => {
    const { token } = req.params;
    const {userId, verifyToken} = parseEmailToken(token);

    try {
      const user = await User.verifyUserEmail(userId, verifyToken);
      const token = getJWTToken(user);

      return res.status(200).send({ success, token, user });
    } catch(err) {
      if (err instanceof AlreadyVerifyMailError) {
        return res.status(405).json({ message: err.message })
      }
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
  verifyPhone: async (req, res) => {
    try {
      // TO be implemented
      return res.status(200).send({ message: 'verified' })
    } catch(err) {
      return res.status(400).json({ message: err.message });
    }
  },
  // getUser: async (req, res) => {
  //   const { userId } = req.params;

  //   try {
  //     const user = await User.findByPk(userId);

  //     if (user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     res.status(200).json({ user });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message() });
  //   }
  // },
  resendVerificationMail: async (req, res) => {
    const { email } = req.body;

    return User.findOne({ where: { email }}).then(user => {

      if (!user) {
        return res.status(404).send({ message: 'User not found'});
      }

      if (user.isEmailVerified) throw new Error('Email already verified');

      user.verifyUserByMail();
    }).then(() => {
      return res.status(200).send({ message: 'Mail sent successfully'});
    }).catch(err => {
      return res.status(400).send({ message: err.message })
    })
  },
  login: async (req, res) => {
    const { email, phone, password } = req.body;
    let user;

    try {
      user = await User.scope('includePassword').findOne({
        where: { email }
      });

      if (!user)
        return res.status(404).send({ message: 'User not found' })
    } catch(err) {
      return res.status(400).send({ message: err.message })
    }

    return bcrypt.compare(password, user.password).then((success) => {
      if (!success) return res.status(400).send({ message: 'Incorrect password' })

      if (user.isEmailVerified) {
        delete user.dataValues['password']
        const token = getJWTToken(user)

        return res.status(200).send({ token, user })
      }

      return res.status(400).send({ message: 'Email not verified' })
    });
  },
  updateProfile: async (req, res) => {
    const { country, mobileNo, name } = req.body;

    try {
      const user = getUser(req);

      const updatedUser = await user.update({ country, mobileNo, name }, { returning: true })

      return res.status(200).send({ user: updatedUser });
    } catch(err) {
      return res.status(400).send({ message: err.message });
    }
  }
};

module.exports = UserController;
