import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import image from "react-firebase-file-uploader/lib/utils/image";

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

    deleteElement = (path, elementID) => {
        try {
            this.db.ref(path).child(elementID).remove();
        } catch (error) {
            console.log(error);
        }
    }

    test() {
        console.log("YESSSSSS!!!!!!");
    }

    getImages(organization, userID) {

        var data = [];
        var listRef = app.storage().ref().child('images/'+organization+'/'+userID+'/');

        // Find all the prefixes and items.
        listRef.listAll().then(function(res) {
            res.items.forEach(function(itemRef) {
                // All the items under listRef.
                data.push(itemRef.getDownloadURL());

            });
        }).catch(function(error) {
            console.log("Unable to load image set");
        });
        return data;
    }

    uploadImage(organization, userID, imageBlob) {
        var storageRef = app.storage().ref();
        // File or Blob named mountains.jpg
        var file = imageBlob;
        var metadata = {
            contentType: 'image/jpeg'
        };
        // Upload file and metadata to the object 'images/mountains.jpg'
        let fileName = Date.now()+'.jpeg';
        var uploadTask = storageRef.child('images/'+organization+'/'+userID+'/'+fileName).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(app.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case app.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case app.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function(error) {
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log("Error uploading: unauthorized ");
                        break;
                    case 'storage/canceled':
                        console.log("Error uploading: canceled ");
                        break;
                    case 'storage/unknown':
                        console.log("Error uploading: unknown");
                        break;
                }
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                });
            });
    }

    insertDescriptor = (organization, userID, descriptor) => {
          this.db.ref('organizations/'+organization+'/'+userID+'/descriptors/').push({
              date: Date.now(),
              value: descriptor,
          });

      };

     getDescriptors = (organization, userID) => {
         const path = 'organizations/'+organization+'/'+userID+'/descriptors/';
         return this.getElementsInPath(path);

     };
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

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
}
  export default Firebase;