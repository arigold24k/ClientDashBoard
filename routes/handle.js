const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const func = require( '../functions/functions');

const orm = require('../config/orm');
//middleware to protect routes

router.get("/", function(req, res) {
    // console.log("Route was hit.");
   res.json({
       message: "this is the router being hit"
   });
});
router.get("/data", function(req, res) {
    orm.findoneUser("jDoe",((error, data)=>{
        if(error) {
            return res.status(501).json({
               message:'Unable to query database'
            });
        }
        // console.log('this is the data', data)
    }))
});
router.post('/register', function(req, res) {
     console.log('Register API is being hit');

    orm.addoneUser(req.body.userName, req.body.password, req.body.email, req.body.companyCode, (err, data) => {

        console.log('---data is coming back from query---', data);
        if(data && (data !==0 && data !== 3)){
            // console.log('this is the data that came back from the call ', data);
            res.json({message:'Data has been inserted', data: data})
        }else if(data === 0 || !data) {
            res.json({message: 'user already exists', data: 0});
        }else if(data === 3) {
            res.json({message: 'No comp code exist', data: 3});
        }
    })
});

router.post('/passwordReset', (req, res) => {
   const {username, email } = req.body;
   //finds username in table that matches values that was passed
   orm.findoneUser(username, ((err, res1) => {
       if(res1.data[0]) {
           // console.log("This is the response to the password reset, ", res1.data[0][0]);
           //checks if email that was passed matches that which is in the DB
            if(email === res1.data[0][0].Email) {
                // console.log("Email and username match");

                orm.insertIntoReset(username, email, (err, res2) => {
                    if(res2) {
                        // console.log("Response to the insert into reset handle.js, data: ", res2);
                        // if(res2 === 'DataAlreadyInSystem') {
                        //     console.log("data was not added. data: ", res2);
                            res.json({
                                message: 'data in table',
                                data: res2
                            })
                        // }
                        // else {
                        //     console.log("data would have been added.  Added data: ", res2);
                        //     //need to have code to send email here
                        //     //pull the id from here as well
                        //
                        //     res.json({
                        //         message:'would have added to table',
                        //         data: res2})
                        // }


                    }
                    else {
                        //error in adding the values to the table
                        //sending a value of 3
                        res.json({
                            message: "error in adding to the table",
                            data: 3
                        })
                    }
                })
            }else{
                //email does not match
                //value of 2
                res.json({
                    message: "email does not match",
                        data: 2
                    })
            }
       }else {
           //no username exist
           //value of 1
           res.json({
               message: "username does not match",
               data: 1
           });
       }
   }))
});

router.post('/updateDrowssap', (req, res)=> {
    const {id, pw} = req.body;
    orm.get_current_reset_data(id, (err, response) => {
        if(response !== null) {
            orm.updateOne('UserTables', 'username', response.username, 'password', pw , (err_2, response_2) => {
                if(response_2 !== null) {
                    orm.updateOne('resetStatuses', 'id', id, 'used', 'Y', (err_3, response_3) => {
                        if(response_3 !== null) {
                            res.json({message: "data was added successfully", data: "SUCCESS"});
                        }else{
                            res.json({message: `error in updating the rest status\n Error: ${err_3}`, data: null});
                        }
                    });
                }else{
                    // console.log("error in the update of password, ", err_2);
                    res.json({error: err_2, data: null})
                }
            })
        }else{
            res.json({error: 'NoData', data: null})
        }
    });

});

