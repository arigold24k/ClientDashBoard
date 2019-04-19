const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const func = require( '../functions/functions');

const orm = require('../config/orm');
//middleware to protect routes
function verifyToken (req, res, next) {

    console.log("VerifyToken request is the following, ", req);
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken;
        next();

    }else{
        //forbidden
        res.sendStatus(403);
    }
}

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
        if(data && (data !==0 || data !== 3)){
            console.log('this is the data that came back from the call ', data);
            res.json({message:'Data has been inserted', data: data})
        }else if(data === 0 || !data) {
            res.json({message: 'user already exists', data: 0});
        }else if(data === 3) {
            res.json({message: 'user already exists', data: 3});
        }
        else {
            res.json({message: 'Error in getting data', error: err});
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
            companycode: req.body.comp
        };

        console.log("This is the data in the verify/api being created as an object, ", tokenObj);
        func.createToken(tokenObj, (err, data) => {
            if(err){
                res.status(502).json({message: 'error creating token'});
            }else{
                res.json({token: data, email: req.body.email});
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
        console.log('decoded value in the new api route, ', decoded);
        console.log('decoded value in the new api route, ', decoded.user.email);
        if (typeof decoded !== 'undefined'){
            const dataObj = {
                data : true,
                compCD: decoded.user.companycode,
                email: decoded.user.email

            };
            res.json({message:'Token Verified', dataObj})
        }
    } catch(err) {
        console.log('err value in the new api route, ', err);
        const dataObj = {data: false, error: err};
        res.json({message: 'There was an error', dataObj})
    }
});

router.post('/api/processScan', verifyToken(), (req, res) => {
    console.log("hitting the api process scan route, ", req);

        jwt.verify(req.token, process.env.SECRETE_KEY_OR_SO, (err, decoded) => {
        if(err){
            res.sendStatus(403);
        }else {
            // put in code if the token is good
            orm.insertToKCardss(decoded.user.companycode,req.body.code, req.body.partnum, req.body.qty, req.body.tag_num, (err, data) => {
                if(err) {
                    //put in code if it was not inserted
                }else{
                    //code out if it inserted.
                }
            })
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


module.exports = router;