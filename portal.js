var accountType = "";
var portalType = "";
var currentUser;
var email;
var password;

logout();

function portalTypeLogin()
{
	document.getElementById("accountType").style.display = "none";
	document.getElementById("dif").style.display = "flex";
	document.getElementById("formSub").innerHTML = "Login";
	portalType = "login";
}
function portalTypeSignUp()
{
	document.getElementById("accountType").style.display = "block";
	document.getElementById("dif").style.display = "none";
	document.getElementById("formSub").innerHTML = "SignUp";
	portalType = "signUp";
}
function principal()
{
	accountType = "principal";
	document.getElementById("dif").style.display = "flex";
}
function student()
{
	accountType = "student";
	document.getElementById("dif").style.display = "flex";
}

function submit()
{
	console.log(accountType + " " + portalType);
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	
	if(portalType == "login")
	{
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
	}
	else
	{
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorMessage);
		  // ...
		});
		
	}
}

firebase.auth().onAuthStateChanged(function(user)
{
  if (user)
  {
    currentUser = user;
	if(portalType == "signUp")
	{
		addUser();
		if(accountType == "student")
		{
			setTimeout(relocateDash, 2000);
		}
		else if(accountType == "principal")
		{
			setTimeout(relocateAdd, 2000);
		}
	}
	else if(portalType == "login")
	{
		firebase.database().ref('/Users/').once('value').then(function(snapshot)
		{
			var keys2 = Object.keys(snapshot.val());
			var accountType = "";
			for(var j= 0; j < keys2.length; j++)
			{
				var q = snapshot.val();
				if(keys2[j] == user.uid)
				{
					console.log(q[keys2[j]].email);
					accountType = (q[keys2[j]].accountType);
				}
			}
			if(accountType == "student")
			{
				relocateDash();
			}
			else if(accountType == "principal")
			{
				relocateAdd();
			}
			else if(accountType == "admin")
			{
				relocateVer();
			}
		});
	}
  }
  else 
  {
	  
  }
});

function addUser()
{
	if(accountType == "student")
	{
		console.log("MyMAN");
		console.log(currentUser.uid);
		var postKey = currentUser.uid;
		var updates = {};
		var postData = 
		{
			email: email,
			password: password,
			accountType: accountType,
		}
		
		updates['/Users/' + postKey] = postData;
		firebase.database().ref().update(updates);
	}
	else
	{
		console.log("MyMAN");
		console.log(currentUser.uid);
		var postKey = currentUser.uid;
		var progress = 0;
		var updates = {};
		var postData = 
		{
			email: email,
			password: password,
			accountType: accountType,
			progress: progress
		}
		
		updates['/Users/' + postKey] = postData;
		firebase.database().ref().update(updates);
	}
}

function relocateDash()
{
	window.location.replace("dashboard.html");
}

function relocateAdd()
{
	window.location.replace("add_school.html");
}

function relocateVer()
{
	window.location.replace("admin_verify.html");
}
function logout()
{
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}