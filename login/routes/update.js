const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const _ = require('lodash');
const {Customer, validate} = require('../models/customers'); 
const {Loan, validateLoan} = require('../models/loans'); 
const bcrypt = require('bcrypt');

//update customer details
router.put('/customer/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const salt = await bcrypt.genSalt(10);
    let customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        fullname:req.body.fullname,
        username:req.body.username,
        password:req.body.password,
        address:req.body.address,
        state:req.body.state,
        country:req.body.country,
        email:req.body.email,
        pan:req.body.pan,
        contact_no:req.body.contact_no,
        dob:req.body.dob,
        account_type:req.body.account_type
        
      },{ new: true });
      
      customer.password = await bcrypt.hash(customer.password, salt);
            customer = await customer.save();
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    res.status(200).send('Customer detail updates successfuuly');
  });

//updating loan details
  router.put('/loan/:id', auth,async (req, res) => {
    const { error } = validateLoan(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const loan = await Loan.findByIdAndUpdate(req.params.id,
      { 
        
          loanType:req.body.loanType,
          loanAmount:req.body.loanAmount,
          date:req.body.date,
          rateOfInterest:req.body.rateOfInterest,
          durationOfLoan:req.body.durationOfLoan
        
      }, { new: true });
  
    if (!loan) return res.status(404).send('The customer with the given ID was not found.');
    
    res.status(200).send('Loan detail updates successfuuly');
  });


  module.exports = router;