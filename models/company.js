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

  }, {});
  Company.associate = function(models) {
    // associations can be defined here
    Company.hasMany(models.UserTable, {
      foreignKey: {
        name: "CompCode"
      }
    })

  };
  return Company;
};