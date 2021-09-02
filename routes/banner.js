const express = require('express')
const banner = express.Router()
const fadmin = require('../config')
const db = fadmin.firestore()
const auth = fadmin.auth()


banner.get('/', (req, res) => {
    
    db.collection('banner').get()
    .then(news=>{
        let n=[];

        news.forEach(r=>{
          //  console.log(r.data())
            data = r.data()
            n.push(data)
            
        })
       // console.log(n);
        res.render('banner/addbanner',{banner:n})
    })
    
   // res.send("success");
})
banner.post('/',(req,res)=>{
    const title= req.body.banner;
    const piclink=req.body.imglink;
    const bannerlink=req.body.bannerlink;
    const dis =req.body.description;
    const inputtime =  new Date().toLocaleString();
    const random = Math.floor(Math.random()*10000);
    console.log(random);
    
    console.log(inputtime);
    var data = {
        id: random,
        entrytime: inputtime,
        title: title,
        link: bannerlink,
        img: piclink,
        description: dis
    }
    console.log(data);
   
   var banid = "banner:"+random;
   console.log(banid);
   
    db.collection("banner").doc(banid).set({
        id: random,
        entrytime: inputtime,
        title: title,
        link: bannerlink,
        img: piclink,
        description: dis
        
    })
    .then((docRef) => {
        console.log("Success ");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
   res.redirect('/banner?dir=banner&response=Banner has been successfully added');
//    res.send("success");
})
//Delete banner

banner.get('/delete', (req, res) => {
    
    id = req.query.id;
    console.log(id);
    uid = "banner:"+id;
    if (id===undefined) {
        res.redirect('/banner?dir=banner&response=invalid entry');
    }
    else{
        db.collection("banner").doc(uid).delete()
        res.redirect('/banner?dir=banner&response=Banner has been successfully deleted');
    }
})

module.exports = banner
