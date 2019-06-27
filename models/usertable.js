'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTable = sequelize.define('UserTable', {
    id: {
     type: DataTypes.INTEGER,
     unique: true,
     autoIncrement: true,
     primaryKey: true,
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
      unique: true,
      allowNull: false
    },
    // CompCode: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // temp_pw: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false
    // }
    // ,
    // UserCode: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true
    //
    // }
  }, {});
  UserTable.associate = function(models) {
    //this adds the primary key of compUser to this table
    // UserTable.belongsTo(models.CompUser, {
    //   foreignKey: {
    //     name: 'UserCode',
    //     allowNull: false
    //   },
    //  onDelete: 'CASCADE'
    // });

      //this adds company primary key to User table
    UserTable.belongsTo(models.Company, {
      foreignKey: {
          name: 'CompCode',
          allowNull: false
      },
      onDelete: 'CASCADE'
    });

    UserTable.hasMany(models.KCARDS, {
      foreignKey: {name: 'PSESSION'},
      onDelete: 'CASCADE',
      as: 'Users'
    })
    // associations can be defined here
  };
  return UserTable;
};