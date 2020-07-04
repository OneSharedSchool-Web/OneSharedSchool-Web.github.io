
var globalUser;
var email;
var usertype = "";
var progress = 0;
var schoolCode;
var once = false;
function update()
{
	console.log(schoolCode);
	console.log(usertype);
	if(once == false)
	{
		once = true;
		firebase.database().ref('Users/' + globalUser.uid).once("value", (data) => {
			var json = data.val().listOfCodes;
			var arter = data.val();
			for(var i = 0; i < json.length; i++)
			{
				var elem = document.createElement('div');
				elem.className = "indCode"
				elem.innerHTML = json[i];
				elem.onclick = function(eventClick)
				{
					console.log(eventClick.target.innerHTML);
					firebase.database().ref('Users/' + globalUser.uid).update({
						schoolCode: eventClick.target.innerHTML
					});
					schoolCode = eventClick.target.innerHTML;
					document.getElementById("codes").style.display = "none";
					update();
				};
				var codes = document.getElementById("codes");
				codes.appendChild(elem);
			}
		});
	}
	
	var ref = firebase.database().ref('Posts/' + schoolCode);
	ref.on('value', gotData	,errData);
}

function addSchool()
{
	var isValid = false;
	var obj = document.getElementById("schoolCodeRecive").value;
	console.log(obj);
	console.log(firebase.database().ref('SchoolCodes'));
	if(obj == "")return;
	firebase.database().ref('SchoolCodes/' + obj).once("value", (data) => {
		var arter = data.val();
		if (arter != undefined)
		{
			firebase.database().ref('Users/' + globalUser.uid).once("value", (data) => {
				var list = data.val().listOfCodes
				console.log(list);
				if(list.indexOf(obj) == -1)list.push(obj);
				firebase.database().ref('Users/' + globalUser.uid).update({
					listOfCodes: list,
					schoolCode: obj
				});
				schoolCode = obj;
				update();
			});
		}
		else 
		{
			document.getElementById("errorMessage").innerHTML = "Invalid School Code";
		}
	});
}

function showCodes()
{
	document.getElementById("codes").style.display = "flex";
}

function gotData(data)
{
	console.log(data.val() + "poopoopeepee");
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
			var usertype = articleObj[k].usertype;
			
			var commentHolder = document.createElement('div');
			commentHolder.className = "commentHolder";
			commentHolder.innerHTML = email + ": " + passage;
			commentHolder.setAttribute("postKey", id);
			
			if(usertype == "admin" || usertype == "principal" && progress == 2)
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
		usertype = data.val().usertype;
		schoolCode = data.val().schoolCode;
		console.log(schoolCode);
		if(usertype == "principal" && progress != 2)window.location.replace("portal.html");
		else if(usertype == "principal" && progress == 2)
		{
			console.log("HIPOO");
			document.getElementById("schoolCode").innerHTML = "School Code: " + schoolCode;
			document.getElementById("addASchool").style.display = "none";
		}
		else{
			document.getElementById("addASchool").style.display = "flex";
		}
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