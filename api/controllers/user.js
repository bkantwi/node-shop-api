const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.create_user = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email already exist'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash 
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        }
    })
};

exports.login_user = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id,
                    }, 
                    'secret',
                    {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                })
            }
            res.status(401).json({
                message: 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};

exports.delete_user = (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted',
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};