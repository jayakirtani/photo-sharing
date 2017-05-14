 var AUTH =null;
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
btnLogin.addEventListener('click',e=>{

    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
 
   const promise = firebase.auth().signInWithPopup(provider);
   promise.then((authData)=>{
    console.log(authData);
    var database = firebase.database();
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid).set({
    username: authData.user.displayName,
    email: authData.user.email,
  });
    AUTH = firebase.auth();
    window.location ="user.html";
   });
   
   promise.catch(e=>console.log(e.message));
});

//logout button eventlistner
btnLogout.addEventListener('click',e=>{

    firebase.auth().signOut();
    window.location.replace("http://localhost:5000/");
});

//monitor the authentication state chnanges
firebase.auth().onAuthStateChanged(firebaseUser=> { 
          
          if(firebaseUser)
          {
              AUTH = firebaseUser;

              console.log(AUTH);
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


 