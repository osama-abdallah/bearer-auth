"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();

const SECRET = process.env.SECRET;

const DATABASE_URL =
  process.env.NODE_ENV == "test" ? "sqlite:memory" : process.env.DATABASE_URL;

let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {};

let sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);


const UsersModel = (sequelize,DataTypes) =>{

const Users = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
      type:DataTypes.VIRTUAL
  }
})

Users.authenticateBasic = async function (username,password) {
  try {
      const user = await this.findOne({where:{username:username}});
      const valid = await bcrypt.compare(password,user.password);
      if(valid) {
          // generate a new token
          let newToken = jwt.sign({exp:Math.floor(Date.now()/1000)+900,username:user.username},SECRET);
          user.token = newToken;
          return user;
      } else {

          throw new Error('Invalid password');
      }
  } catch(error) {
     throw new Error(`error ,${error}`);
  }
}

Users.validateToken = async function(token) {
  const parsedToken = jwt.verify(token,SECRET);
 
  const user = await this.findOne({where:{username:parsedToken.username}});
  if(user) {
      return user
  } else {
  throw new Error('invalid token')
}
}

return Users;

}
module.exports = {
  db: sequelize,
  Users: UsersModel(sequelize,DataTypes), 
};
