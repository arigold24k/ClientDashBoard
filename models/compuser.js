'use strict';
module.exports = (sequelize, DataTypes) => {
  const CompUser = sequelize.define('CompUser', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true
    //
    // },
    // comp_code: {
    //   type:DataTypes.STRING,
    //   allowNull: false,
    // },
    UserCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true

    }
  }, {});
  CompUser.associate = function(models) {
    // associations can be defined here
      //adds column to usertable for with compuser primary key
    CompUser.hasOne(models.UserTable, {
     foreignKey:{
         name: 'UserCode',
         allowNull: false
     },
     onDelete: 'CASCADE',
     as:'Users'

   });


    // CompUser.hasMany(models.UserTable, {
    //   foreignKey: 'UserCode',
    //   onDelete: 'CASCADE'
    // })

  };
  return CompUser;
};