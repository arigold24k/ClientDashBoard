'use strict';
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    comp_code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    comp_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentCompany: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {});
  Company.associate = function(models) {
    // associations can be defined here
    //adds a column attribute to the CompUser table called comp_code, can get user with getUsers and setUsers
    Company.hasMany(models.CompUser, {
    foreignKey: {
      name: 'comp_code',
      allowNull: false
    },
    onDelete: 'CASCADE',
    as: 'userCodes'
    });

    // Company.hasMany(models.CompUser, {
    //   foreignKey: 'comp_code',
    //   onDelete: 'CASCADE'
    // })

  };
  return Company;
};