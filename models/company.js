'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    comp_code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    comp_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

  }, {});
  Company.associate = function(models) {
    // associations can be defined here

    Company.hasMany(models.CompUser, {
      foreignKey: {
        name: "comp_code"
      }
    })

  };
  return Company;
};