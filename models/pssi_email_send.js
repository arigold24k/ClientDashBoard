'use strict';
module.exports = (sequelize, DataTypes) => {
  const PSSI_EMAIL_SEND = sequelize.define('PSSI_EMAIL_SEND', {
    SUB_TIME: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    SUB_BY: DataTypes.STRING,
    SEND_TO: DataTypes.STRING,
    CC: DataTypes.STRING,
    BCC: DataTypes.STRING,
    SUBJECT: DataTypes.STRING,
    MESSAGE: DataTypes.STRING,
    ATTACHMENT_LOC: DataTypes.STRING,
    SENT: {type: DataTypes.STRING, defaultValue: 'N'},
    MAILSEQ: DataTypes.INTEGER,
    DATE_SENT: DataTypes.DATE,
    MAIL_ACCOUNT: DataTypes.STRING
  }, {timestamps: false});
  PSSI_EMAIL_SEND.associate = function(models) {
    // associations can be defined here
  };
  return PSSI_EMAIL_SEND;
};