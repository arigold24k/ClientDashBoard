'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('kcard_yoda_raws', {
      KCARD: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('kcard_yoda_raws');
  }
};