'use strict';
module.exports = (sequelize, DataTypes) => {
  const kcard_master_raw = sequelize.define('kcard_master_raw', {
    KCARD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PART: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    INV_ITEM_CODE: DataTypes.INTEGER,
    ITEM_TAG_INTEGER: DataTypes.STRING,
    DATE_CREATED: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DATE_MODIFIED: {
      type: DataTypes.DATE,
      allowNull: false
    },
    QTY: DataTypes.INTEGER,
    BP_CODE: {
      type: DataTypes.STRING,

      allowNull: false,
      primaryKey: true
    },
    SHIP_DATE: DataTypes.DATE,
    PIECES: DataTypes.INTEGER
  }, {
    indexes: [{
      unique: false,
      fields: ['BP_CODE', 'PART', 'KCARD']
    }],
    timestamps: false
  });
  kcard_master_raw.associate = function(models) {
    // associations can be defined here
  };
  return kcard_master_raw;
};