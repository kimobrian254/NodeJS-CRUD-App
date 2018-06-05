const User = require("../models").User;
const loggerW = require("winston");
const bcrypt = require('bcrypt');

let isFieldValid = (field) => !(!field || field=== "");

module.exports = {
  loginUser: (req, res) => {
    let { email, password } = req.body;
    return User.findOne({where: { email }}).then(async (user) => {
      if(!user) return res.status(401).json({ error: true, message: "Invalid Login Credentials" });
      
      const match = await bcrypt.compare(password, user.dataValues.password);
      delete user.dataValues.password;
      loggerW.info(user.dataValues);
      if(match) return res.status(200).json({ message: "Login Successful", ...user.dataValues });
      else return res.status(401).json({error: true, message: "Invalid Login Credentials"});
    })
  },
  signupUser: async (req, res) => {
    let { firstName, lastName, email, password } = req.body;
    let errors = {};
    if(!isFieldValid(firstName)) { errors["firstName"] = "Required"; }
    if(!isFieldValid(lastName)) { errors["lastName"] = "Required"; }
    if(!isFieldValid(email)) { errors["email"] = "Required"; }
    if(!isFieldValid(password)) { errors["password"] = "Required"; }
    if(Object.keys(errors).length === 0 && errors.constructor === Object) {
      let hashedPassword = await bcrypt.hash(password, 10);
      return User.create({ firstName, lastName, email, password: hashedPassword }).then((user)=>{
        delete user.dataValues.password;
        loggerW.info(JSON.stringify(user));
        return res.status(200).json({"message": "Registered successfully"});
      }).catch(err=> {
        loggerW.error("Error:>>", err);
        return res.status(500).json({"error": "Something went wrong!"});
      });
    }
    return res.status(400).json(Object.assign({}, {error: true }, errors));
  }
};
