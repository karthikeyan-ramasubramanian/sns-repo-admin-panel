const fadmin = require('../config')
const db = fadmin.firestore()
const auth = fadmin.auth()


var getAllCourse = new Promise((res,rej)=>{

    db.collection('course').doc('allCourses').get()
    .then((d)=>{
            if(d.exists){
              //  console.log(d.data());
               const v = d.data().dept;
                console.log(v)
             res(v)
            }else{
                const v =[]
                res(v)
            }
           

    })
}); 
module.exports = getAllCourse