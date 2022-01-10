const config = require("../config/auth.config");
const db = require("../models/index");
const User = require("../models/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
    bcrypt.hash(req.body.password,10).then(
        (hash) => {
            const user = new User({
                username: req.body.username,
                password: hash
            });
            //201 Created
            user.save().then(
                () => {
                    res.status(201).json({
                        message: "User added successfully!"
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

exports.signin = async (req, res) => {
    try {
        User.findOne({username: req.body.username}).exec(
            (err, user) => {
                if(err) {
                    res.status(500).send({ message: err});
                    return;
                }
    
                if(!user) {
                    return res.status(404).json({ message: "User not found!"});
                }
                //update
                if(user.isLocked) {
                    var d = new Date(user.lockUntil);
                    return res.status(404).json({ message: "User is locked! Wait until: " + d.toLocaleString()});
                }
                //authentication password
                bcrypt.compare(req.body.password, user.password).then(
                     async (valid) => {
                         try {

                            if(valid) {
                                var token = jwt.sign({ id: user.id}, config.secret,{
                                    expiresIn: 86400 //24hrs
                                });
                                //reset attempts and lock information
                                var updates = {
                                    $set: { loginAttempts: 0 },
                                    $unset: { lockUntil: 1 }
                                };
                                user.updateOne(updates, function(err) {
                                    if (err) return cb(err);
                                });                                    
                                return res.status(200).json({
                                    message: "Signin successfully!",
                                    id: user.id,
                                    username: user.username,
                                    accessToken: token,
                                });
                                
                            }
    
                            if (!valid) {
                                user.incLoginAttempts(function(err) {
                                    if (err) return cb(err);
                                    return res.status(401).json({
                                        accessToken: null,
                                        message: "Invalid password! You've tried: " + user.loginAttempts +" times!"
                                    });
                                });
                            }
                        }   
        
                        catch (err) {
                            console.error("Login error", err);
                            return res.status(500).json({
                            error: true,
                            message: err + " Sorry, couldn't process your request right now. Please try again later."});
                            
                    }
                 }
             );
            }
        
        );
    } catch (err) {
        next(err);
    }

};