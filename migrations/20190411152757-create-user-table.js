'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserTables', {
      id: {
       allowNull: false,
       autoIncrement: true,
       type: Sequelize.INTEGER,
       primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 40]
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // CompCode: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
      // temp_pw: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false
      // },
      // UserCode: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   unique: true,
      //   references: {
      //   model: 'CompUsers',
      //   key: 'UserCode'
      //   }
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserTables');
  }
};