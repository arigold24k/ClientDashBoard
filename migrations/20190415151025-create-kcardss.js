'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KCARDSS', {
      CUSTOMER: {
        type: Sequelize.STRING,
        allowNull: false
      },
      SCANDATE: {
        type: Sequelize.DATE,
        allowNull: false
      },
      RECNO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      CODE: {
        type: Sequelize.STRING,
        allowNull: false
      },
      PART: {
        type: Sequelize.STRING,
        allowNull: false
      },
      QTY: {
        type: Sequelize.INTEGER, allowNull: false
      },
      TAG_NUM: Sequelize.STRING,
      DATE_CREATED: Sequelize.DATE,
      DATE_MODIFIED: Sequelize.DATE,
      STATUS: Sequelize.STRING,
      PSESSION: Sequelize.INTEGER,
      PROCESSED: Sequelize.STRING
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KCARDSS');
  }
};