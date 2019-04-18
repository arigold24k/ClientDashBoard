const bcrypt = require('bcrypt-nodejs');
const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const func_ = {
    encryptPW: function(password) {
        console.log('This is the data being passed to the encryp function, password ', password);
        let hash = bcrypt.hashSync(password, salt);
        if (hash) {
            return hash;
        }else{
            return 0
        }
    },
    checkPW:function(passwordEnt, passwordIS) {
        const compareVal = bcrypt.compareSync(passwordEnt, passwordIS);
        if(compareVal) {
            return compareVal
        }return 0

    },
    createToken: function(objPass, cb){
        console.log("Create Token Function object that is being passed, ", objPass);
        jwt.sign({user: {id: objPass.id, username: objPass.username, email: objPass.email, companycode: objPass.companycode}}, process.env.SECRETE_KEY_OR_SO, {expiresIn: 60*15}, (err, token) => {
            console.log('data for the token', token);
            console.log('data for the error', err);
            if(err){
                cb(err, null);
            }
            cb(null, token);

        });
    }

};

module.exports = func_;

