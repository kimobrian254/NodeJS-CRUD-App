const User = require("../models").User;
const loggerW = require("winston");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

let isFieldValid = (field) => !(!field || field=== "");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.AUTH_SECRET;
passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
  User.findOne({ id: jwt_payload.id }).then((user)=> {
    if (!user) return done(null, false);
    delete user.dataValues.password;
    return done(null, user);
  }).catch(err=>  done(null, err));
}));

module.exports = {
  passport,
  loginUser: (req, res) => {
    let { email, password } = req.body;
    return User.findOne({ email }).then( (user) => {
      if(!user) return res.status(401).json({ 
        error: true, message: "Invalid Login Credentials" 
      });
      
      const match =  bcrypt.compare(password, user.dataValues.password);
      delete user.dataValues.password;
      loggerW.info(user.dataValues);
      
      if(match) {
        let token = jwt.sign(user.dataValues, opts.secretOrKey);
        return res.status(200).json({ message: "Login Successful", token });
      }
      else return res.status(401).json({ 
        error: true, message: "Invalid Login Credentials" 
      });
    });
  },
  signupUser: (req, res) => {
    let { firstName, lastName, email, password } = req.body;
    let errors = {};
    if(!isFieldValid(firstName)) { errors["firstName"] = "Required"; }
    if(!isFieldValid(lastName)) { errors["lastName"] = "Required"; }
    if(!isFieldValid(email)) { errors["email"] = "Required"; }
    if(!isFieldValid(password)) { errors["password"] = "Required"; }
    if(Object.keys(errors).length === 0 && errors.constructor === Object) {
      let hashedPassword = bcrypt.hash(password, 10);
      return User.create({ 
        firstName, lastName, email, password: hashedPassword 
      })
        .then((user)=>{
          delete user.dataValues.password;
          loggerW.info(JSON.stringify(user));
          return res.status(200).json({ "message": "Registered successfully" });
        }).catch(err=> {
          loggerW.error("Error:>>", err);
          return res.status(500).json({ "error": "Something went wrong!" });
        });
    }
    return res.status(400).json(Object.assign({}, { error: true }, errors));
  }
};
