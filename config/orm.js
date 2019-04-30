
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

    },
    dashboardData : (compCode, cb) => {
        const strSql = `SELECT date_format(a.SCANDATE, '%m_%Y'), (CASE WHEN MONTH(a.SCANDATE) = 1 THEN 'JAN' WHEN MONTH(a.SCANDATE) = 2 THEN 'FEB'  WHEN MONTH(a.SCANDATE) = 3 THEN 'MAR'  WHEN MONTH(a.SCANDATE) = 4 THEN 'APR'  WHEN MONTH(a.SCANDATE) = 5 THEN 'MAY'  WHEN MONTH(a.SCANDATE) = 6 THEN 'JUN'  WHEN MONTH(a.SCANDATE) = 7 THEN 'JUL'  WHEN MONTH(a.SCANDATE) = 8 THEN 'AUG'  WHEN MONTH(a.SCANDATE) = 9 THEN 'SEP'  WHEN MONTH(a.SCANDATE) = 10 THEN 'OCT'  WHEN MONTH(a.SCANDATE) = 11 THEN '11'  WHEN MONTH(a.SCANDATE) = 12 THEN 'DEC' ELSE '' END) Month, SUM((CASE WHEN a.CODE LIKE '%CONSUME%' THEN a.QTY ELSE '' END)) Consumed, SUM(b.QTY) Received FROM KCARDSSES a, kcard_yodas b WHERE a.CUSTOMER = '${compCode}' AND a.CUSTOMER = b.BP_CODE AND b.SHIP_DATE >= date_sub(sysdate(), INTERVAL 13 MONTH) AND b.SHIP_DATE <= sysdate() AND a.SCANDATE >= date_sub(sysdate(), INTERVAL 13 MONTH) AND a.SCANDATE <= sysdate() GROUP BY date_format(a.SCANDATE, '%m_%Y'), MONTH(a.SCANDATE), (CASE WHEN MONTH(a.SCANDATE) = 1 THEN 'JAN' WHEN MONTH(a.SCANDATE) = 2 THEN 'FEB'  WHEN MONTH(a.SCANDATE) = 3 THEN 'MAR'  WHEN MONTH(a.SCANDATE) = 4 THEN 'APR'  WHEN MONTH(a.SCANDATE) = 5 THEN 'MAY'  WHEN MONTH(a.SCANDATE) = 6 THEN 'JUN'  WHEN MONTH(a.SCANDATE) = 7 THEN 'JUL'  WHEN MONTH(a.SCANDATE) = 8 THEN 'AUG'  WHEN MONTH(a.SCANDATE) = 9 THEN 'SEP'  WHEN MONTH(a.SCANDATE) = 10 THEN 'OCT'  WHEN MONTH(a.SCANDATE) = 11 THEN '11'  WHEN MONTH(a.SCANDATE) = 12 THEN 'DEC' ELSE '' END) ORDER BY date_format(a.SCANDATE, '%m_%Y');`;
        db.sequelize.query(strSql).then((results) => {
            console.log('data coming from the dashboard data, ', results);
            cb(null, results);
        }).catch((error) => {
            console.log('error from the dashboard data, ', error);
            cb(error, null);
        })
    },
    dashboardDataTable : (compCode, cb) => {
        const strSql = `SELECT DISTINCT PART, SUM(QTY) quantity FROM KCARD_YODAS WHERE BP_CODE = '${compCode}' GROUP BY PART ORDER BY SUM(QTY) DESC;`;
        db.sequelize.query(strSql).then((results) => {
            console.log('data coming from the dashboard data, ', results);
            cb(null, results);
        }).catch((error) => {
            console.log('error from the dashboard data, ', error);
            cb(error, null);
        })
    },
    reporting1 : (compCode, cb) => {
        const strSql = `select * from kcardsses where customer = '${compCode}' AND date_format(SCANDATE, '%m/%d/%Y') = date_format(sysdate(), '%m/%d/%Y');`;
        db.sequelize.query(strSql).then((results) => {
            console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting2 : (compCode, cb) => {
        const strSql = `select * from kcardsses where customer = '${compCode}' AND SCANDATE <= sysdate() AND SCANDATE >= date_sub(sysdate(),interval  weekday(sysdate()) day) order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting3 : (compCode, cb) => {
        const strSql = `select * from kcardsses where customer ='${compCode}' and date_format(scandate, '%m_%Y') = date_format(sysdate(), '%m_%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting4 : (compCode, cb) => {
        const strSql = `select * from kcardsses where customer ='${compCode}' and date_format(scandate, '%Y') = date_format(sysdate(), '%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
};

module.exports = orm;
