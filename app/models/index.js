'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


const User = require('./user')(sequelize, Sequelize.DataTypes);
db[User.name] = User;

const Project = require('./project')(sequelize, Sequelize.DataTypes);
db[Project.name] = Project;

const Tag = require('./tag')(sequelize, Sequelize.DataTypes);
db[Tag.name] = Tag;

const Category = require('./category')(sequelize, Sequelize.DataTypes);
db[Category.name] = Category;

const ProjectCategory = require('./ProjectCategory')(sequelize, Sequelize.DataTypes);
db[ProjectCategory.name] = ProjectCategory;

const ProjectTag = require('./ProjectTag')(sequelize, Sequelize.DataTypes);
db[ProjectTag.name] = ProjectTag;

module.exports = { User, Project, Tag, Category, ProjectCategory, ProjectTag };


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
