const express = require('express')
const events = express.Router()
const fadmin = require('../config')
const db = fadmin.firestore()
const auth = fadmin.auth()

// events.get('/', (req, res) => {
//     res.render('events/addevents')
// })

events.get('/', (req, res) => {
    
    db.collection('news').get()
    .then(news=>{
        let n=[];

        news.forEach(r=>{
          //  console.log(r.data())
            data = r.data()
            n.push(data)
            
        })
       // console.log(n);
        res.render('events/addevents',{events:n})
    })
    
   // res.send("success");
})
events.post('/',(req,res)=>{
    const title= req.body.event;
    const link=req.body.imglink;
    const dis =req.body.description;
    const inputtime =  new Date().toLocaleString();
    const random = Math.floor(Math.random()*10000);
    console.log(title+"hellooo "+link+" heyy"+dis);
    var banid = "event:"+random;
    console.log(banid);
    db.collection("news").doc(banid).set({
        id: random,
        entrytime: inputtime,
        title: title,
        link: link,
        dis: dis
    })
    
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    res.redirect('/events?dir=events&response=Event has been successfully added');
})

//delete
events.get('/delete', (req, res) => {
    var id = undefined;
    id = req.query.id;
    console.log(id);
    userid = "event:"+id;
    console.log(userid);
    if (id===undefined) {
        res.redirect('/events');
    }
    else{
        db.collection("news").doc(userid).delete();
        res.redirect('/events?dir=events&response=Event has been successfully deleted');
    }
    
    
//    res.send("success");
})



module.exports = events
