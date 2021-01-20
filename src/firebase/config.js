import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyDIOr4B20NecGJxgA7eyA1grGHepIGwleA",
    authDomain: "firegram-f29f4.firebaseapp.com",
    projectId: "firegram-f29f4",
    storageBucket: "firegram-f29f4.appspot.com",
    messagingSenderId: "498322089942",
    appId: "1:498322089942:web:b5283e498d83067d6ea677"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();

// create timestamp
const timeStamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectStorage, projectFirestore, timeStamp };