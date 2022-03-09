'use strict'

const {Users} = require("../models/users-model")
const base64 = require('base-64');

module.exports = async (req,res,next)=>{
    if(req.headers.authorization) {
        
        let encodedPart= req.headers.authorization.split(' ')[1];

        let decoded = base64.decode(encodedPart);

        let [username,password]= decoded.split(':');
try {
    let validUser = await Users.authenticateBasic(username,password)
    req.user = validUser
    next()
} catch (error) {
    res.status(403).send(error)
}
    }else{
        next('Not Autherised')
    }
}
