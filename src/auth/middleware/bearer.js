'use strict';

const {Users} = require("../models/users-model")

module.exports = async (req,res,next)=>{
    if(req.headers['authorization']) {
        // 'Bearer token'
        let token= req.headers.authorization.split(' ')[1];
    try {
        let user = await Users.validateToken(token)
        req.user = user
        next();
    } catch (error) {
        res.status(403).send(`Invalid user ${error}`)
    }
      
    }
}