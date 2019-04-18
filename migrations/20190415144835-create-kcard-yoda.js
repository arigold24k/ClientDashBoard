'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KCARD_YODA', {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KCARD_YODA');
  }
};