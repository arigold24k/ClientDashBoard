'use strict';
module.exports = (sequelize, DataTypes) => {
    const InvItem = sequelize.define('InvItem', {
        inv_item_code: {
            type: DataTypes.INTEGER,

            //autoIncrement: true,

            // defaultValue: "A"
        },
        cust_ref_num: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 40]
            }
        },
        loc_whse_code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 40]
            }
        },
        loc_weight_in: {
            type: DataTypes.REAL,
            allowNull: false
        },
        loc_pieces_in: {
            type: DataTypes.INTEGER,
            //unique: true,
            allowNull: false
        },
        item_tag_number:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        date_in: {
            type: DataTypes.DATE,
            allowNull: false
        },
        consignment_order: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Y'
        }
        // CompCode: {
        //   type: DataTypes.STRING,
        //   allowNull: false
        // },
        // temp_pw: {
        //   type: DataTypes.BOOLEAN,
        //   allowNull: false
        // }
        // ,
        // UserCode: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        //   unique: true
        //
        // }
    }, {
        timestamps: false
    });

    return InvItem;
};