router.post('/verify/api', (req, res) => {
    const check = req.body.check;
    if(check) {
        const tokenObj = {
            id: req.body.id,
            username: req.body.username,
            email: req.body.email,
            companycode: req.body.comp,
            compName: req.body.compname
        };
        // console.log("This is the data in the verify/api being created as an object, ", tokenObj);
        func.createToken(tokenObj, (err, data) => {
            if(err){
                res.status(502).json({message: 'error creating token'});
            }else{
                res.json({token: data, email: req.body.email, compName: req.body.compname});
            }
        })
    }
});
router.post('/login', (req, res) => {
   // console.log('Login API is being Hit ', req.body);
   if(req.body.password) {
       orm.findoneUser(req.body.usrname, (err, data) => {
           // console.log('handle.js page, login is receiving this data, ', data.data[0]);
           if (data.data[0]) {
               res.status(200).json(data.data[0][0])
           }
           else {
               // console.log('no user was found');
               res.status(200).json({message: 'there was an error in finding the user make sure username is correct', data: 'noUser'});
           }
       })
   }else{
       res.status(502).json({message:'No Data sent to Login API'});
   }
});
router.get("/data/:usrdata", function(req, res) {
    orm.findoneUser(req.param('usrdata'),((error, data)=>{
        if(error) {
            return res.status(501).json({
                message:'Unable to query database'
            });
        }
        // console.log('this is the data', data);
        return data;
    }))
});
router.post('/api/verify', function(req, res) {
    // console.log('this is the toekn in the verify route ', req.body);
    try {
        let decoded = jwt.verify(req.body.token, process.env.SECRETE_KEY_OR_SO);
        // console.log('decoded value in the new api route, ', decoded);
        // console.log('decoded value in the new api route, ', decoded);
        if (typeof decoded !== 'undefined'){
            const dataObj = {
                data : true,
                compCD: decoded.user.companycode,
                email: decoded.user.email,
                compName: decoded.user.companyName,
                expires: decoded.exp
            };
            res.json({message:'Token Verified', dataObj})
        }
    } catch(err) {
        // console.log('err value in the new api route, ', err);
        const dataObj = {data: false, error: err};
        res.json({message: 'There was an error', dataObj})
    }
});
router.post('/api/getcount', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {
            orm.getCurrentCount(decoded.user.companycode, (err, count) => {
                if(count !== null) {
                    res.json({count})
                }else{
                    res.json({count: 0})
                }
            })
        }
    });
});
router.post('/api/processScan', verifyToken ,(req, res) => {
    // console.log("hitting the api process scan route, ", req);
        jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {
            // console.log("This is the request in the process scan route, ", req.body);
            // put in code if the token is good
            //    orm.findOneTag(req.body.tagnum,(err, results) => {
            //          console.log("This is the log from the findontTag orm -- handle.js, ", results);
            //          console.log("This is the error from the findontTag orm -- handle.js, ", err);
            //        if(results !== null) {
                        if (req.body.purpose === 'CONSUME') {
                        orm.check_if_scanned(req.body.tagnum, req.body.purpose, (error5, res5) => {
                            //if error checking

                          if (res5 === true) {
                                res.json({message : "Tag Already Consumed",  data: 'TAGALREADYCONSUMED'})
                          }else {
                              orm.insertToKCARDs(decoded.user.companycode,req.body.purpose, req.body.partnum, req.body.quantity, req.body.tagnum, decoded.user.username,  (err, data) => {
                                  if(err) {
                                      // console.log("Error in adding activity to kcards ", err);
                                      res.json({message: "data was not added", data: null});
                                      //put in code if it was not inserted
                                  }else{
                                      //code out if it inserted.
                                      // console.log("Data should have been added, ", data);
                                      // orm.deleteOneMaster("KCARD_MASTER", "ITEM_TAG_INTEGER", req.body.tagnum, (err, data) => {
                                      //     // console.log("data from delete, ", data);
                                      //     if(data !== null) {
                                      res.json({message: "data was added successfully", data: data});
                                      // }else{
                                      //     // console.log("error in the delete, ", err);
                                      // }
                                      // })
                                  }
                              });
                          }
                        });

                        }else if (req.body.purpose === 'RECEIPT') {
                            // have to updated record in kcards master
                            orm.updateOne('KCARD_MASTER', 'ITEM_TAG_INTEGER', req.body.tagnum, 'DATE_MODIFIED', new Date(), (err, data) => {
                                if(data !== null) {
                                    res.json({message: "data was added successfully", data: "RECEIPT"});
                                }else{
                                    // console.log("error in the delete, ", err);
                                }
                            })
                        }else if (req.body.purpose === 'ERROR') {
                            // res.json({message: 'no action needed as Inventory Item Tag has not been removed from Inventory', data: 'NOERROR'})
                        //    if (req.body.purpose === 'ERROR') {
                                // have to find a row in the kcard_master_raw and insert into kcard_master and remove from kcards
                                orm.runError(req.body.tagnum, (error, data) => {
                                    // console.log('run error, data: ', data);
                                    if(data !== null) {
                                        orm.deleteOneMaster('KCARDS', 'TAG_NUM', req.body.tagnum, (error, data) => {
                                            if(data !== null) {
                                                res.json({data: data})
                                            }else{
                                                res.json({data: error});
                                            }
                                        });
                                        // res.json({message: "data was added successfully", data: data});
                                    }else{
                                        // console.log("error in the runError, ", err);
                                    }
                                })
                            // }else {
                             //   res.json({message: "data was not added", data: 'TAGALREADYCONSUMED'})
                           // }
                        }
                   // }
                   // else if (results === null) {
                   //   if (req.body.purpose === 'ERROR') {
                   //          // have to find a row in the kcard_master_raw and insert into kcard_master and remove from kcards
                   //       orm.runError(req.body.tagnum, (error, data) => {
                   //           // console.log('run error, data: ', data);
                   //           if(data !== null) {
                   //               orm.deleteOneMaster('KCARDS', 'TAG_NUM', req.body.tagnum, (error, data) => {
                   //                   if(data !== null) {
                   //                       res.json({data: data})
                   //                   }else{
                   //                       res.json({data: error});
                   //                   }
                   //               });
                   //               // res.json({message: "data was added successfully", data: data});
                   //           }else{
                   //               // console.log("error in the runError, ", err);
                   //           }
                   //       })
                   //      }else {
                   //       res.json({message: "data was not added", data: 'TAGALREADYCONSUMED'})
                   //   }
                   // }
             //   })
        }
    });
});
router.post('/api/consumed', verifyToken , (req, res) => {
    jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {
            console.log(`This is the decoded data: ${decoded}`);
            orm.dashboardData(decoded.user.companycode, req.body.filtered, (err, data) =>{
                if(err) {
                    res.status(403).json({message: 'error in getting the data', data: err})
                }else{
                    res.status(200).json({data: data});
                }
            })
        }
    });
});
router.post('/api/consumedTable', verifyToken , (req, res) => {
    jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {
            orm.dashboardDataTable(decoded.user.companycode, (err, data) =>{
                if(err) {
                    res.status(403).json({message: 'error in getting the data', data: err})
                }else{
                    res.status(200).json({data: data});
                }
            })
        }
    });
});
router.post('/reporting', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {
          if (req.body.period <= 5) {
              switch(req.body.period) {
                  case 1:
                      //run code
                      orm.reporting1(decoded.user.companycode, (err, data) => {
                          if(err) {
                              res.status(403).json({message: 'error in getting the data', data: err})
                          }else{
                              res.status(200).json({data: data});
                          }
                      });
                      break;
                  case 2:
                      //run code
                      orm.reporting2(decoded.user.companycode, (err, data) => {
                          if(err) {
                              res.status(403).json({message: 'error in getting the data', data: err})
                          }else{
                              res.status(200).json({data: data});
                          }
                      });
                      break;
                  case 3:
                      //run code
                      orm.reporting3(decoded.user.companycode, (err, data) => {
                          if(err) {
                              res.status(403).json({message: 'error in getting the data', data: err})
                          }else{
                              res.status(200).json({data: data});
                          }
                      });
                      break;
                  case 4:
                      //run code
                      orm.reporting4(decoded.user.companycode, (err, data) => {
                          if(err) {
                              res.status(403).json({message: 'error in getting the data', data: err})
                          }else{
                              res.status(200).json({data: data});
                          }
                      });
                      break;
                  case 5:
                      //run code
                      // console.log("this is the handle.js dataObj: ", req.body);
                      orm.reporting5(decoded.user.companycode, req.body.range1, req.body.range2, (err, data) => {
                          if(err) {
                              res.status(403).json({message: 'error in getting the data', data: err})
                          }else{
                              res.status(200).json({data: data});
                          }
                      });
                      break;
              }

          }

        }
    });
});

