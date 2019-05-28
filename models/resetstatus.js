'use strict';
module.exports = (sequelize, DataTypes) => {
  const resetStatus = sequelize.define('resetStatus', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        len: [1, 40]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false

    },
    used: {
      type: DataTypes.STRING,
      allowNull: false

    }
  }, {});
  resetStatus.associate = function(models) {
    // associations can be defined here
  };
  return resetStatus;
};