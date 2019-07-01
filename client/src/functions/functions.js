const bcrypt = require('bcrypt-nodejs');
const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);

const func_ = {
    encryptPW: function(password) {
        // console.log('This is the data being passed to the encryp function, password ', password);
        let hash = bcrypt.hashSync(password, salt);
        // bcrypt.hash(password, saltRounds).then(function(hash) {
        //
        //     if(hash) {
        //         cb(null, hash);
        //         console.log('This is the hash ', err);
        //     }
        //     cb(hash, null);
        //     console.log('This is the hash ', data);
        // });
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

    }

};

module.exports = func_;

