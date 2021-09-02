const express = require('express')
const subjects = express.Router()
const fadmin = require('../config')
const getAllCourse = require('./getCourse')

const db = fadmin.firestore()
const auth = fadmin.auth()


const value = []


subjects.get('/', (req, res) => {
  var data, c, id = [];
  var d = [];
  db.collection('subjects').get()
    .then(async (courses) => {

      courses.forEach((course) => {
        id.push(course.id)
        d.push(course.data())
      })
      db.collection('course').doc('allCourses').get()
        .then((e) => {
          if (e.exists) {
            //  console.log(d.data());

            const v = e.data().dept;
           

            c = v;

            data = [c, id, d]

            res.render("subjects/addsubject", { sub: data });

          } else {
            c = []

            // console.log("Iam else ccccc");
            // console.log(c);
            data = [c, id, d]
            res.render("subjects/addsubject", { sub: data });
          }


        })

      //return data;
    })


  //res.send("Success")
})


function getSub(subcode, year) {
  return new Promise((res, rej) => {
    
    db.collection('subjects').doc(subcode).get()
      .then((d) => {
        // console.log("Iam year"+year);
        // console.log(d.data());
        // console.log("Iam in out");
        // // console.log(d.data()['1']['Sub']);
        // console.log("Iam in dataobj");
       // console.log(d.data()[year]['Sub']); 
       
        //  console.log(dataobj);
        if (d.exists) {
          console.log("Iam in d.exists");
          const wholedata = d.data();
          console.log(wholedata);
          const dataobj = wholedata[year];
          
          if (dataobj == undefined) {
            console.log("Iam in if");
            console.log(d.data());

            var v = d.data()

            v[year] = { Sub: [] }


            res(v)

          } else {
            console.log("Iam in elseee");
            console.log(d.data());

            res(d.data())
          }
        } else {
          var v = {}
          v[year] = { Sub: [] };

          res(v)
        }

      })
      .catch((err) => { rej("I'm Rejected") })

  })
}
function setSub(code, chap) {
  db.collection('subjects').doc(code).set(chap)
}

subjects.post('/', async (req, res) => {
  const dept = req.body.dept;
  const year = req.body.year;
  const link = req.body.iconlink;
  const sub_name = req.body.subname.toLocaleUpperCase();
  const subcode = req.body.subcode.toLocaleUpperCase();

  

  var Sub = {}
  Sub = await getSub(dept, year);
  console.log(Sub);
  var nValue = {
    Title: sub_name,
    Img: link,
    id: subcode,
    sub: dept,
    year: year
  }



  Sub[year]['Sub'].push(nValue)

  setSub(dept, Sub)

  res.redirect('/subjects?dir=subjects&response=Subject Added Successfully');

})



subjects.get('/edit', (req, res) => {
  const uid = req.query.id;
  const sub = req.query.sub;
  const year = req.query.year;
  if (uid == undefined & sub == undefined & year == undefined) {

    res.redirect('/subjects');
  } else {
    //console.log("Iam in if");

    db.collection("subjects").doc(sub).get()
      .then(async z => {
        if (z.exists) {
        //  console.log("==========Here Balaji=====")
        //  console.log(z.data());
          var result = z.data()[year].Sub
          result = result.filter(v => {
            if (v.id == uid) { return true }
          })
          db.collection('course').doc('allCourses').get()
            .then((e) => {
              if (e.exists) {
                //  console.log(d.data());

                const v = e.data().dept;
               // console.log("Iam Karthikkeekd")

                c = v;

                // res.send(c)

                res.render('subjects/editsubject', { data: result[0], sub: c })

              } else {
                c = []



                res.render("subjects/addsubject", { sub: data });
              }


            })


        } else {
          res.redirect('/subjects');
        }
      })
  }

  
})




// edit post 
subjects.post('/edit', (req, res) => {
  console.log("iam body");

  console.log(req.body);
  
  var year = req.body.year;
  year = year.trim()
  console.log(year);
  const link = req.body.iconlink;
  const sub_name = req.body.subname.toLocaleUpperCase();
  const subcode = req.body.subcode.toLocaleUpperCase();
  const oldsubcode = req.body.oldsubcode;
  const oldyear = req.body.oldyear;
  const olddept = req.body.olddept;
 



  console.log("iam in mainjs");

  db.collection('subjects').doc(olddept).get()
    .then(async(e) => {
    
      var value = e.data()
    
      //console.log(e.data()[year].Sub);
      const data = e.data()[oldyear].Sub;
      var id = oldsubcode;


      const dept = data.filter(d => {
        if (d.id != id) {
          return true
        }
      })

      
      value[oldyear] = { Sub: dept }
      
      console.log(value);
      setSub(olddept,value);

      console.log("Successfully deleted the requested one");
      const depth = req.body.dept;
      var Subject = {}
      var Subject = await getSub(depth, year);
      console.log(Subject);
      var nValue = {
        Title: sub_name,
        Img: link,
        id: subcode,
        sub: depth,
        year: year
      }
      Subject[year]['Sub'].push(nValue)

      setSub(depth, Subject)

      res.redirect('/subjects?dir=subjects&response=Subject Edited Successfully');
    })
  // db.collection('subjects').doc(olddept).get()
})


subjects.get('/delete', (req, res) => {

  const id = req.query.id;
  const sub = req.query.sub;
  const year = req.query.year;
  year.trim()
  
  console.log(req.query);
  if (id == undefined & sub == undefined & year == undefined) {
    res.redirect('/subjects#errorcodeinurl');
  } else {
    console.log("iam in else");
    db.collection('subjects').doc(sub).get()
      .then(e => {
        //  var value ={};
        var value = e.data()
        console.log("Iam value");
        console.log(value);


        console.log(e.data()[year].Sub);
        const data = e.data()[year].Sub;

        const dept = data.filter(d => {
          if (d.id != id) {
            return true
          }
        })


        value[year] = { Sub: dept }
        console.log(value);
        setSub(sub, value);
        res.redirect('/subjects?dir=subjects&response=Subject Deleted Successfully');
      })
  }


})

module.exports = subjects