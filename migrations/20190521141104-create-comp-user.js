'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CompUsers', {
      // id : {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true
      // },
      // comp_code: {
      //   type:Sequelize.STRING,
      //   allowNull: false,
      //   references: {
      //    model: 'Companies',
      //    key: 'comp_code'
      //   }
      // },
      UserCode: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CompUsers');
  }
};