'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PSSI_EMAIL_SENDs', {
      SUB_TIME: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      SUB_BY: {
        type: Sequelize.STRING
      },
      SEND_TO: {
        type: Sequelize.STRING
      },
      CC: {
        type: Sequelize.STRING
      },
      BCC: {
        type: Sequelize.STRING
      },
      SUBJECT: {
        type: Sequelize.STRING
      },
      MESSAGE: {
        type: Sequelize.STRING
      },
      ATTACHMENT_LOC: {
        type: Sequelize.STRING
      },
      SENT: {
        type: Sequelize.STRING,
        defaultValue: 'N'
      },
      MAILSEQ: {
        type: Sequelize.INTEGER
      },
      DATE_SENT: {
        type: Sequelize.DATE
      },
      MAIL_ACCOUNT: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PSSI_EMAIL_SENDs');
  }
};