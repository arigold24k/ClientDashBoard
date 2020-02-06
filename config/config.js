const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.join(__dirname, '.env')});


const configOjb = {
    "development": {
        "username": process.env.USRNME,
        "password": process.env.DBKEY,
        "database": process.env.DBNAME,
        "host": process.env.HOSTNUM,
        "dialect": 'mysql'
    },
    "local": {
        "username": process.env.USRNME,
        "password": process.env.DBKEY,
        "database": process.env.DBNAME,
        "host": process.env.HOSTNUM,
        "dialect": 'mysql'
    },
    "test": {
        "username": process.env.USRNME,
        "password": process.env.DBKEY,
        "database": process.env.DBNAME,
        "host": process.env.HOSTNUM,
        "dialect": 'mysql'
    },
    "production": {
        "username": process.env.USRNME,
        "password": process.env.DBKEY,
        "database": process.env.DBNAME,
        "host": process.env.HOSTNUM,
        "dialect": 'mysql'
    }
};

module.exports = configOjb;
