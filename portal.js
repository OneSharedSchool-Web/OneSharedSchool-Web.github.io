var accountType = "";
var portalType = "";
var currentUser;
var email;
var password;

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
		addUser();
	}
}

firebase.auth().onAuthStateChanged(function(user)
{
  if (user)
  {
    currentUser = user;
  }
  else 
  {
	  
  }
});

function addUser()
{
	//add a user to firebase with a key called type which is equal to variable portalType
}