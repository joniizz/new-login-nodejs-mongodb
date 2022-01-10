const request = require("supertest");
const app = require("../../server");
const User = require("../models/user.model");
//const endpointUrl = "../app/routes/auth.routes";
//const newUser = require("../tests/mock-data/mock-data.json");
const verifySignUp = require("../middleware/verifySignUp");
// const httpMocks = require("node-mocks-http");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const controller = require("../controllers/auth.controller")
var bcrypt = require("bcryptjs");

// use chaiHttp for making the actual HTTP requests   
chai.use(chaiHttp);
describe('Signup API', function() {
    beforeEach(function(done) {
        var newUser = new User({
            username: 'test1',
            password: "123456"
        });
        
        newUser.save(function(err) {
            done();
        });
    });
    afterEach(function(done) {
        User.collection.drop().then(function() {

            // success     
        }).catch(function(err) {

            // error handling
            //console.warn(' User may not exists!');
            return console.log(err);
        })
        done();
    });

    it('should fail to add an existing user test1 on /api/auth/signup POST', function(done) {
        chai.request(app)
            .post('/api/auth/signup')
            // [verifySignUp.checkDuplicateUsername],
            // controller.signup )
            .send( {
                'username': "test1",
                'password': "123456",
                'loginAttempts': 0,
                'lockUntil': null
            })
            .end(function(err, res) {
                if (err) return err;
                res.should.have.status(400);
                res.should.be.json;
                // res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Failed! Username has been taken.')
                // res.body[0].should.have.property('password');
                // res.body[0].should.have.property('_id');
                done();
            });
        });

        it('should failed to login a wrong password user test 2 on /api/auth/signin POST', function(done) {
            // const pwd = bcrypt.hash("123456",10);
            chai.request(app)
                .post('/api/auth/signin')
                .send( { 
                    username: 'test1',
                    password: '1234567'
                })
                .end(function(err, res) {
                    if (err) return err;
                    res.should.have.status(401);
                    res.should.be.json;
                    //res.body.password.should.equal('123456');
                    res.body.message.should.contain("Invalid password! ");
                    // res.body.should.be.a('object');
                    // res.should.have.property('username');
                    // res.body[0].should.have.property('password');
                    // res.body[0].should.have.property('_id');
                    done();
                });
            });


    });
