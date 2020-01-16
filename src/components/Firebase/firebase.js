import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyCz5H3RlwJowAPSAXi9Lvcc2oyPmLBeuIg",
    authDomain: "cis4914-40936.firebaseapp.com",
    databaseURL: "https://cis4914-40936.firebaseio.com",
    projectId: "cis4914-40936",
    storageBucket: "cis4914-40936.appspot.com",
    messagingSenderId: "178831665685",
    appId: "1:178831665685:web:3ba1a1b03cdd45c57afc1c",
    measurementId: "G-FYCFPK2QDN"
  };

  class Firebase{
    //Comment
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }

    //Auth

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    doSignOut = () => this.auth.signOut();
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);
    doDeleteUser = () => {
        var user = this.auth.currentUser;
        console.log(user);
        this.auth.signOut();

        user.delete().then(function() {
            console.log("User deleted.");
        }).catch(function(error) {
            console.log("Error deleting user.")
        });
    };

    //Data

    deleteElement = (path, elementID) => {
        try {
            this.db.ref(path).child(elementID).remove();
        } catch (error) {
            console.log(error);
        }
    }

    insertRequest = (description, file, name, userID) => {
        this.db.ref('requests').push({
            description: description,
            file: file,
            name: name,
            userID: userID
        });
    }

    deleteRequest = (requestID) => {
        this.deleteElement('requests', requestID);
    }

    deleteFile = (fileID) => {
        this.deleteElement('files', fileID);
    }

    insertNewsLetters = (content, date, linked_video, title) => {
        this.db.ref('newsletters').push({
            content: content,
            date: date,
            linked_video: linked_video,
            title: title
        });
    }

    deleteNewsLetters = (title, date) => {
        var newsletterID = '';
        var ref = this.db.ref('newsletters');
        ref.on('value', function (snapshot){
            snapshot.forEach(function (childSnapshot){
                if(childSnapshot.val().title === title && childSnapshot.val().date === date){
                    newsletterID = childSnapshot.key
                }
            });
        });
        this.deleteElement('newsletters', newsletterID)
    }

    getElementsByUserID = (path, userID) => {
        var data = [];
        var ref = this.db.ref(path);
        ref.on('value',function (snapshot) {
            snapshot.forEach(function (childSnapshot){
                if(childSnapshot.val().userID === userID) {
                    data.push({
                        uid:childSnapshot.key,
                        value:childSnapshot.val()
                    });
                }
            });
        });
        return data;
    }

    getElementsInPath = (path) => {
        var data = [];
        var ref = this.db.ref(path);
        ref.on('value',function (snapshot) {
            snapshot.forEach(function (childSnapshot){
                data.push({
                    uid:childSnapshot.key,
                    value:childSnapshot.val()
                });
            });
        });
        return data;
    }

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
}
  export default Firebase;