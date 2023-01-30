import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBaR1eSneE6HhMplYZLPrULikshO9RZDpA",
    authDomain: "trainingpals-d9e65.firebaseapp.com",
    databaseURL: "https://trainingpals-d9e65-default-rtdb.firebaseio.com",
    projectId: "trainingpals-d9e65",
    storageBucket: "trainingpals-d9e65.appspot.com",
    messagingSenderId: "536310690559"
};

firebase.initializeApp(config);

const database = firebase.database();
const storageService = firebase.storage();
const storageRef = storageService.ref();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider, storageRef, storageService, database as default };
