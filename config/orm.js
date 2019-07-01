let db = require('../models');
const table_name = 'usertables';

const orm = {

    //used to check if there already was a request to have the password reset
    in_current_link: function (username, cb) {
        const sqlString = `SELECT count(*) row_count FROM resetstatuses a WHERE date_format(date_add(a.date, interval 1 day), '%m/%d/%Y_%h:%i:%s') > date_format(sysdate(), '%m/%d/%Y_%h:%i:%s') and a.username = '${username}' and used = 'N'`;
        db.sequelize.query(sqlString).then((results, metadata) => {
            // console.log("This is the data coming back from the check if link exist: ", results);
            if (results[0][0].row_count > 0) {
                cb(null, true)
            } else {
                cb(null, false)
            }

        }).catch((err) => {
            // console.log("This is the data/error coming back from the check if link exist: ", err);
            cb(err, null)
        });
    },

    findoneUser: function(username, cb){
        const queryString ="SELECT a.*, b.comp_name FROM " + table_name + " a, companies b Where LCASE(username)='" + username.toLowerCase() + "' AND b.comp_code = a.compcode;";
        db.sequelize.query(queryString).then((results, metadata) => {
            // console.log("orm.js 12 -this is the results: ", results[0][0]);
             // console.log("orm.js 13 this is the metadata: ", metadata);
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
            // console.log('results form the the find one, ', results);
            if(results === null) {
                cb(results, null);
            }
            cb(null, results);
        }).catch((e) => {
            // console.log("Error finding the comp code, ", e);
            cb(e, null)
        })
    },

    get_current_reset_data: (id, cb) => {
        const sqlString = `SELECT * FROM reststatuses a WHERE a.id = ${id} AND date_format(date_add(a.date, interval 1 day), '%m/%d/%Y_%h:%i:%s') > date_format(sysdate(), '%m/%d/%Y_%h:%i:%s') AND a.used = 'N'`;
        db.sequelize.query(sqlString).then((results, metadata) => {
            if(typeof(results[0][0]) !== 'undefined') {
                const dataObj = {
                    email: results[0][0].email,
                    usrname: results[0][0].username
                };
                cb(null, dataObj);
            }
            cb({error: 'no data to reset'}, null);

        });
    },
    addoneUser: function(username, pw, email, usercode, cb) {
        this.findoneUser(username, (err, data) => {
            // console.log("find one user ", data);
            //looking to find a user that has that username code if no user exist go to next line of logic
            if(!data[0]) {
                //if no user with that company code exist exist proceed.
                this.find_one('UserTable', "UserCode", usercode, (er, data2) => {
                    // console.log("message from first find_one, ", data2);
                    if (data2 === null ) {
                        //if company code exist then proceed
                        this.find_one('CompUser', 'usercode', usercode, (error, data1) => {
                            // console.log("this is the find one company code ", data1);
                            if(data1 !== null) {
                                // console.log("company code exist data: ", data1.comp_code);
                                const objData = {
                                    username: username,
                                    password: pw,
                                    Email: email,
                                    CompCode: data1.comp_code,
                                    UserCode: usercode,
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
                        cb(null, 0);
                    }
                });
            }else{
                //user exist for that username select a different username.
                cb(null, 0);
            }
        });
    },

    pullResetId : function(usrname, _email, cb) {
        const strSql = `SELECT id FROM resetstatuses a WHERE date_format(date_add(a.date, interval 1 day), '%m/%d/%Y_%h:%i:%s') > date_format(sysdate(), '%m/%d/%Y_%h:%i:%s') and a.username = '${usrname}' and used = 'N' and email = '${_email}'`;
        db.sequelize.query(strSql).then((results)=> {
            if(typeof(results[0][0]) !== 'undefined') {
                const dataObj = {
                    id: results[0][0].id
                };
                cb(null, dataObj);
            }
            cb({error: 'no data to reset'}, null);

        }).catch((err) => {
            cb({error: 'error in executing the query'}, null)
        })
    },
//have to test this 05/31/2019
//tested on 06/10/2019
    insertIntoReset: function (usrname, _email, cb) {
        const todayDate = new Date();
        this.in_current_link(usrname, (err, results) => {
            // console.log("insert into reset table, data: ", results);
            if(results === false) {
                db.resetStatus.upsert({
                    username: usrname,
                    email: _email,
                    date: todayDate,
                    used: 'N'

                },).then((res) => {
                    // console.log("after insert: ", res);
                    if(res) {
                       this.pullResetId(usrname, _email, (err2, res2) => {
                           if(res2) {
                               cb(null, res2)
                           }else{
                               cb(err2,null)
                           }
                       })
                    }

                    cb(null, res);
                }).catch((err1) => {
                    if (err1) {
                        cb(err1, null);
                    }
                });
            }else {
                this.pullResetId(usrname, _email, (err2, res2) => {
                    if(res2) {
                        cb(null, {message: 'DataAlreadyInSystem', data: res2})
                    }else{
                        cb(err2,null)
                    }
                });
                // cb(null, 'DataAlreadyInSystem');
            }

        })

    },
    insertToKCards: (customer, code, part, qty, tag_num, user,  cb) => {
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
            'PSISSION': user,
        };
        // console.log("Data being passed into the db KCARDS upsert, ", dataObj);
        db.KCARDS.upsert(dataObj).then((res, metadata) => {
            return cb(null, res);
        }).catch((err) => {
            if (err) {
                return cb(err, null);
            }
        });
    },
    findOneTag: (tagNumber, cb) => {
        db.KCARD_MASTER.findOne({
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
        // console.log(`This is the data from delete one value: ${val} table: ${table} col: ${col} `);
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
        const queryString =`INSERT INTO KCARD_MASTERS (SELECT * FROM KCARD_MASTER_RAWS WHERE ITEM_TAG_INTEGER = '${itemtagNum}');`;
        db.sequelize.query(queryString).then((results, metadata) => {
             // console.log('this is the metadata: ' + metadata + 'this is the data ' + results);
            if(results) {
                cb(null, results);
            }
        }).catch((error) => {
            // console.log('error in the run Error ', error);
            cb(error, null);
        });
    },
    dashboardData : (compCode, filtered,cb) => {
        let condition;
        if(!filtered){
            condition = '';
        }else{
            condition = `AND a.part in (${filtered})`;
        }
        const strSql = `SELECT (CASE WHEN MONTH(a.SCANDATE) = 1 THEN 'JAN' WHEN MONTH(a.SCANDATE) = 2 THEN 'FEB'  WHEN MONTH(a.SCANDATE) = 3 THEN 'MAR'  WHEN MONTH(a.SCANDATE) = 4 THEN 'APR'  WHEN MONTH(a.SCANDATE) = 5 THEN 'MAY'  WHEN MONTH(a.SCANDATE) = 6 THEN 'JUN'  WHEN MONTH(a.SCANDATE) = 7 THEN 'JUL'  WHEN MONTH(a.SCANDATE) = 8 THEN 'AUG'  WHEN MONTH(a.SCANDATE) = 9 THEN 'SEP'  WHEN MONTH(a.SCANDATE) = 10 THEN 'OCT'  WHEN MONTH(a.SCANDATE) = 11 THEN 'NOV'  WHEN MONTH(a.SCANDATE) = 12 THEN 'DEC' ELSE '' END) Month, SUM((CASE WHEN a.CODE LIKE '%CONSUME%' THEN a.QTY ELSE '' END)) Consumed, SUM(b.QTY) Received, year(a.scandate), month(a.scandate)  FROM KCARDS a, KCARD_MASTERs b WHERE a.CUSTOMER = '${compCode}' AND a.CUSTOMER = b.BP_CODE AND b.SHIP_DATE >= date_sub(sysdate(), INTERVAL 13 MONTH) AND b.SHIP_DATE <= sysdate() AND a.SCANDATE >= date_sub(sysdate(), INTERVAL 13 MONTH) AND a.SCANDATE <= sysdate() ${condition} GROUP BY (CASE WHEN MONTH(a.SCANDATE) = 1 THEN 'JAN' WHEN MONTH(a.SCANDATE) = 2 THEN 'FEB'  WHEN MONTH(a.SCANDATE) = 3 THEN 'MAR'  WHEN MONTH(a.SCANDATE) = 4 THEN 'APR'  WHEN MONTH(a.SCANDATE) = 5 THEN 'MAY'  WHEN MONTH(a.SCANDATE) = 6 THEN 'JUN'  WHEN MONTH(a.SCANDATE) = 7 THEN 'JUL'  WHEN MONTH(a.SCANDATE) = 8 THEN 'AUG'  WHEN MONTH(a.SCANDATE) = 9 THEN 'SEP'  WHEN MONTH(a.SCANDATE) = 10 THEN 'OCT'  WHEN MONTH(a.SCANDATE) = 11 THEN 'NOV'  WHEN MONTH(a.SCANDATE) = 12 THEN 'DEC' ELSE '' END), year(a.scandate), month(a.scandate) ORDER BY year(a.scandate) ASC, month(a.scandate) ASC;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the dashboard data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the dashboard data, ', error);
            cb(error, null);
        })
    },
    dashboardDataTable : (compCode, cb) => {
        const strSql = `SELECT DISTINCT PART, count(item_tag_integer) tagcount, SUM(QTY) quantity FROM KCARD_MASTERS WHERE BP_CODE = '${compCode}' GROUP BY PART ORDER BY SUM(QTY) DESC;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the dashboard data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the dashboard data, ', error);
            cb(error, null);
        })
    },
    reporting1 : (compCode, cb) => {
        const strSql = `select * from KCARDS where customer = '${compCode}' AND date_format(SCANDATE, '%m/%d/%Y') = date_format(sysdate(), '%m/%d/%Y');`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting2 : (compCode, cb) => {
        const strSql = ` select * from KCARDS where customer = '${compCode}' AND date_format(SCANDATE,'%m/%d/%Y') <= date_format(sysdate(),'%m/%d/%Y')  AND date_format(SCANDATE,'%m/%d/%Y') >= date_format(date_sub(sysdate(),interval  weekday(sysdate()) day), '%m/%d/%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting3 : (compCode, cb) => {
        const strSql = `select * from KCARDS where customer ='${compCode}' and date_format(scandate, '%m_%Y') = date_format(sysdate(), '%m_%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting4 : (compCode, cb) => {
        const strSql = `select * from KCARDS where customer ='${compCode}' and date_format(scandate, '%Y') = date_format(sysdate(), '%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting5 : (compCode,range1, range2, cb) => {
        const strSql = `select distinct * from KCARDS where customer ='${compCode}' and date_format(scandate, '%m/%d/%Y') BETWEEN date_format('${range1}', '%m/%d/%Y') AND date_format('${range2}', '%m/%d/%Y') order by scandate;`;
        // console.log("This is the query being passed, ", strSql);
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    getCurrentCount : (compCode, cb) => {
      const strSql = `select count(*) count from KCARDS a where date_format(scandate, '%Y%m%d') = date_format(sysdate(), '%Y%m%d') and (code  like '%CONSUME%' or code like '%RECEIVED%') and customer like ('%${compCode}%');`;
      db.sequelize.query(strSql).then((results) => {
          cb(null, results);
      }).catch((err) => {
          cb(err, null);
      })
    },
};
module.exports = orm;