router.post('/sendEmail', (req, res) => {
    const {SEND_TO, SUBJECT, MESSAGE} = req.body;

    orm.sendEmail(SEND_TO, SUBJECT, MESSAGE, (err, data) => {
        if (data !== null) {
            res.status(200).json({data: data})
        }else{
            res.status(403).json({message: 'Error in adding to table', data: 3})
        }
    })
});

router.post('/summaryreporting', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err) {
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else{
            const {companycode} = decoded.user;

            orm.insertToReport(companycode, (err, data) => {
                if (data !== null) {
                    res.status(200).json({data: data})
                }else{
                    res.status(403).json({message: 'Error in adding to table', data: 3})
                }
            })


        }
    })
});

// router.post('/139.64.200.80/', function(req, res) {
//     console.log('this is the toekn in the verify route ', req.body);
//     try {
//         let decoded = jwt.verify(req.body.token, process.env.SECRETE_KEY_OR_SO);
//         console.log('decoded value in the new api route, ', decoded);
//         if (typeof decoded !== 'undefined'){
//             res.json({message:'Token Verified', data: true})
//         }
//     } catch(err) {
//         console.log('err value in the new api route, ', err);
//         res.json({message: 'There was an error', error: err})
//     }
// });
function verifyToken (req, res, next) {
    // console.log("VerifyToken request is the following, ", request);
    // console.log("VerifyToken request header, ", req.headers);
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // console.log("This is the token that is being sent as the header, ", bearerToken);
        next();
    }else{
        //forbidden
        res.status(403).json({message: 'token is invalid'});
    }
}

module.exports = router;