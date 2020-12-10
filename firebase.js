var firebaseConfig = {
    apiKey: "AIzaSyAw7eDuHSEhoLvw1ZfNrFD28php7GoCpe4",
    authDomain: "pos-coderax-eeb41.firebaseapp.com",
    databaseURL: "https://pos-coderax-eeb41.firebaseio.com",
    projectId: "pos-coderax-eeb41",
    storageBucket: "pos-coderax-eeb41.appspot.com",
    messagingSenderId: "87507438222",
    appId: "1:87507438222:web:ac5843732a9512d27f97df",
    measurementId: "G-N7QNQPB15Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

module.exports.firebaseConfig = firebaseConfig;