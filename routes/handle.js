const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const func = require( '../functions/functions');

const orm = require('../config/orm');
//middleware to protect routes

router.get("/", function(req, res) {
    console.log("Route was hit.");
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
        console.log('this is the data', data)
    }))
});

router.post('/register', function(req, res) {
    console.log('Register API is being hit');
    orm.addoneUser(req.body.userName, req.body.password, req.body.email, req.body.companyCode, (err, data) => {
        console.log('---data is coming back from query---', data);
        if(data && (data !==0 && data !== 3)){
            console.log('this is the data that came back from the call ', data);
            res.json({message:'Data has been inserted', data: data})
        }else if(data === 0 || !data) {
            res.json({message: 'user already exists', data: 0});
        }else if(data === 3) {
            res.json({message: 'No comp code exist', data: 3});
        }
    })
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

        console.log("This is the data in the verify/api being created as an object, ", tokenObj);
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
   console.log('Login API is being Hit ', req.body);
   if(req.body.password) {
       orm.findoneUser(req.body.usrname, (err, data) => {
           console.log('handle.js page, login is receiving this data, ', data.data[0]);
           if (data.data[0]) {
               res.status(200).json(data.data[0][0])
           }
           else {
               console.log('no user was found');
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
        console.log('this is the data', data);
        return data;
    }))
});

router.post('/api/verify', function(req, res) {
    console.log('this is the toekn in the verify route ', req.body);
    try {
        let decoded = jwt.verify(req.body.token, process.env.SECRETE_KEY_OR_SO);
        // console.log('decoded value in the new api route, ', decoded);
        console.log('decoded value in the new api route, ', decoded);
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
        console.log('err value in the new api route, ', err);
        const dataObj = {data: false, error: err};
        res.json({message: 'There was an error', dataObj})
    }
});

router.post('/api/processScan', verifyToken ,(req, res) => {
    // console.log("hitting the api process scan route, ", req);

        jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {

            console.log("This is the request in the process scan route, ", req.body);
            // put in code if the token is good


                orm.findOneTag(req.body.tagnum,(err, results) => {
                    console.log("This is the log from the findontTag orm -- handle.js, ", results);
                    console.log("This is the error from the findontTag orm -- handle.js, ", err);

                    if(results !== null) {

                        if (req.body.purpose === 'CONSUME') {
                        orm.insertToKCardss(decoded.user.companycode,req.body.purpose, req.body.partnum, req.body.quantity, req.body.tagnum, (err, data) => {
                            if(err) {
                                console.log("Error in adding activity to kcards ", err);
                                res.json({message: "data was not added", data: null})
                                //put in code if it was not inserted
                            }else{
                                //code out if it inserted.
                                console.log("Data should have been added, ", data);
                                orm.deleteOneMaster("KCARD_YODA", "ITEM_TAG_INTEGER", req.body.tagnum, (err, data) => {
                                    console.log("data from delete, ", data);
                                    if(data !== null) {
                                        res.json({message: "data was added successfully", data: data});
                                    }else{

                                        console.log("error in the delete, ", err);
                                    }
                                })
                            }
                        })
                        }else if (req.body.purpose === 'RECEIPT') {
                            // have to updated record in kcards master
                            orm.updateOne('KCARD_YODA', 'ITEM_TAG_INTEGER', req.body.tagnum, 'DATE_MODIFIED', new Date(), (err, data) => {
                                if(data !== null) {
                                    res.json({message: "data was added successfully", data: "RECEIPT"});
                                }else{
                                    console.log("error in the delete, ", err);
                                }
                            })
                        }else if (req.body.purpose === 'ERROR') {
                            res.json({message: 'no action needed as Inventory Item Tag has not been removed from Inventory', data: 'NOERROR'})
                        }
                    }

                    else if (results === null) {
                     if (req.body.purpose === 'ERROR') {
                            // have to find a row in the kcard_yoda_raw and insert into kcard_yoda and remove from kcards
                         orm.runError(req.body.tagnum, (error, data) => {
                             console.log('run error, data: ', data);
                             if(data !== null) {
                                 orm.deleteOneMaster('KCARDSS', 'TAG_NUM', req.body.tagnum, (error, data) => {
                                     if(data !== null) {
                                         res.json({data: data})
                                     }else{
                                         res.json({data: error});
                                     }
                                 });
                                 // res.json({message: "data was added successfully", data: data});
                             }else{
                                 console.log("error in the runError, ", err);
                             }
                         })

                        }else {
                         res.json({message: "data was not added", data: 'TAGALREADYCONSUMED'})
                     }

                    }
                })
        }
    });
});

router.post('/api/consumed', verifyToken , (req, res) => {
    jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.status(403).json({message: "Token invalid", data: 'INVALIDTOKEN'});
        }else {
            orm.dashboardData(decoded.user.companycode, (err, data) =>{
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
                      console.log("this is the handle.js dataObj: ", req.body);
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


router.post('/139.64.200.80/', function(req, res) {
    console.log('this is the toekn in the verify route ', req.body);
    try {
        let decoded = jwt.verify(req.body.token, process.env.SECRETE_KEY_OR_SO);
        console.log('decoded value in the new api route, ', decoded);
        if (typeof decoded !== 'undefined'){
            res.json({message:'Token Verified', data: true})
        }
    } catch(err) {
        console.log('err value in the new api route, ', err);
        res.json({message: 'There was an error', error: err})
    }
});



function verifyToken (req, res, next) {

    // console.log("VerifyToken request is the following, ", request);
    console.log("VerifyToken request header, ", req.headers);

    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken;
        console.log("This is the token that is being sent as the header, ", bearerToken);
        next();

    }else{
        //forbidden
        res.status(403).json({message: 'token is invalid'});
    }
}


module.exports = router;