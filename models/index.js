'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/../config/config.json')[env];
const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname, '.env')});
const db = {};
const config_v1 = require(__dirname + '/../config/config.js')[env];

// console.log("this is from index.js in models folder.  Value of config_v1 is: ", config_v1);

// if (config.use_env_variable) {
//  const sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
  const sequelize = new Sequelize(config_v1.database, config_v1.username, config_v1.password, config_v1);
  //testing the new connection
 //const sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
