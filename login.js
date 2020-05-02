var selectedFile;
var globalUser;

function login()
{
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});
}

function signUp()
{
	var email = document.getElementById("email_2").value;
	var password = document.getElementById("password_2").value;
	
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ...
	});
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
	globalUser = user;
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
	
	// flip ui
	document.getElementById("holder").style.display = "none";
	document.getElementById("loggedUI").style.display = "flex";
	
	//change flex direction
	
	
  } else {
    // User is signed out.
    // ...
	
	// flip ui
	document.getElementById("holder").style.display = "flex";
	document.getElementById("loggedUI").style.display = "none";
  }
});

function logout()
{
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}

$("#loggedImage").on("change", function(event){
	selectedFile = event.target.files[0];
});


function articleSubmit()
{	
	var imageName = selectedFile.name;
	var storageRef = firebase.storage().ref('/images/' + imageName);
	var uploadTask = storageRef.put(selectedFile);
	
	uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) 
	{
		
	},function(error) 
	{

	},function() 
	{
		var postKey = firebase.database().ref('Articles/').push().key;
		var downloadURL = uploadTask.snapshot.downloadURL;
		var updates = {};
		var postData = 
		{
			url:downloadURL,
			title: $("#loggedFormTitle").val(),
			passage: $("#loggedFormPassage").val(),
			user: globalUser.uid
		}
		document.getElementById("loggedFormTitle").value = "";
		document.getElementById("loggedFormPassage").value = "";
		
		updates['/Articles/' + postKey] = postData;
		firebase.database().ref().update(updates);
	});
}

function post()
{
	var postKey = firebase.database().ref('Posts/').push().key;
	var updates = {};
	var postData = 
	{
		passage: $("#loggedFormPassage").val(),
		user: globalUser.uid,
		postKey: postKey
	}
	document.getElementById("loggedFormPassage").value = "";
	updates['/Posts/' + postKey] = postData;
	firebase.database().ref().update(updates);
}
