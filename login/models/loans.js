
const Joi = require('joi');
const mongoose = require('mongoose'); 


const loanSchema = new mongoose.Schema({
    // customer_id: {
    //     type: String,
    //     required:true
    // },
    username:{
        type:String,
        required:true
    },
    loanType: {
        type:String,
        enum:['personal loan','home loan','car loan','business loan','agriculture loan','education loan'],
        required:true
    },

    loanAmount: {
        type:Number,
        required:true,
        minLength:5,
        maxLength:8
    },
    
    date: {
        type:Date,
        required:true
    },
    
    rateOfInterest: {
        type:Number,
        required:true
    },

    durationOfLoan: {
        type:Number,
        required:true
    },
    // userId: {
    //     type:String,
    //     required:true
    //         // ref:'Customer',
    //         // type:mongoose.Schema.Types.ObjectId
    // }
   
});

// loanSchema.methods.generateAuthToken = function() { 
//     const token = jwt.sign({ _id: this._id,username:this.username},'jwtPrivateKey');
//     return token;
//   }


const Loan = mongoose.model('Loan', loanSchema);

function validateLoan(loan) {
    const schema = Joi.object({
        
      loanType: Joi.string().required(),
      loanAmount: Joi.required(),
      date: Joi.string().required(),
      rateOfInterest: Joi.required(),
      durationOfLoan: Joi.required(),
    //userId: Joi.required()
    });
  
    return Joi.validate(loan, schema);
  }

  exports.Loan = Loan;
  exports.validateLoan = validateLoan;