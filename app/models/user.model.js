const mongoose = require("mongoose"),
        MAX_LOGIN_ATTEMPTS = 3,
        LOCK_TIME = 5 * 60 * 1000; // 5mins


const schema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true}},
    password: { type: String, required: true, index: { unique: true}},
    loginAttempts: { type: Number, required: true, default: 0 },
    //isLocked: {type: Boolean, default: false},
    lockUntil: { type: Number}
});


schema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
    });

schema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, 
    // restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    };

    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.updateOne(updates, cb);
    };

// expose enum on the model, and provide an internal convenience reference 
    // var reasons = schema.statics.failedLogin = {
    // NOT_FOUND: 0,
    // PASSWORD_INCORRECT: 1,
    // MAX_ATTEMPTS: 2
    // };


const User = mongoose.model("User", schema);


module.exports = User;
