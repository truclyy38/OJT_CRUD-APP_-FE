import firebase from "firebase";

/**
 * firebaseConfig

 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */
const firebaseConfig = {
    apiKey: "AIzaSyDNpz1F98QWYj5Br7tE77HrW173KTHSjYY",
    authDomain: "userinformation-f665a.firebaseapp.com",
    projectId: "userinformation-f665a",
    storageBucket: "userinformation-f665a.appspot.com",
    messagingSenderId: "771547735478",
    appId: "1:771547735478:web:71bc2292930781fd850d17",
    measurementId: "G-4DRPDGSX21"
  };

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage();

export {storage, firebase as default };
