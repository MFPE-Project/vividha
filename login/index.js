const express=require('express');
const mongoose=require('mongoose');
const customer = require('./routes/customer');
const loan = require('./routes/loan');
const update=require('./routes/update')
const app=express();

if (!'jwtPrivateKey') {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
  }
  
//mongoose.connect returns promise
mongoose.connect('mongodb://localhost/user',{ useUnifiedTopology: true ,useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB..'))
    .catch(error => console.log('Could not connect to Mongodb..',error));

app.use(express.json());
app.use('/api/customer', customer);
app.use('/api/routes/loan',loan);
app.use('/api/update',update);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));