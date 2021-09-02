const express = require('express')
const notes = express.Router()
const getSubCode = require('./getSubCode')
const fadmin = require('../config')
const db = fadmin.firestore()
const auth = fadmin.auth()






notes.get('/', async (req, res) => {
    var data = [], da = [];
    db.collection('subjects').get()
        .then(async (courses) => {

            courses.forEach((course) => {
                data.push(course.data())
            })

            data.forEach((e) => {
                for (let x in e) {
                    for (let y in e[x]) {
                        e[x][y].forEach((f) => {
                            da.push(f.id)
                        })
                    }
                }
            })
        })
       
    
    var table = { data: [], id: [] }
    db.collection('Pdf').get()
        .then((e) => {
            var c = [];
            var i = [];
            e.forEach((f) => {

                c.push(f.data())
                i.push(f.id)
            })

            table['data'].push(c)
            var unique = Array.from(new Set(i))
            table['id'].push(unique)

            res.render('notes/addnotes', { data: da, d: table })
        })

})

function getPdf(subcode) {
    return new Promise((res, rej) => {

        db.collection('Pdf').doc(subcode).get()
            .then((d) => {
                if (d.exists) {
                    if (d.data()['chapters'] == undefined) {
                        var v = { chapters: [] };
                        res(v['chapters'])
                    } else {

                        res(d.data()['chapters'])
                    }
                } else {
                    var v = { chapters: [] };
                    res(v['chapters'])
                }

            })
            .catch((err) => { rej("I'm Rejected") })

    })
}

function setPdf(code, chap) {
    db.collection('Pdf').doc(code).set(chap)
}


notes.post('/', async (req, res) => {

    const subname = req.body.notessub;
    const title = req.body.titlenotes;
    const link = req.body.linknotes;
    const description = req.body.description;
    //console.log(subname+" "+title+" "+link+" "+description);
    var c = await getPdf(subname)
    console.log(c)
    var chapters = {
        id: subname + "(" + Math.floor(Math.random() * 10000) + ")",
        sub: subname,
        description: description,
        link: link,
        title: title
    }
    console.log(chapters)
    c.push(chapters)
    // console.log(c)
    const datanote = { chapters: c }
    // console.log(datanote)
    setPdf(subname, datanote)


    res.redirect('/notes?dir=notes&response=Notes added successfully');

})
//edit notes
notes.get('/edit', async (req, res) => {
    var data = [], da = [];
    db.collection('subjects').get()
        .then(async (courses) => {

            courses.forEach((course) => {
                data.push(course.data())
            })

            data.forEach((e) => {
                for (let x in e) {
                    for (let y in e[x]) {
                        e[x][y].forEach((f) => {
                            da.push(f.id)
                        })
                    }
                }
            })
        })
   

    var edit = [];
    const id = req.query.id;
    const sub = req.query.sub;
    console.log(id + sub);
    if (id == undefined & sub == undefined) {
        res.redirect('/notes?dir=notes&response=Invalid Entry');
    } else {
        db.collection("Pdf").doc(sub).get()
            .then(v => {
                console.log("here")
                console.log(v.data().chapters);
                edit = v.data().chapters[0];
                console.log("answer");
                console.log(edit);
                
            })
            setTimeout(function(){
                console.log("Iam in js");
                
                res.render('notes/editnotes', { data: da, d: edit })
              }, 3000);
            


       
    }



})
// edit posting in notes

notes.post('/edit', async (req, res) => {

    const subname = req.body.notessub;
    const title = req.body.titlenotes;
    const link = req.body.linknotes;
    const description = req.body.description;
    const id = req.body.chapterid;
    const oldsubname = req.body.oldsub;
    //console.log(subname+" "+title+" "+link+" "+description);
    if (oldsubname==subname) {
        var datasub = {
            id: id,
            sub: subname,
            description: description,
            link: link,
            title: title
        }
        //console.log(chapters)
        db.collection('Pdf').doc(subname).get()
        .then(o => {

            console.log(o.data());
            console.log(o.data().chapters);
            const data = o.data().chapters;
            const chapters = data.filter(e => {
                if (e.id != id) {
                    return true
                } else {
                    console.log("nononononoo");
                }
            })
            console.log("Iam here");
            console.log(chapters);
            db.collection('Pdf').doc(subname).update({ chapters });
            setTimeout(async function(){
                console.log("Iam in settimeout");
                var c = await getPdf(subname)
                console.log(c);
                console.log("Iam your c");
            
                console.log("Iam data");
                console.log(datasub);
                c.push(datasub)
                const datanote = { chapters: c }
                // console.log(datanote)
                setPdf(subname, datanote)
                res.redirect('/notes?dir=notes&response=Successfully Changed');

              }, 2000);
            
            
        })
    
    }else {
        var datasub = {
            id: subname + "(" + Math.floor(Math.random() * 10000) + ")",
            sub: subname,
            description: description,
            link: link,
            title: title
        }
        //console.log(chapters)
        db.collection('Pdf').doc(oldsubname).get()
        .then(o => {

            console.log(o.data());
            console.log(o.data().chapters);
            const data = o.data().chapters;
            const chapters = data.filter(e => {
                if (e.id != id) {
                    return true
                } else {
                    console.log("no in elase");
                }
            })
            console.log("Iam here");
            console.log(chapters);
            db.collection('Pdf').doc(oldsubname).update({ chapters });
            setTimeout(async function(){
                console.log("Iam in settimeout in else");
                var c = await getPdf(subname)
                console.log(c);
                console.log("Iam your c in else");
            
                console.log("Iam data");
                console.log(datasub);
                c.push(datasub)
                const datanote = { chapters: c }
                // console.log(datanote)
                setPdf(subname, datanote)
                res.redirect('/notes?dir=notes&response=Successfully Changed');

              }, 2000);
    })
      //  res.redirect(req.get('referer'));
}
})





//delete notes
notes.get('/delete', async (req, res) => {
    const sub = req.query.sub;
    const id = req.query.id;
    var chapters = [];
    console.log(id + " " + sub);
    if (id == undefined || sub == undefined) {
        res.redirect("/notes");

    } else {
        db.collection("Pdf").doc(sub).get()
            .then(note => {

                console.log(note.data());
                console.log(note.data().chapters);
                const data = note.data().chapters;
                const chapters = data.filter(e => {
                    if (e.id != id) {
                        return true
                    } else {
                        console.log("nononononoo");
                    }
                })
                console.log("Iam here");
                console.log(chapters);
                db.collection('Pdf').doc(sub).update({ chapters });
                res.redirect('/notes?dir=notes&response=Successfully Deleted');
            })
        // res.redirect('/notes#databaseerror');

    }


})


module.exports = notes


