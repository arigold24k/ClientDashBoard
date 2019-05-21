'use strict';
module.exports = (sequelize, DataTypes) => {
  const CompUser = sequelize.define('CompUser', {
    comp_code: {
      type:DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    UserCode: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  CompUser.associate = function(models) {
    // associations can be defined here
    CompUser.belongsTo(models.Company, {
      foreignKey: {
        name: "comp_code"
      },
      onDelete: 'CASCADE'
    });

    CompUser.hasOne(models.UserTable, {
      foreignKey: {
        name: "UserCode"
      }
    })

  };
  return CompUser;
};