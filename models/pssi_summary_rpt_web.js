'use strict';
module.exports = (sequelize, DataTypes) => {
  const PSSI_SUMMARY_RPT_WEB = sequelize.define('PSSI_SUMMARY_RPT_WEB', {
    CUST_CODE: {type: DataTypes.STRING},
    PROCESSED: {type: DataTypes.STRING, defaultValue:'N'},
    PROCESSED_DATE: DataTypes.DATE
  }, {});
  PSSI_SUMMARY_RPT_WEB.associate = function(models) {
    // associations can be defined here
  };
  return PSSI_SUMMARY_RPT_WEB;
};