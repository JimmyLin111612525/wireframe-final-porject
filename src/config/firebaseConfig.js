import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig={
    apiKey: "AIzaSyC-4q76Qqn4sXtmZBS5zZdQ3gDNzZS_Yf8",
    authDomain: "wireframe-rrf316.firebaseapp.com",
    databaseURL: "https://wireframe-rrf316.firebaseio.com",
    projectId: "wireframe-rrf316",
    storageBucket: "wireframe-rrf316.appspot.com",
    messagingSenderId: "592803985275",
    appId: "1:592803985275:web:8527b21da867e7b74cafde",
    measurementId: "G-JR2SWQQWY6"
};
firebase.initializeApp(firebaseConfig);

export default firebase;