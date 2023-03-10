const { User } = require("../models");
const { default: UserTypes } = require("../utils/constants/UserTypes");
const { parseEmailToken } = require("../utils/function/user");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../models");

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
        return false;
      }
      if (user.isEmailVerified) throw new Error('Email already verified');

      return user.verifyUserByMail();
    }).then(success => {
      if (!success === false) {
        return res.status(404).send({ message: 'User does not exist' });
      }

      return res.status(200).send({ message: 'Mail sent successfully'});
    }).catch(err => {
      return res.status(400).send({ message: err.message })
    })
  },
  login: async (req, res) => {
    const { email, phone, password } = req.body;
    console.log('headers', req.headers)
    let user;

    try {
      user = await User.scope('includePassword').findOne({
        where: { email },
      });

      if (!user)
        res.status(404).send({ message: 'User not found' })
    } catch(err) {
      res.status(400).send({ message: err.message })
    }

    return bcrypt.compare(password, user.password).then((success) => {
      if (!success) return res.status(400).send({ message: 'Incorrect password' })

      if (user.isEmailVerified) {
        console.log('user', user);
        delete user.dataValues['password']
        const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        return res.status(200).send({ token, user })
      }

      return res.status(400).send({ message: 'Email not verified' })
    });
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
