'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTable = sequelize.define('UserTable', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true

      // defaultValue: "A"
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 40]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CompCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    temp_pw: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    UserCode: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  UserTable.associate = function(models) {
    UserTable.belongsTo(models.CompUser, {
      foreignKey: {
        name: "user_code"
      },
      onDelete: 'CASCADE'
    })
    // associations can be defined here
  };
  return UserTable;
};