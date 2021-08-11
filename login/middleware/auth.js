const jwt = require('jsonwebtoken');
const {Customer} = require('../models/customers'); 
module.exports = function auth(req,res,next){
  
   const token=req.header('x-auth-token');
   if(!token) return res.status(401).send('Access denied');
   try{
     const decoded=jwt.verify(token,'jwtPrivateKey');
    req.user=decoded;
    
   // tokens=req.user;
     next();
 }
   catch(ex){
       res.status(400).send('Please login again.')
  } 
}

