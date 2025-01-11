const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://test-task-4e609.firebaseio.com',
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
