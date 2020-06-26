var usertype = "";
var portalType = "login";
var currentUser;
var email;
var password;
var code;
var name;
var phone;
var bio;
var pfpurl;
var location2;
var school;

window.onload = logout();

function portalTypeLogin() {
	document.getElementById("usertype").style.display = "none";
	document.getElementById("dif").style.display = "flex";
	document.getElementById("formSub").innerHTML = "Login";
	portalType = "login";
	turnDown();
}
function portalTypeSignUp() {
	document.getElementById("usertype").style.display = "block";
	document.getElementById("dif").style.display = "none";
	document.getElementById("formSub").innerHTML = "SignUp";
	portalType = "signUp";
}
function principal(){
	usertype = "principal";
	document.getElementById("dif").style.display = "flex";
	turnUp();
}
function student() {
	usertype = "student";
	document.getElementById("dif").style.display = "flex";
	turnUp();
}

function submit() {
	console.log(usertype + " " + portalType);
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	schoolCode = document.getElementById("schoolCode").value;
	name = document.getElementById("name").value;
	phone = document.getElementById("phone").value;
	bio = document.getElementById("bio").value;
	pfpurl = document.getElementById("pfpurl").value;
	location2 = document.getElementById("location").value;
	school = document.getElementById("school").value;

	if (portalType == "login") {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			document.getElementById("errorMessage").innerHTML = errorMessage;
			// ...
		});
	}
	else {
		var isValid = false;
		var obj = document.getElementById("schoolCode").value;
		console.log(obj);
		console.log(firebase.database().ref('SchoolCodes'));

		firebase.database().ref('SchoolCodes/' + obj).once("value", (data) => {
			var arter = data.val();
			if (arter != undefined) {
				signUp(email, password);
				console.log("MINE");
				code = obj;
			}
			else {

				document.getElementById("errorMessage").innerHTML = "Invalid School Code";
			}
		});
	}
}

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log(user);
		document.getElementById("loading").style.display = "flex";
		currentUser = user;
		if (portalType == "signUp")
		{
			addUser();
			if (usertype == "student") {
				setTimeout(relocateDash, 2000);
			}
			else if (usertype == "principal") {
				setTimeout(relocateAdd, 2000);
			}
		}
		else if (portalType == "login") {
			firebase.database().ref('/Users/').once('value').then(function (snapshot) {
				var keys2 = Object.keys(snapshot.val());
				var usertype = "";
				for (var j = 0; j < keys2.length; j++) {
					var q = snapshot.val();
					if (keys2[j] == user.uid) {
						console.log(q[keys2[j]].email);
						usertype = (q[keys2[j]].usertype);

						if (usertype == "student") {
							relocateDash();
						}
						else if (usertype == "principal") {
							relocateAdd();
						}
						else if (usertype == "admin") {
							relocateVer();
						}

						break;
					}
				}

			});
		}
	}
	else {

	}
});

function addUser() {
	if (usertype == "student") {
		console.log("MyMAN");
		console.log(currentUser.uid);
		var postKey = currentUser.uid;
		var updates = {};
		var postData =
		{
			email: email,
			password: password,
			usertype: usertype,
			schoolCode: code,
			name: name,
			bio: bio,
			language: "English",
			locationID: location2,
			phone: phone,
			school: school,
			pfpUrl: pfpurl
		}

		updates['/Users/' + postKey] = postData;
		firebase.database().ref().update(updates);
	}
	else {
		console.log("MyMAN");
		console.log(currentUser.uid);
		var postKey = currentUser.uid;
		var progress = 0;
		var updates = {};
		var postData =
		{
			email: email,
			password: password,
			usertype: usertype,
			schoolCode: code,
			name: name,
			bio: bio,
			language: "English",
			locationID: location2,
			phone: phone,
			school: school,
			pfpUrl: pfpurl
		}

		updates['/Users/' + postKey] = postData;
		firebase.database().ref().update(updates);
	}
}

function relocateDash() {
	window.location.replace("dashboard.html");
}

function relocateAdd() {
	window.location.replace("add_school.html");
}

function relocateVer() {
	window.location.replace("admin_verify.html");
}
function logout() {
	firebase.auth().signOut().then(function () {
		// Sign-out successful.
	}).catch(function (error) {
		// An error happened.
	});
}
function signUp(email, password) {
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		document.getElementById("errorMessage").innerHTML = errorMessage;
		// ...
	});
}

function turnUp()
{
	var turn = document.getElementsByClassName("turn");
	for(var i = 0; i < turn.length; i++)turn[i].style.display = "flex";
}

function turnDown()
{
	var turn = document.getElementsByClassName("turn");
	for(var i = 0; i < turn.length; i++)turn[i].style.display = "none";
}