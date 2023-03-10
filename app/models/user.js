"use strict";
const { Model } = require("sequelize");
const sendVerificationMail = require("../mailer/VerifyOTPMailer");
const { options } = require("../routes");

const UserTypes = require("../utils/constants/UserTypes");
const { encrypt, generateOTP, getTimestamp, checkIfEmailOtpValid } = require("../utils/function/user");
const Project = require("./project");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models['Project'], {
        as: "projects",
        foreignKey: "posted_by_user_id",
      });
      User.hasOne(models['FreelancerProfile'])
    }

    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    static async verifyUserEmail(userId, userToken) {
      const user = await User.findByPk(userId);

      if (checkIfEmailOtpValid(user.emailOtp, userToken)) {
        await user.update({ isEmailVerified: true });
        return true;
      }

      return false;
    }

    async verifyUserByMail() {
      // TODO: later will remove userID
      const emailOtp = generateOTP(this.dataValues.id)

      // User is not verified yet
      try {
        sendVerificationMail(this.dataValues.email, emailOtp);
      } catch(err) {
        console.log('error: '+err);
        throw new Error(err.message)
      } finally {
        await this.update({ emailOtp: emailOtp+'_'+getTimestamp() })
      }
    }

  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      mobileNo:  {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      isMobileVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mobileOtp: DataTypes.STRING,
      emailOtp: DataTypes.STRING,
      country: DataTypes.STRING,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      userType: {
        type: DataTypes.ENUM,
        values: [UserTypes.CLIENT, UserTypes.FREELANCER, UserTypes.VENDOR],
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: {
            msg: `User type must one of these (${Object.values(UserTypes).join(
              ", ",
            )})`,
            args: [Object.values(UserTypes)],
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      name: 'User',
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: {
          exclude: ['password', 'emailOtp', 'mobileOtp', 'createdAt', 'updatedAt'] // scope will not be applicable for create
        }
      },
      scopes: {
        includePassword: {
          attributes: {
            exclude: ['emailOtp', 'mobileOtp', 'createdAt', 'updatedAt']
          }
        }
      }
    },
  );

  // User.hasMany(require('.')['projects'], { as: 'projects', foreignKey: 'postedByUserId' })

  User.beforeCreate(async (user, options) => {
    user.dataValues.password = await encrypt(user.password);
  });

  User.afterCreate(async (user, options) => {
    await user.verifyUserByMail();
  });

  User.beforeUpdate(async (user, options) => {
    if (user.changed("password")) {
      user.password = encrypt(user.password);
    }
  });

  User.getAllProjects = async (userId) => {
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: require(".").Project,
          as: "projects",
        },
      ],
    });
    console.log("----------user-----------", user);
    // const projects = await user.getProject();
    return user;
  };

  return User;
};
