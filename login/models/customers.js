const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const customerSchema = new mongoose.Schema({
    fullname: {
        type:String,
        required:true,
        minLength:5,
        maxLength:50
    },
    username:{
        type:String,
        required:true,
        minLength:5,
        maxLength:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:5,
        maxLength:1024
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        minLength:5,
        maxLength:255,
        unique:true
    },
    pan:{
        type:String,
        required:true,
        unique:true
    },
    contact_no:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    account_type:{
        type:String,
        enum:['current account','saving account','demat account'],
        required:true
    },
    tokens:[{type:Object}]

});

// customerSchema.methods.generateAuthToken = function() { 
//     const token = jwt.sign({ _id: this._id,username:this.username},'jwtPrivateKey');
//     return token;
// }
// customerSchema.methods.generateAuthToken = function() { 
    
//       const token=  jwt.sign({ _id: this._id,username:this.username},'jwtPrivateKey',expiresIn="1h");
//             return token;

// }
const Customer = mongoose.model('Customer', customerSchema);

  

function validateCustomer(customer) {
    const schema = {
      fullname: Joi.string().min(5).max(50).required(),
      username :Joi.string().min(5).max(50).required(),
      password :Joi.string().required().min(5).max(1024),
      address: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      email: Joi.string().email().required().min(5).max(255),
      pan: Joi.string().required(),
      contact_no: Joi.string().required(), 
      dob: Joi.required(),
      account_type: Joi.string().required()
    };
  
    return Joi.validate(customer, schema);
  }

  exports.Customer = Customer;
  exports.validate = validateCustomer;
  


