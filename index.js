'use strict';


const {db} =require('./src/auth/models/users-model')
const server =require('./src/server');
const dotenv =require('dotenv');
dotenv.config();



const PORT =(process.env.PORT || 3001);



db.sync().then(()=>{
    server.start(PORT);
})