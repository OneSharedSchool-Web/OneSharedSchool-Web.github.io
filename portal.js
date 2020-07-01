const { parse } = require("path");

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
	document.getElementById("formSub").innerHTML = "Sign Up!";
	portalType = "signUp";
}
function principal(){
	usertype = "principal";
	document.getElementById("dif").style.display = "flex";
	document.getElementById("schoolCode").hidden = true;
	document.getElementById("schoolLabel").hidden = true;
	// document.getElementById("school").hidden = true;
	// document.getElementById("location").hidden = true;

	turnUp();
}
function student() {
	usertype = "student";
	document.getElementById("dif").style.display = "flex";
	document.getElementById("schoolCode").hidden = false;
	document.getElementById("schoolLabel").hidden = false;
	turnUp();
}
function telephoneCheck(str) {
	var a = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(str);
	return a
}
function isValidHttpUrl(string) {
	let url;
  
	try {
	  url = new URL(string);
	} catch (_) {
	  return false;  
	}
  
	return url.protocol === "http:" || url.protocol === "https:";
  }
function submit() {
	// console.log(usertype + " " + portalType);
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	schoolCode = document.getElementById("schoolCode").value;
	name = document.getElementById("name").value;
	phone = document.getElementById("phone").value;
	bio = document.getElementById("bio").value;
	pfpurl = document.getElementById("pfpurl").value;
	school = "-1";
	location2 = "-1";
	// location2 = document.getElementById("location").value;
	// school = document.getElementById("school").value;


	if (portalType == "login") {
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
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

		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			document.getElementById("errorMessage").innerHTML = errorMessage;
			alert("Error while logging in!")
			// ...
		});
	}
	else {
		if(!telephoneCheck(phone)){
			alert("Phone number not formatted properly! Hover over the box for an example.")
			return;
		}
		if(!isValidHttpUrl(pfpurl)){
			alert("URL must contain a http or https at the beginning.")
			return;
		}
		if(usertype=="student"){
			var isValid = false;
			var obj = document.getElementById("schoolCode").value;
			code = document.getElementById("schoolCode").value;
			console.log(obj);
			console.log(firebase.database().ref('SchoolCodes'));

			firebase.database().ref('SchoolCodes/' + obj).once("value", (data) => {
				var arter = data.val();
				if (arter != undefined) {
					school = "" + arter
					console.log("SCHOOLID" + school)
					firebase.database().ref('Schools/' + school + '/location').once("value", (data) => {
						var latLong = data.val();
						var result = geocodeLatLng(latLong);
						
						
					});

					// signUp(email, password);
					// console.log("MINE");
					// code = obj;
				}
				else {

					document.getElementById("errorMessage").innerHTML = "Invalid School Code";
				}
			});
		} else{
			signUp(email, password);
		}
	}
}

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log(user);
		document.getElementById("loading").style.display = "flex";
		currentUser = user;
		if (portalType == "signUp")
		{
			addUser()
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
			usertype: usertype,
			name: name,
			bio: bio,
			language: "English",
			location: location2,
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
			usertype: usertype,
			name: name,
			bio: bio,
			language: "English",
			location: "-1",
			phone: phone,
			school: "-1",
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
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
		if (user) {
			console.log(user);
			document.getElementById("loading").style.display = "flex";
			currentUser = user;
			if (portalType == "signUp")
			{
				addUser()
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
	}).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		document.getElementById("errorMessage").innerHTML = errorMessage;
		alert("Error while signing up!")
		// ...
	});
}

function turnUp()
{
	var turn = document.getElementsByClassName("turn");
	for(var i = 0; i < turn.length; i++)turn[i].style.display = "flex";

	document.getElementById("nameLabel").hidden = false;
	document.getElementById("phoneLabel").hidden = false;
	document.getElementById("pfpurlLabel").hidden = false;
	document.getElementById("bioLabel").hidden = false;
}

function turnDown()
{
	var turn = document.getElementsByClassName("turn");
	for(var i = 0; i < turn.length; i++)turn[i].style.display = "none";

	document.getElementById("schoolLabel").hidden = true;
	document.getElementById("nameLabel").hidden = true;
	document.getElementById("phoneLabel").hidden = true;
	document.getElementById("pfpurlLabel").hidden = true;
	document.getElementById("bioLabel").hidden = true;


}


  function geocodeLatLng(input) {
	var latlngStr = input.split(', ', 2);
	var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	var geocoder = new google.maps.Geocoder;

	geocoder.geocode({'location': latlng}, function(results, status) {
	  if (status === 'OK') {
		if (results[0]) {

			var locString = results[0];
			var locArray = parse_place(locString);
			location2 = locArray['city'] + ", " + locArray['country'];
			console.log("Loc: " + location2);
			signUp(email, password);
		}
		} 
		return "-1"
	});
	
  }
function parse_place(place){
    var location = [];

    for (var ac = 0; ac < place.address_components.length; ac++)
    {
        var component = place.address_components[ac];

        switch(component.types[0])
        {
            case 'locality':
                location['city'] = component.long_name;
                break;
            case 'administrative_area_level_1':
                location['state'] = component.long_name;
                break;
            case 'country':
                location['country'] = component.long_name;
                break;
        }
    };

    return location;
}