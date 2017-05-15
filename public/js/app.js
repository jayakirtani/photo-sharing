 (function(){

 //firebase configuration 
 const config = {
    apiKey: "AIzaSyBiyoO98d-j8nRV3Bmh1ZAdI-hsLjpif8o",
    authDomain: "photosharing-c37de.firebaseapp.com",
    databaseURL: "https://photosharing-c37de.firebaseio.com",
    projectId: "photosharing-c37de",
    storageBucket: "photosharing-c37de.appspot.com",
    messagingSenderId: "1065700949630"
  };
  firebase.initializeApp(config);

const btnLogin = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');


//login button eventlistner
btnLogin.addEventListener('click', e=>{

    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
 
   const promise = firebase.auth().signInWithPopup(provider);
   promise.then((authData)=>{  
    window.location ="user.html";
   });
   
   promise.catch(e=>console.log(e.message));
});

//logout button eventlistner
btnLogout.addEventListener('click', e=>{
    firebase.auth().signOut();
    window.location ="index.html";
});

//monitor the authentication state chnanges
firebase.auth().onAuthStateChanged(firebaseUser=> { 
          var uid = firebase.auth().currentUser.uid;
          
          if(firebaseUser)
          {
              checkIfUserExists(uid,firebaseUser);
              btnLogin.classList.add('hide');
              btnLogout.classList.remove('hide');  
          }
          else
          {
              console.log("Not logged In");
              btnLogin.classList.remove('hide');
              btnLogout.classList.add('hide');
          }
});

 }());


//if user is not there in database, create a new user on callback
 function userExistsCallback(userId, exists,firebaseUser) {
  if (exists) {
      console.log("user exists");
  } else {
      console.log("user does not exist");
    firebase.database().ref('users/' + userId).set({
    username: firebaseUser.displayName,
    email: firebaseUser.email,
  });
  }
}

//check if user is already there in database
function checkIfUserExists(userId,firebaseUser) {
  var ref = firebase.database().ref("users/"+userId);
ref.once("value")
  .then(function(snapshot) {
    var a = snapshot.exists();  
    userExistsCallback(userId, a,firebaseUser);
  });
}


 