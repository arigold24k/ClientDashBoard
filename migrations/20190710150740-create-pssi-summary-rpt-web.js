'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PSSI_SUMMARY_RPT_WEBs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CUST_CODE: {
        type: Sequelize.STRING
      },
      PROCESSED: {
        type: Sequelize.STRING,
        defaultValue: 'N'
      },
      PROCESSED_DATE: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PSSI_SUMMARY_RPT_WEBs');
  }
};