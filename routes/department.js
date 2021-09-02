const express = require('express')
const department = express.Router()
const fadmin = require('../config')
const  getAllCourse =  require('./getCourse')
const db = fadmin.firestore()
const auth = fadmin.auth()

department.get('/',async (req, res) => {
   

    
    db.collection('course').doc('allCourses').get()
    .then((d)=>{
            if(d.exists){
                console.log("Iam data");
                console.log(d.data());
               if (d.data().dept===undefined) {
                console.log("Iam  here");
                var v=[]
                res.render('department/adddepartment',{department:v})
               }else{
                console.log("Iam else here");
               var v = d.data().dept;
                  
               console.log(v);
               
                res.render('department/adddepartment',{department:v})
              
              // console.log(v)
               }  
            }else{
                console.log("Iam not here");
                var v=[]
                res.render('department/adddepartment',{department:v})
                
            }
           

    })
   
})
department.post('/',async (req,res)=>{
  
    const name= req.body.deptname;
    const id=req.body.deptcode.toLocaleUpperCase();
    db.collection('course').doc('allCourses').get()
    .then(e=>{
        const data = e.data().dept;
        var count = 0;
        const dept = data.filter(e=>{
                if(e.id == id){
                    count++;
                    return true
                }
        })
        console.log("This is count");
        console.log(count);
        if (count==1) {
            res.redirect('/department?dir=department&response=department already exist')
        } else {
            db.collection('course').doc('allCourses').get()
            .then((b)=>{
                console.log("Iam herererer");       
                console.log(b.data());
                    if(b.data()!=undefined){
                        console.log("Iam nott herererer");
                        
                        var d = []
                        var d = b.data().dept;
                        
                        var dept={
                            id: id,
                            name: name
                        }
                        d.push(dept)
                        
                        const adddept={dept:d}
                        db.collection('course').doc('allCourses').set(adddept)
                        res.redirect("/department?dir=department&response=successfully added");
                        
                        
                        // console.log(v)
                            
                    }else{
                        console.log("Iam not in post here");
                        var d = []
                        var dept={
                            id: id,
                            name: name
                        }
                        
                    
                        d.push(dept)
                        
                        const adddept={dept:d}
                        db.collection('course').doc('allCourses').set(adddept)
                        res.redirect("/department?dir=department&response=successfully added");
                        
                        
                        
                    }
                    

            })
            
        }
    })


   // console.log("=="+name+"=="+id);
   
    
  
})


department.get('/delete',(req,res)=>{
   
    const id = req.query.id;
    console.log(id);
    if (id === undefined) {
        res.redirect('/department#unknowncommand');
    } else {
        db.collection('course').doc('allCourses').get()
        .then(e=>{
            const data = e.data().dept;
            
            const dept = data.filter(e=>{
                    if(e.id != id){
                        return true
                    }
            })

            console.log("====Answer======")

            console.log(dept);
            db.collection('course').doc('allCourses').update({dept});
            res.redirect("/department?dir=department&response=successfully deleted");





        })
        
    }
   
    
/*





*/



})


module.exports = department
