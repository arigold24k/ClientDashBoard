'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KCARD_MASTER_TEMPs', {
      KCARD: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
        //autoIncrement: true
      },
      PART: {
        type: Sequelize.STRING,
        allowNull: false
        //primaryKey: true
      },
      INV_ITEM_CODE: Sequelize.INTEGER,
      ITEM_TAG_INTEGER: Sequelize.STRING,
      DATE_CREATED: {
        type: Sequelize.DATE,
        allowNull: false
      },
      DATE_MODIFIED: {
        type: Sequelize.DATE,
        allowNull: false
      },
      QTY: Sequelize.INTEGER,
      BP_CODE: {
        type: Sequelize.STRING,
        allowNull: false,
        //primaryKey: true
      },
      SHIP_DATE: Sequelize.DATE,
      PIECES: Sequelize.INTEGER
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KCARD_MASTER_TEMPs');
  }
};