'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KCARDS', {
      CUSTOMER: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "HolderCompany",
        // primaryKey: true,
        references: {
         model: 'UserTables',
         key: 'CompCode'
        }
      },
      SCANDATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      RECNO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      CODE: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "HOLD1"
      },
      PART: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      QTY: {
        type: Sequelize.REAL,
        allowNull: false,
        defaultValue: "999999"
      },
      TAG_NUM: Sequelize.STRING,
      DATE_CREATED: Sequelize.DATE,
      DATE_MODIFIED: Sequelize.DATE,
      STATUS: Sequelize.STRING,
      // PSESSION: Sequelize.INTEGER,
      PROCESSED: Sequelize.STRING,
      SYNCHED: Sequelize.STRING
    }, {
      timestamp: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KCARDS');
  }
};