const express = require('express')
const loginRoute = require('./routes/login')
const subjectsRoute = require('./routes/subjects')
const notesRoute = require('./routes/notes')
const eventsRoute = require('./routes/events')
const bannerRoute = require('./routes/banner')
const departmentRoute = require('./routes/department')
const studentRoute = require('./routes/student')
const userRoute = require('./routes/users')
const getSubCode = require('./routes/getSubCode')
const path = require('path')
const app = express()
const jwt = require('jsonwebtoken')
require("dotenv").config();
const verify = require('./middleware/auth')
const cookieParser = require('cookie-parser')

//cookiepareser
app.use(cookieParser())

//urlencoder
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Firebase Database
const fAdmin = require('./config.js')
const e = require('express')
const db = fAdmin.firestore()

//Public Path
app.use(express.static(__dirname + '/public'))
app.use('/student', express.static(__dirname + '/public'));
app.use('/subjects', express.static(__dirname + '/public'));
app.use('/notes', express.static(__dirname + '/public'));
// View Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

//Routes
app.use('/users', verify, userRoute)
app.use('/student', verify, studentRoute)
app.use('/events', verify, eventsRoute)
app.use('/notes', verify, notesRoute)
app.use('/subjects', verify, subjectsRoute)
app.use('/login', loginRoute)
app.use('/banner', verify, bannerRoute)
app.use('/department', verify, departmentRoute)
// app.use('/book',bookRoute)


app.get('/', verify, (req, res) => {

  var data = {
    student: 0,
    department: 0,
    subjects: 0,
    notes: 0,
    events: 0,
    banner: 0,
    admin: 0

  }
  console.log("Iam data");
  console.log(data);
  //student
  db.collection('users').get()
    .then((u) => {

      u.forEach((e) => {
        data.student++;
      })
      console.log("Iam user");
      console.log(data);

    })
  //admin
  db.collection('admin').get()
    .then(e => {
      e.forEach(a => {
        data.admin++;
      });
      console.log("Iam admin");
      console.log(data);
    })

  //banner
  db.collection('banner').get()
    .then(e => {
      e.forEach(f => {
        data.banner++;
      })
      console.log("Iam banner");
      console.log(data);
    })

  //news
  db.collection('news').get()
    .then(e => {
      e.forEach(f => {
        data.events++;
      })
      console.log("Iam news");
      console.log(data);
    })
  //department
  db.collection('course').doc('allCourses').get()
    .then(c => {
      var course = [];
      course = c.data().dept;
      data.department = course.length;
      console.log("Iam department");
      console.log(data);

    })

  //Pdf
  db.collection('Pdf').get()
    .then(e => {

      e.forEach(f => {
        var h = f.data()
        data.notes += h['chapters'].length;

      })
      console.log("Iam Pdf");
      console.log(data);
    })

  //subject
  db.collection('subjects').get()
    .then(e => {
      console.log("Iam subjects");
      
      var total = 0;
      e.forEach(f => {
        var h = f.data()
        console.log("Iam inside foreach");

        

       
          var i =1;
          while(i<=4){
            console.log("Iam inside while");
            if(h[i.toString()]==undefined){
                total+=0;
                console.log("Iam inside if");
            }else{
              total += h[i.toString()].Sub.length;
              console.log("Iam inside else");
            }
           i++;
          }
          data.subjects=total;
      })
      console.log("Please vathuruuuu");

      console.log(data);
     
    })
   setTimeout(() => {
    res.render('index',{d:data});
   }, 5000);
})







app.listen(process.env.PORT || 3000)


