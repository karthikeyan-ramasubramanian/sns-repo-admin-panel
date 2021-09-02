const express = require('express')
const students = express.Router()
const fadmin = require('../config')
const getAllCourse = require('./getCourse')

const db = fadmin.firestore()
const auth = fadmin.auth()

const value=[]


function getCName(arr,subcode){
    var c;
    arr.forEach(e=>{
       // console.log(e.id)
        
        //console.log(e.name)

            if(e.id==subcode){
               // console.log(e.name)
                c= e.name // return
                 
            }
        
    })

    return c
}


const d=[{
    department:{
        id:"",
        name:"",
        sec:"",
        year:"",            
    },
    email:"",
    name:"",
    reg:"",
    gender:"",
    dob:""
}]

// function getCourse(){
//     db.collection('course').doc('allCourses').get()
//     .then((res)=>{
//         console.log(res.data());
//     })
//     .catch(e=>{console.log(e);})
// }


students.get('/', (req,res) => {
   // getAllCourse(res);

    db.collection("users").get()
    .then(docs=>{
        //console.log(docs)
        let dataArray=[];
        docs.forEach(q=>{
            //console.log(q.data())
            data = q.data()
            dataArray.push(data)
            
        })
        return dataArray
    })
    .then( (d)=>{
       // console.log(d)
       db.collection('course').doc('allCourses').get()
       .then((e)=>{
             const v = e.data().dept;
             console.log("Iam eeeee");
             console.log(v);
      
        
        const val = [v,d] 
        res.render('student/addstudent',{data:val})
       })
       
    })
    // res.render('student/addstudent',{data:d})
})

students.post('/',async(req,res)=>{
    console.log("Iam data of student");
    console.log(req.body);
    const name= req.body.name.toLocaleUpperCase();
    const reg=req.body.reg.toLocaleUpperCase();
    const dept =req.body.dept;
    const sec = req.body.sec;
    const year =req.body.year;
    var email = req.body.email.toLocaleLowerCase();
     email = email.trim();
    console.log("Tag:email");
    console.log(email+"hello");
    const dob =req.body.dob;
    const gender =req.body.gender;

    db.collection('course').doc('allCourses').get()
       .then((e)=>{
            var v =[]
            v = e.data().dept;
         const data={
             department:{
                 id:dept,
                 name:getCName(v,dept),
                 sec:sec,
                 year:year,            
             },
             email:email,
             name:name,
             reg:reg,
             gender:gender,
             dob:dob
         }
    console.log("Iam data");
    console.log(data);


    fadmin
    .auth()
    .createUser({
        uid: email,
      email: email,
      emailVerified: false,
      password: reg,
      disabled: false,
    })
    .then((userRecord) => {
      
      console.log('Successfully created new user:', userRecord.uid);
      
        db.collection("users").doc(userRecord.uid).set(data).catch((e)=>{
            console.log(e)
           
        })
        res.redirect('/student?dir=student&response=User Added Successfully');


    })
    .catch((error) => {
      console.log('Error creating new user:', error);
     res.redirect('/student?dir=student&response=Error creating new user,Please try again!!')
    });
})

    
})


// Edit files

students.get('/edit',(req,res)=>{
     
    const id = req.query.id;
        console.log(id)
        db.collection("users").doc(id).get()
        .then(docs=>{
            console.log(docs.data())
            var student = {}
            student = docs.data()
            db.collection('course').doc('allCourses').get()
            .then((e)=>{
                  const v = e.data().dept;
                  console.log("Iam eeeee");
                  console.log(v);
           
             
            
             res.render('student/editstudent',{course:v , data:student })
            })
           // res.render('student/editstudent',{data:student})
        })   
    
     })
     
     students.post('/edit',async(req,res)=>{
       
         const name= req.body.name.toLocaleUpperCase();
       
         const reg = req.body.reg.toLocaleUpperCase();
         const uid=req.body.uid;
         const dept =req.body.dept;
         const sec = req.body.sec;
         const year =req.body.year;
         const email = req.body.email;
         const dob =req.body.dob;
         const gender =req.body.gender;
        // console.log("testing all course");
        // console.log(await getAllCourse);
        db.collection('course').doc('allCourses').get()
       .then((e)=>{
            var v =[]
            v = e.data().dept;
         const data={
             department:{
                 id:dept,
                 name:getCName(v,dept),
                 sec:sec,
                 year:year,            
             },
             email:email,
             name:name,
             reg:reg,
             gender:gender,
             dob:dob
         }
        //  console.log("Iam data");
        //  console.log(data);
        if (uid===email) {
            console.log("Yes,Iam in if part");
            fadmin
            .auth()
            .updateUser(uid, {
                email: email,
                emailVerified: false,
                password: reg,
                disabled: false
            })
            .then((userRecord) => {
            
            console.log('Successfully modified user:', userRecord.toJSON());
            
                db.collection("users").doc(uid).set(data);
                    
                
              //  res.redirect('/student#success');
                res.redirect('/student?dir=student&response=Successfully Modified User');
        
        
            })
            .catch((error) => {
            console.log('Error creating new user:', error);
            res.redirect('/student?dir=student&response=Error creating new User ,Try Again!!');
            });
        }
        else{
            //deleting old user
            console.log("Iam in else part")
            fadmin
            .auth()
            .deleteUser(uid)
            .then(() => {
                console.log('Successfully deleted user');
                db.collection("users").doc(uid).delete()   
               // res.redirect('/student#deleted')
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
               // res.redirect('/student#error')
            });
            //creating a new user
            fadmin
            .auth()
            .createUser({
                uid: email,
              email: email,
              emailVerified: false,
              password: reg,
              disabled: false,
            })
            .then((userRecord) => {
              
              console.log('Successfully created new user:', userRecord.uid);
              
                db.collection("users").doc(userRecord.uid).set(data).catch((e)=>{
                    console.log(e)
                   
                })
                res.redirect('/student?dir=student&response=Successfully Modified User');
        
        
            })
            .catch((error) => {
              console.log('Error creating new user:', error);
              res.redirect('/student?dir=student&response=Error creating new User ,Try Again!!')
            });
           // res.redirect('/student#success')




        }
    })
         
     
         
     })
     // for delete 
     students.get('/delete',(req,res)=>{
     
        const uid = req.query.id;
        if(uid == undefined){
            res.redirect('/student?dir=student&response=Invalid Entry')

        }else{
            console.log(uid)
            fadmin
            .auth()
            .deleteUser(uid)
            .then(() => {
                console.log('Successfully deleted user');
                db.collection("users").doc(uid).delete()   
                res.redirect('/student?dir=student&response=User has been successfully deleted')
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
                res.redirect('/student?dir=student&response=Error deleting User ,Try Again!!')
            }); 
        }
        
    })
     


   

module.exports = students

