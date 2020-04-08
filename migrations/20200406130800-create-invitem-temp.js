'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('InvItem', {
            inv_item_code: {
                type: Sequelize.INTEGER,
               // unique: true,
                //autoIncrement: true,
                // defaultValue: "A"
            },
            cust_ref_num: {
                type: Sequelize.STRING,
                validate: {
                    len: [1, 40]
                }
            },
            loc_whse_code: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    len: [1, 40]
                }
            },
            loc_weight_in: {
                type: Sequelize.REAL,
                allowNull: false
            },
            loc_pieces_in: {
                type: Sequelize.INTEGER,
                //unique: true,
                allowNull: false
            },
            item_tag_number:{
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
                primaryKey: true
            },
            date_in: {
                type: Sequelize.DATE,
                allowNull: false
            },
            consignment_order: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Y'
            }
        }, {
            timestamp: false
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('InvItem');
    }
};