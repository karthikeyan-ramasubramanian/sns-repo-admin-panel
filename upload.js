const admin = require('firebase-admin');

const serviceAccount = require('database.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://sns-repo.appspot.com/subject-image'
});

const bucket = admin.storage().bucket();

