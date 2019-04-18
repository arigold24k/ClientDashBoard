
let db = require('../models');
const func = require( '../functions/functions');
const table_name = 'usertables';
const prod_table = 'testProdTable';



const orm = {
    findoneUser: function(username, cb){
        const queryString ="SELECT * FROM " + table_name + " Where LCASE(username)='" + username.toLowerCase() + "';";
        db.sequelize.query(queryString).then((results, metadata) => {
            console.log("orm.js 12 -this is the results: ", results[0][0]);
            console.log("orm.js 13 this is the metadata: ", metadata);
            for(let i = 0 ; i < 1; i++) {
                if(typeof (results[0][0]) !== 'undefined') {
                    const data = {
                    data: results,
                    [metadata]: metadata
                    };
                    cb(null, data)
                }else {
                    cb(true, {data: ""})
                }
            }
        })
    },
    find_one: (table, col, val, cb) => {
        db[table].findOne({
            where: {
                [col] : val
            }
        }).then((results) => {
            console.log('results form the the find one, ', results);
            if(results === null) {
                cb(results, null);
            }
            cb(null, results);
        }).catch((e) => {
            console.log("Error finding the compe code, ", e);
        })

    },
    addoneUser: function(username, pw, email, compcode, cb) {
        this.findoneUser(username, (err, data) => {
            if(!data[0]) {
                this.find_one('UserTable', "CompCode", compcode, (er, data2) => {
                    if (data2 === null ) {
                        this.find_one('Company', 'comp_code', compcode, (error, data1) => {
                            console.log("this is the find one company code ", data1);
                            if(data1 !== null) {
                                console.log("company code exist");
                                const objData = {
                                    username: username,
                                    password: pw,
                                    Email: email,
                                    CompCode: compcode
                                };
                                db.UserTable.upsert( objData).then((response, metadata) => {
                                    console.log("This is the bulkInsert in the orm.js page res:", metadata);
                                    console.log("This is the bulkInsert in the orm.js page err:", response);
                                    console.log('this is the respond from the database ', response);
                                    return cb(null, response);
                                })
                            }else {
                                //code 3 equals no comp code
                                return cb(null, 3)
                            }})
                    }else {
                        return cb(null, 3)
                    }
                });
            }else{
               return cb(null, 0);
            }
        })
}
};


module.exports = orm;


// // ---------------------Working Code, above converting to sequelize ------------------------------------------------------------
// const connection = require('./connection');
// const func = require( '../functions/functions');
//
// const db_name = 'testDB';
// const table_name = 'testUserTable';
// const prod_table = 'testProdTable';
//
// const orm = {
//     findoneUser: function(username, cb) {
//         const queryString ="SELECT * FROM " + db_name + "." + table_name + " Where LCASE(username)='" + username.toLowerCase() + "';";
//         console.log('This is the connection query', queryString);
//         connection.query(queryString, (err, data) => {
//             console.log('this is the findone returning data ', data);
//             if(err) cb(err, null);
//             cb(null, data);
//         })
//     },
//     addoneUser: function(username, pw, email, compcode, cb) {
//         console.log('Add one is being hit and this is the data being passed ' + username +", " + pw);
//         this.findoneUser(username,  (err, data) => {
//             if(!data[0]) {
//                 //do another findone to see if the compnay code is valid
//                 const hashPW = func.encryptPW(pw);
//                 if(hashPW !== 0) {
//                     const queryString = `INSERT INTO ${db_name}.${table_name} (username, password, Email, companycode) VALUES ('${username}', '${hashPW}', '${email}', '${compcode}');`;
//                     console.log('This is Insert query being passed ', queryString);
//                     connection.query(queryString, (err, res) => {
//                             if(err){
//                                 console.log('this is the error from the Insert ', err);
//                                 cb(err, null);
//                             }
//                             console.log('this is the respond from the database ', res);
//                             cb(null, res);
//                         });
//                 }
//             }else {
//                 cb(null, 0);
//             }
//         })
//     },
//     add_material: (partnum, quantity, tag_num) => {
//         console.log("This is the data that is being passed to the add material function");
//         const queryString = `INSERT INTO ${db_name}.${prod_table} `
//     }
// };
// module.exports = orm;
// ----------------------------------------------------------------------------------------------------------------------------------------------