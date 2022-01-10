const app = require("../../server");
const User = require("../models/user.model");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();


// use chaiHttp for making the actual HTTP requests   
chai.use(chaiHttp);
describe('Signup & signin API tests', function() {
    beforeEach(function(done) {
        var newUser = new User({
            username: 'test1',
            password: "123456",
            loginAttempts: 4,
        });
        
        newUser.save(function(err) {
            done();
        });
    });
    afterEach(function(done) {
        User.remove({'username':'test3'}).then(function() {

            // success     
        }).catch(function(err) {

            // error handling
            //console.warn(' User may not exists!');
            return console.log(err);
        })
        done();
    });

    it('should fail to signup existing user test1 on /api/auth/signup POST', function(done) {
        chai.request(app)
            .post('/api/auth/signup')
            .send( {
                'username': "test1",
                'password': "123456",
            })
            .end(function(err, res) {
                if (err) return err;
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.have.property('message');
                res.body.message.should.equal('Failed! Username has been taken.');
                done();
            });
        });
    it('should fail to signup existing user test2 on /api/auth/signup POST', function(done) {
            chai.request(app)
                .post('/api/auth/signup')
                .send( {
                    'username': "test2",
                    'password': "123456",
                })
                .end(function(err, res) {
                    if (err) return err;
                    res.should.have.status(400);
                    res.should.be.json;
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Failed! Username has been taken.');
                    done();
                });
        });
    it('should able to signup new user test3 on /api/auth/signup POST', function(done) {
                chai.request(app)
                    .post('/api/auth/signup')
                    .send( {
                        'username': "test3",
                        'password': "123456",
                    })
                    .end(function(err, res) {
                        if (err) return err;
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.have.property('message');
                        res.body.message.should.equal('User added successfully!');
                        done();
                    });
        });

    it('should able to login user test2 on /api/auth/signin POST', function(done) {
                chai.request(app)
                .post('/api/auth/signin')
                .send( { 
                    username: 'test2',
                    password: "123456"
                })
                .end(function(err, res) {
                    if (err) return err;
                    res.body.message.should.equal("Signin successfully!");
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.username.should.equal("test2");
                    res.body.should.have.property('accessToken');
                    res.body.should.have.property('id');
                    //res.body.password.should.equal('123456');
                    //res.body.should.be.a('object');
                    //res.body.should.have.property('');
                    done();
                });
        });
        
    it('should fail to login locked user test1 on /api/auth/signin POST', function(done) {
            chai.request(app)
            .post('/api/auth/signin')
            .send( { 
                username: 'test1',
                password: "123456",
                loginAttempts: 4,
            })
            .end(function(err, res) {
                if (err) return err;
                res.body.message.should.contain("User is locked");
                res.should.have.status(404);
                res.should.be.json;
                done();
            });
        });
    });
