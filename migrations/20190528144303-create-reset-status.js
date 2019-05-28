'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('resetStatuses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        validate: {
          len: [1, 40]
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false

      },
      used: {
        type: Sequelize.STRING,
        allowNull: false

      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('resetStatuses');
  }
};