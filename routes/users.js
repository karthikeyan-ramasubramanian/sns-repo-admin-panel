const express = require('express')
//const swal = require('sweetalert');
const users = express.Router()
const fadmin = require('../config')
const db = fadmin.firestore()
const auth = fadmin.auth()

// users.get('/', (req, res) => {
//     res.render('users/addusers')
// })
users.get('/', (req, res) => {
    
    db.collection('admin').get()
    .then(adm=>{
        let u=[];

        adm.forEach(ur=>{
          //  console.log(r.data())
            data = ur.data()
            u.push(data)
           
           // console.log(data.id)
        })
      //  console.log(u);
        res.render('users/addusers',{admin:u})
    })
    
   // res.send("success");
})
users.post('/',(req,res)=>{
    const username = req.body.username;
    const email = req.body.email;

    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
  //  console.log(username+"  "+email+password+"  "+confirmpassword);
    if(password !== confirmpassword){
        
      res.redirect('/users?dir=users&response=Passwords did not match');
        // alert("Passwords did not match");
        console.log("Passwords did not match");
        // swal("Passwords did not match");

      }
      else{
        db.collection("admin").doc(email).set({
            email: email,
            user: username,
            pass: password
        })
        
        .catch((error) => {
            console.error("Error adding document: ", error);

        });
        res.redirect('/users?dir=users&response=Admin added successfully');
        
      }
      
})
users.get('/delete', (req, res) => {
  const uid = req.query.id;
  console.log(uid)
 
     
      db.collection("admin").doc(uid).delete() 
      res.redirect('/users?dir=users&response='+uid+' has been deleted successfully')
   
})






module.exports = users

