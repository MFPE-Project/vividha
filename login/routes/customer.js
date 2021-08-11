const {Customer, validate} = require('../models/customers'); 
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');


//get specific customer by user name
router.get('/', auth,async (req, res) => {

    try{
      const token=req.header('x-auth-token');
      const decoded=jwt.verify(token,'jwtPrivateKey');
      Customer.find({ username:decoded.username })
          .then((response) => {
          res.json({
               response
          });
        })
      }
        catch(error){
          console.log(error)
        }
  });


//register customer
router.post('/register' , async(req,res,next) => {
    const { error } =validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if user already exists
     let customer = await Customer.findOne({ username : req.body.username});
     if(customer) {
         return res.status(400).send('User already exists');
     }
     else{
            try{
            let customer= new Customer(_.pick(req.body,
                 ['fullname','username','password','address','state','country','email','pan','contact_no','dob','account_type']));
            const salt = await bcrypt.genSalt(10);
           customer.password = await bcrypt.hash(customer.password, salt);
            customer = await customer.save();
            // const token=customer.generateAuthToken();
            // res.status(200).send(token);
              res.status(200).send('Customer registered Successfully');
            }catch(ex) {
                res.status(500).send("Something Failed");
            }
        }
});

router.post('/login',async(req,res) => {
  
  let customer = await Customer.findOne({ username: req.body.username });
    if(!customer) return res.status(400).send('Invalid user name');
    

  const validPassword = await bcrypt.compare(req.body.password, customer.password);
  
  if(!validPassword ) 
  {
    return res.status(400).send('Invalid password ');
  }
  else
  {
   // return res.status(200).send('Login successful');
   
    // const token=customer.generateAuthToken();
    // req.header("x-auth-token",token,{httpOnly:true, maxLimit:maxLimit*1000});
    const token=jwt.sign({ _id: customer._id,username:customer.username},'jwtPrivateKey',{
      expiresIn:'1d'
    });

    let oldTokens=customer.tokens || []

    if(oldTokens.length){
      oldTokens = oldTokens.filter(t =>{
     const timediff =  (Date.now() - parseInt(t.signedAt)) /1000;
        if(timediff < 86400) {
          return t;
        }
       });
    }

    await Customer.findByIdAndUpdate(customer._id,{tokens: [...oldTokens,{token,signedAt:Date.now().toString()}]});
      res.status(200).send(token);


   }

 
});

// router.post('/logout',auth,async(req,res) => {
  // const token=req.header('x-auth-token');
  // if(token){
  //   const token_d=token.split()[0];
  // //console.log(token_d);
  //   if(!token_d){
  //    return res.status(401).send("Authorization Fails");
  //   }
  //   const tokens=req.user;
    
  //   newTokens=null;
  //   await Customer.findByIdAndUpdate(tokens._id,{tokens:newTokens})
  //   res.status(200).send("Logout successfully");
// }
  
// });

  router.post('/logout', auth, async(req, res) => {
    try{
     let token=req.header('x-auth-token');
        let randomNumberToAppend = toString(Math.floor((Math.random() * 1000) + 1));
       // let randomIndex = Math.floor((Math.random() * 10) + 1);
        let hashedRandomNumberToAppend = await bcrypt.hash(randomNumberToAppend, 10);
    
        // now just concat the hashed random number to the end of the token
        token = token+ hashedRandomNumberToAppend;
        return res.status(200).json({status:"Logout Successfully",tokens:token});
        //return res.status(200).json({status:"Logout Successfully"});

    }catch(err){
        return res.status(500).json(err.message);
    }
});
  



module.exports = router;