const fadmin = require('../config')
const db = fadmin.firestore()
const auth = fadmin.auth()

const getSubCode= new Promise((res,rej)=>{
    var data=[], d=[];
    db.collection('subjects').get()
    .then(async(courses)=>{
           courses.forEach((course)=>{
               data.push(course.data())
           })
        
    // console.log(data)
     data.forEach((e)=>{
         for(let x in e){
            for(let y in e[x]){
            e[x][y].forEach((f)=>{
                d.push(f.id)
            })        
            }
         }
     })
     res(d)
     console.log(d);
    })
})

module.exports = getSubCode