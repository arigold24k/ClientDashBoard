const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const data = process.env.connection;

let db = new Sequelize('testDB','root' , 'pacesetter', {
    host:'localhost',
    dialect: 'mysql'
});

module.exports = db;





// const mysql = require('mysql');
// require('dotenv').config();
//
// let connection;
//
// if(process.env.JAWDB_URL) {
//     connection = mysql.createConnection(process.env.JAWDB_URL)
// }else {
//     connection = mysql.createConnection({
//         host:'localhost',
//         user: 'root',
//         password:process.env.DBKEY,
//         database:'testDB',
//     })
// }
//
// connection.connect(function(err) {
//     if (err) {
//         console.error("error connecting: " + err.stack);
//         return;
//     }
//     console.log("connected as id " + connection.threadId);
// });
//
// module.exports = connection;

