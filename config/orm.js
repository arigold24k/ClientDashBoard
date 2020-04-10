let db = require('../models');
const table_name = 'UserTables';

const orm = {

    //used to check if there already was a request to have the password reset
    in_current_link: function (username, cb) {
        const sqlString = `SELECT count(*) row_count FROM resetStatuses a WHERE date_format(date_add(a.date, interval 1 day), '%m/%d/%Y_%h:%i:%s') > date_format(sysdate(), '%m/%d/%Y_%h:%i:%s') and a.username = '${username}' and used = 'N'`;
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
        const queryString ="SELECT a.*, b.comp_name FROM " + table_name + " a, Companies b Where LCASE(username)='" + username.toLowerCase() + "' AND b.comp_code = a.compcode;";
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
            }else {
                cb(null, results);
            }

        }).catch((e) => {
            // console.log("Error finding the comp code, ", e);
            cb(e, null)
        })
    },

    get_current_reset_data: (id, cb) => {
        const sqlString = `SELECT * FROM resetStatuses a WHERE a.id = ${id} AND date_format(date_add(a.date, interval 1 day), '%m/%d/%Y_%h:%i:%s') > date_format(sysdate(), '%m/%d/%Y_%h:%i:%s') AND a.used = 'N'`;
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
             //console.log("find one user ", data);
            //looking to find a user that has that username code if no user exist go to next line of logic
            if(err) {
                //if no user with that company code exist exist proceed.
                this.find_one('UserTable', "UserCode", usercode, (er, data2) => {
                    // console.log("message from first find_one, ", data2);
                    if (data2 === null ) {
                        //if company code exist then proceed
                        this.find_one('CompUser', 'usercode', usercode, (error, data1) => {
                           //  console.log("this is the find one company code ", data1);
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
                            }
                        })
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
        const strSql = `SELECT id FROM resetStatuses a WHERE date_format(date_add(a.date, interval 1 day), '%m/%d/%Y_%h:%i:%s') > date_format(sysdate(), '%m/%d/%Y_%h:%i:%s') and a.username = '${usrname}' and used = 'N' and email = '${_email}'`;
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
    insertToKCARDs: (customer, code, part, qty, tag_num, user,  cb) => {
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
        // console.log("Data being passed into the db KCARDs upsert, ", dataObj);
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
    findOneTag_forday: (tagNumber, cb) => {
        let today_ = new Date();
        db.KCARDS.findOne({
            where: {
                'TAG_NUM': tagNumber,
                'TO_DATE(scandate)': today_
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
        const queryString =`INSERT INTO KCARD_MASTERs (SELECT * FROM KCARD_MASTER_RAWS WHERE ITEM_TAG_INTEGER = '${itemtagNum}');`;
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
        let condition1, condition2;
        if(!filtered){
            condition1 = '';
            condition2 = ''
        }else{
            condition1 = `AND cust_ref_num in (${filtered})`;
            condition2 = `AND part in (${filtered})`;
        }
        const strSql = `Select c.* from ((select A.Month, A.year, A.mon_num, Consumed, Received from (SELECT date_format(a.scandate, '%b') Month, SUM((CASE WHEN a.CODE LIKE 'CONSUME%' THEN a.QTY ELSE '' END)) Consumed, year(a.scandate) year, month(a.scandate) mon_num FROM KCARDs a WHERE a.CUSTOMER = '${compCode}' AND DATE(a.SCANDATE) >= date_sub(sysdate(), INTERVAL 13 MONTH) AND DATE(a.SCANDATE) <= sysdate() ${condition2} GROUP BY date_format(a.scandate, '%b'), year(a.scandate), month(a.scandate)) A LEFT JOIN (SELECT date_format(b.date_in, '%b') Month, SUM(b.loc_weight_in) Received, year(b.date_in) year, month(b.date_in) mon_num FROM InvItems b WHERE b.loc_whse_code = '${compCode}' AND date(b.date_in) >= date_sub(sysdate(), INTERVAL 13 MONTH) AND date(b.date_in) <= sysdate() ${condition1} GROUP BY date_format(b.date_in, '%b'), year(b.date_in), month(b.date_in)) B ON A.Month = B.Month AND A.year = B.year AND A.mon_num = B.mon_num) union (select B.Month, B.year, B.mon_num, Consumed, Received from (SELECT date_format(a.scandate, '%b') Month, SUM((CASE WHEN a.CODE LIKE 'CONSUME%' THEN a.QTY ELSE '' END)) Consumed, year(a.scandate) year, month(a.scandate) mon_num FROM KCARDs a WHERE a.CUSTOMER = '${compCode}' AND DATE(a.SCANDATE) >= date_sub(sysdate(), INTERVAL 13 MONTH)	AND DATE(a.SCANDATE) <= sysdate() ${condition2}  GROUP BY date_format(a.scandate, '%b'), year(a.scandate), month(a.scandate)) A RIGHT JOIN (SELECT date_format(b.date_in, '%b') Month, SUM(b.loc_weight_in) Received, year(b.date_in) year, month(b.date_in) mon_num FROM InvItems b WHERE b.loc_whse_code = '${compCode}' AND date(b.date_in) >= date_sub(sysdate(), INTERVAL 13 MONTH) AND date(b.date_in) <= sysdate() ${condition1} GROUP BY date_format(b.date_in, '%b'), year(b.date_in), month(b.date_in)) B ON A.Month = B.Month AND A.year = B.year AND A.mon_num = B.mon_num)) c WHERE c.Month is not null and c.Year is not null Order by year asc, mon_num asc;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the dashboard data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the dashboard data, ', error);
            cb(error, null);
        })
    },
    dashboardDataTable : (compCode, cb) => {
        //const strSql = `SELECT DISTINCT cust_ref_num, count(item_tag_number) tagcount, SUM(loc_weight_in) quantity FROM InvItems WHERE loc_whse_code = '${compCode}' GROUP BY cust_ref_num HAVING count(item_tag_number) > 0 ORDER BY SUM(loc_weight_in) DESC;`;
        const strSql = `Select * FROM CurrentInventory WHERE BP_CODE = '${compCode}'`;
        db.sequelize.query(strSql).then((results) => {
             //console.log('data coming from the dashboard data, ', results);
            cb(null, results);
        }).catch((error) => {
             //console.log('error from the dashboard data, ', error);
            cb(error, null);
        })
    },
    reporting1 : (compCode, cb) => {
        const strSql = `select * from KCARDs where customer = '${compCode}' AND date_format(SCANDATE, '%m/%d/%Y') = date_format(sysdate(), '%m/%d/%Y');`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting2 : (compCode, cb) => {
        //const strSql = `select * from KCARDs where customer = '${compCode}' AND SCANDATE >= dateadd(day, 1-datepart(dw, getdate()), CONVERT(date,getdate())) AND SCANDATE <  dateadd(day, 8-datepart(dw, getdate()), CONVERT(date,getdate())) order by scandate;`;
        const strSql = `select * from KCARDs where customer = '${compCode}' AND date(SCANDATE) <= date_format(sysdate(),'%Y-%m-%d')  AND date(SCANDATE) >= date_format(date_sub(sysdate(),interval  weekday(sysdate()) day), '%Y-%m-%d') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
             console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting3 : (compCode, cb) => {
        const strSql = `select * from KCARDs where customer ='${compCode}' and date_format(scandate, '%m_%Y') = date_format(sysdate(), '%m_%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting4 : (compCode, cb) => {
        const strSql = `select * from KCARDs where customer ='${compCode}' and date_format(scandate, '%Y') = date_format(sysdate(), '%Y') order by scandate;`;
        db.sequelize.query(strSql).then((results) => {
            // console.log('data coming from the reporting1 data, ', results);
            cb(null, results);
        }).catch((error) => {
            // console.log('error from the reporting1 data, ', error);
            cb(error, null);
        })
    },
    reporting5 : (compCode,range1, range2, cb) => {
        const strSql = `select distinct * from KCARDs where customer ='${compCode}' and date_format(scandate, '%m/%d/%Y') BETWEEN date_format('${range1}', '%m/%d/%Y') AND date_format('${range2}', '%m/%d/%Y') order by scandate;`;
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
      const strSql = `select count(*) count from KCARDs a where date_format(scandate, '%Y%m%d') = date_format(sysdate(), '%Y%m%d') and (code  like '%CONSUME%' or code like '%RECEIVED%') and customer like ('%${compCode}%');`;
      db.sequelize.query(strSql).then((results) => {
          cb(null, results);
      }).catch((err) => {
          cb(err, null);
      })
    },
    sendEmail: (v_to_email, v_subject, v_body, cb) => {
            const dataObj = {
                SEND_TO: v_to_email,
                SUBJECT: v_subject,
                MESSAGE: `Please follow the link below to Reset Password. \n  http://localhost:3000/updateinfo/${v_guid}`
            };

            db.PSSI_EMAIL_SEND.upsert(dataObj).then((res) => {
                return cb(null, res);
            }).catch((err) => {
                return cb(err, null);
            })
    },
    insertToReport: (v_cust_code, cb) => {
        const dataObj = {
            CUST_CODE: v_cust_code
        };

        db.PSSI_SUMMARY_RPT_WEB.upsert(dataObj).then((res) => {
            return cb(null, res);
        }).catch((err) => {
            return cb(err, null);
        })

    },
};
module.exports = orm;