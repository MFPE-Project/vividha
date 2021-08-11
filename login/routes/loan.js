const express = require('express');
const auth = require('../middleware/auth');
const jwt= require('jsonwebtoken');
const router = express.Router();
const jwt_decode=require('jwt-decode');
const mongoose = require('mongoose');
const _ = require('lodash');
const {Loan, validateLoan} = require('../models/loans'); 
 


//get loan by Id
router.get('/:id',auth, async (req, res) => {
  try{
    //const loan = await Loan.findById(req.params.id);
    const loan=await Loan.findById(req.params.id);
    if(!loan) {return res.status(404).send('Loan not found');}
    else{
    return res.status(200).send(loan);
    }
    
  }catch(error) {
    console.log(error);
  }
});

//get loan by username
  router.get('/',auth,async(req,res) => {
    
     try{
        const token=req.header('x-auth-token');
        const decoded=jwt.verify(token,'jwtPrivateKey');
        Loan.find({ username:decoded.username })
            .then((response) => {
            res.json({
              response,
            });
          })
        }
          catch(error){
            console.log(error)
          }
          
      
    });

  //user with loan
router.post('/applyLoan',auth,async (req,res) => {
  
  try{
    const token=req.header('x-auth-token');
    const decoded=jwt.verify(token,'jwtPrivateKey');
      const { error } =validateLoan(req.body);
        if(error) return res.status(400).send(error.details[0].message);  

        const {  
          username=decoded.username,
          loanType,
          loanAmount,
          date,
          rateOfInterest,
          durationOfLoan
        }=req.body;
        const loan = await Loan.create({
          username,
          loanType,
          loanAmount,
          date,
          rateOfInterest,
          durationOfLoan
        });
        
        console.log(username);

        res.status(200).send(loan);


      
      }catch(error){
        console.log(error)
      }
        
});

  

module.exports = router;
      //   if(!loan) {
      //     return res.send("this user not have loan");
      //   }

      //   const newLoan = new Loan(_.pick(req.body,
      //        ['username']));


      //   const saved=await loan.save();
      //   return res.send(saved);
      // }catch(error){
      //   message:"userId is  incorrect"
      // }


  

//  //get all the users applied for loan
//   router.get('/loans',async(req,res)=>{
//     try{
//       const loan=await Loan.find();
//       //if no user found return below
//       if(loan.length<1)  return res.send("No loan on any customer!!");
      
//       return res.status(200).send(loan);

//     }
//     catch(error)
//     {
//       console.log(error);
//     }
//   }); 

  





