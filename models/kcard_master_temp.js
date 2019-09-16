'use strict';
module.exports = (sequelize, DataTypes) => {
  const KCARD_MASTER_TEMP = sequelize.define('KCARD_MASTER_TEMP', {
    KCARD: DataTypes.INTEGER,
    PART: DataTypes.STRING
  }, {});
  KCARD_MASTER_TEMP.associate = function(models) {
    // associations can be defined here
  };
  return KCARD_MASTER_TEMP;
};