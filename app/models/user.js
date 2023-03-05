'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize')

const UserTypes = require('../utils/constants/UserTypes');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    async setPassword(password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(password, salt);
    }

    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        isEmail: true
      }
    },
    mobileNo: DataTypes.STRING,
    password: DataTypes.STRING,
    isMobileVerified:  {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    mobileOtp: DataTypes.STRING,
    emailOtp: DataTypes.STRING,
    country: DataTypes.STRING,
    name: DataTypes.STRING,
    userType: {
      type: DataTypes.ENUM,
      values: [UserTypes.CLIENT, UserTypes.FREELANCER, UserTypes.VENDOR],
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: {
          msg: `User type must one of these (${Object.values(UserTypes).join(', ')})`,
          args: [UserTypes.CLIENT, UserTypes.FREELANCER, UserTypes.VENDOR]
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true
  });


  User.findByEmail = async function(email) {
    const user =  await this.findOne({
      where: { email: email },
    });

    return user;
  }

  User.beforeCreate(async (user, options) => {
    user.setPassword(user.password);
  });

  User.beforeUpdate(async (user, options) => {
    console.log('asdasdasd');
    if (user.changed('password')) {
      user.setPassword(user.password);
    }
  })

  // function updateTimestamp() {
  //   User
  // }
  return User;
};