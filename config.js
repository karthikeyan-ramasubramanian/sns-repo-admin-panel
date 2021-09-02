const admin = require("firebase-admin");

const serviceAccount = require("./database.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sns-repo-default-rtdb.firebaseio.com"
});

module.exports = admin