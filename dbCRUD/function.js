const db = require("../models");

module.exports ={
    add: (req, res) => {
        console.log('This is what is being added', req);
        db.testUserTable.create(req.body)
            .then(
                mess => res.json(mess)
            )
            .catch(
                err => res.status(422).json(err)
            )
        },
    update: (req, res) => {
        db.testUserTable.findOneAndUpdate({username: req.body.username})
            .then(
                mess => res.json(mess)
            )
            .catch(
                err => res.status(422).json(err)
            )


    },
    read: (req, res) => {
        db.testUserTable.findOne({username: req.body.username})
            .then(
                mess => res.json(mess)
            ).catch(
                err => res.status(422).json(err)
        )
    },
    delete: (req, res) => {
        db.testUserTable.findOneAndDelete({username: req.body.username})
            .then(
                mess=> res.json(mess)
            )
            .catch(
                err => res.status(422).json(err)
            )
    }

};