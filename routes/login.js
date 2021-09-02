const express = require('express')
const login = express.Router()
const Fadmin = require('../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = Fadmin.firestore()
require("dotenv").config();
login.get('/', (req, res) => {
    res.render('login')
})


login.post('/', async (req, res) => {

    console.log(req.body)
    // Our login logic starts here
    try {
      // Get user input
      const email = req.body.email
      const pass = req.body.pass
      console.log(email+" "+pass)
      // Validate if user exist in our database
      db.collection('admin').doc(email).get()
      .then(async (x)=>{

        
      // // Validate user input
      // if (!(email && pass)) {
      //   res.status(400).send("All input is required");
      // }
      console.log("=====Tag=====")
    
      var user = x.data()
      console.log(user.email+" "+email) 
      console.log(user.email==email) 
      console.log(user.pass+" "+pass) 
      console.log(user.pass==pass) 
        if(user.email==email && user.pass==pass){
          // Create token
          const token = jwt.sign(
            { user_id: await bcrypt.hash(user.email,10), email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2hr",
            }
          );  
          
          user ={}
          user.token = token;
          res.cookie('x-access-token',token) 
          res.status(200).redirect('/')
          //res.status(200).json(user);

          
        }else{
          res.status(400).send("Invalid Credentials");
        }
        // save user token
       })
  
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });



module.exports = login
