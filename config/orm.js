
let db = require('../models');
const func = require( '../functions/functions');
const table_name = 'usertables';
const prod_table = 'testProdTable';



const orm = {
    findoneUser: function(username, cb){
        const queryString ="SELECT a.*, b.comp_name FROM " + table_name + " a, companies b Where LCASE(username)='" + username.toLowerCase() + "' AND b.comp_code = a.compcode;";
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
        let resp;
        this.findoneUser(username, (err, data) => {
            console.log("find one user ", data);
            //looking to find a user that has that username code if no user exist go to next line of logic
            if(!data[0]) {
                //if no user with that company code exist exist proceed.
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
                                    cb(null, response);
                                })
                            }else {
                                //code 3 equals no comp code
                                cb(null, 3);
                            }})
                    }else {
                        //code 2 means there is a user for that company
                        cb(null, 2);
                    }
                });

            }else{
                //user exist for that username select a different username.
                cb(null, 0);
            }
        });
    },
    insertToKCardss: (customer, code, part, qty, tag_num, cb) => {
        const todayDate = new Date();
        const dataObj = {
            'CUSTOMER': customer,
            'SCANDATE': todayDate,
            'CODE': code,
            'PART': part,
            'QTY': qty,
            'TAG_NUM': tag_num,
            'DATE_CREATED': todayDate,
            'DATE_MODIFIED': todayDate,
        };

        console.log("Data being passed into the db KCARDS upsert, ", dataObj);

        db.KCARDSS.upsert(dataObj).then((res, metadata) => {
            return cb(null, res);
        }).catch((err) => {
            if (err) {
                return cb(err, null);
            }
        });
    },
    findOneTag: (tagNumber, cb) => {
        db.KCARD_YODA.findOne({
            where: {
                'ITEM_TAG_INTEGER': tagNumber
            }
        }).then((results) => {
            cb(null, results)
        }).catch((error) => {
            cb(error, null)
        })
    },
    deleteOneMaster: (table, col, val, cb) => {
        
        console.log(`This is the data from delete one value: ${val} table: ${table} col: ${col} `);

        db[table].destroy({
            where: {
                [col]: val
            }
        }).then ((results) => {
            cb(null, results);
        }).catch((error) => {
            cb(error, null);
        })
    },
    updateOne: (table, col ,val, set1, val1, cb) => {
        db[table].update({
        [set1] : val1
        },{
            where:  {
                [col] : val
            }
        }).then( (results) => {
            cb(null, results);
        }).catch((error) => {
            cb(error, null);
        })
    },
    runError: (itemtagNum, cb) => {
        const queryString =`INSERT INTO KCARD_YODAS (SELECT * FROM KCARD_YODA_RAWS WHERE ITEM_TAG_INTEGER = '${itemtagNum}');`;
        db.sequelize.query(queryString).then((results, metadata) => {
            console.log('this is the metadata: ' + metadata + 'this is the data ' + results);
            if(results) {
                cb(null, results);
            }
        }).catch((error) => {
            console.log('error in the run Error ', error);
            cb(error, null);
        });

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