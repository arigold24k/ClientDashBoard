'use strict';
module.exports = (sequelize, DataTypes) => {
  const KCARDSS = sequelize.define('KCARDSS', {
    CUSTOMER: {
      type: DataTypes.STRING,
      allowNull: false
      },
    SCANDATE: {
      type: DataTypes.DATE,
      allowNull: false
      },
    RECNO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    CODE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PART: {
      type: DataTypes.STRING,
      allowNull: false
    },
    QTY: {
      type: DataTypes.INTEGER,
      allowNull: false
      },
    TAG_NUM: DataTypes.STRING,
    DATE_CREATED: DataTypes.DATE,
    DATE_MODIFIED: DataTypes.DATE,
    STATUS: DataTypes.STRING,
    PSESSION: DataTypes.INTEGER,
    PROCESSED: DataTypes.STRING
  }, {
    indexes: [{
      unique: true,
      fields: ['RECNO']
    }]
  });
  KCARDSS.associate = function(models) {
    // associations can be defined here
  };


  return KCARDSS;
};