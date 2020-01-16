import app from 'firebase/app';
import 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCz5H3RlwJowAPSAXi9Lvcc2oyPmLBeuIg",
    authDomain: "cis4914-40936.firebaseapp.com",
    databaseURL: "https://cis4914-40936.firebaseio.com",
    projectId: "cis4914-40936",
    storageBucket: "cis4914-40936.appspot.com",
    messagingSenderId: "178831665685",
    appId: "1:178831665685:web:3ba1a1b03cdd45c57afc1c",
    measurementId: "G-FYCFPK2QDN"
  };

  class Firebase {
    constructor() {
      app.initializeApp(firebaseConfig);
      this.auth = app.auth();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    
    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
  }
  export default Firebase;