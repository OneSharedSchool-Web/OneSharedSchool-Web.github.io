
var globalUser;
var email;
var accountType = "";
var progress = 0;
var schoolCode;

function update()
{
	console.log(schoolCode);
	console.log(accountType);
	var ref = firebase.database().ref('Posts/' + schoolCode);
	ref.on('value', gotData	,errData);
}

/*function hide(commentHolder)
{
	commentHolder.style.display = "none";
	console.log("hi");
}*/

function gotData(data)
{
	console.log(data.val());
	const myNode = document.getElementById("comments");
	while (myNode.firstChild) 
	{
		myNode.removeChild(myNode.lastChild);
	}
	
	var articleObj = data.val();
	
	if(articleObj != null)
	{
		var keys = Object.keys(articleObj);
		for(var i = keys.length - 1; i >= 0; i--)
		{
			var k = keys[i];
			console.log(k);
			var passage = articleObj[k].passage;
			var id = articleObj[k].postKey;
			var user = articleObj[k].user;
			var email = articleObj[k].email;
			var accountType = articleObj[k].accountType;
			
			var commentHolder = document.createElement('div');
			commentHolder.className = "commentHolder";
			commentHolder.innerHTML = email + ": " + passage;
			commentHolder.setAttribute("postKey", id);
			
			if(accountType == "admin" || accountType == "principal" && progress == 2)
			{
				var deleteObj = document.createElement('div');
				deleteObj.className = "delete";
				
				deleteObj.onclick = function(eventClick)
				{
					console.log(eventClick);
					var obj = eventClick.path[1];
					var id = obj.getAttribute("postKey");
					console.log(id);
					firebase.database().ref('Posts/' + id).remove();
				}
				
				commentHolder.appendChild(deleteObj);
			}
			
			document.getElementById("comments").appendChild(commentHolder);
			
			
		}
	}
	else
	{
		document.getElementById("comments").innerHTML = "No Comments Posted";
	}
}
function errData(err)
{
	console.log(err);
}


function post()
{
	firebase.database().ref('Users/' + globalUser.uid).once('value').then(function(snapshot)
	{
		email = snapshot.val().email;
		schoolCode = snapshot.val().schoolCode;
		
		var schoolCode = schoolCode;
		var postKey = firebase.database().ref('Posts/').push().key;
		var updates = {};
		var postData = 
		{
			passage: $("#loggedFormPassage").val(),
			user: globalUser.uid,
			email: email,
			postKey: postKey
		}
		document.getElementById("loggedFormPassage").value = "";
		updates['/Posts/' + schoolCode + '/' + postKey] = postData;
		firebase.database().ref().update(updates);
	});
}

firebase.auth().onAuthStateChanged(function(user)
{
  if (user)
  {
    globalUser = user;
	firebase.database().ref('Users/' + user.uid).once("value", (data) => 
	{
		progress = data.val().progress;
		accountType = data.val().accountType;
		schoolCode = data.val().schoolCode;
		console.log(schoolCode);
		if(accountType == "principal" && progress != 2)window.location.replace("portal.html");
		else if(accountType == "principal" && progress == 2)document.getElementById("schoolCode").innerHTML + "School Code: " + data.val().schoolCode;
		update();
	});
  } 
  else {
	window.location.replace("portal.html");
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