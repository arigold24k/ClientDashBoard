'use strict';
module.exports = (sequelize, DataTypes) => {
  const KCARDS = sequelize.define('KCARDS', {
    CUSTOMER: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "HolderCompany",
     // primaryKey: true,
    },
    SCANDATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    RECNO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CODE: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "HOLD1"
    },
    PART: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "123456"
    },
    QTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "999999"
    },
    TAG_NUM: DataTypes.STRING,
    DATE_CREATED: DataTypes.DATE,
    DATE_MODIFIED: DataTypes.DATE,
    STATUS: DataTypes.STRING,
    // PSESSION: DataTypes.INTEGER,
    PROCESSED: DataTypes.STRING,
    SYNCHED: DataTypes.STRING
  }, {
    indexes: [{
      unique: true,
      fields: ['RECNO']
    }],
    timestamps: false
  },);
  KCARDS.associate = function(models) {
    // associations can be defined here
    //KCARDS.belongsTo(models.UserTable, {
    //  foreignKey: 'CompCode',
    //  onDelete: 'CASCADE'
    //})
  };


  return KCARDS;
};