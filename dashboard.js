window.onload = update();
var globalUser;
var email;
var accountType;

function update()
{
	var ref = firebase.database().ref('Posts');
	ref.on('value', gotData	,errData);
}

/*function hide(commentHolder)
{
	commentHolder.style.display = "none";
	console.log("hi");
}*/

function gotData(data)
{
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
			var passage = articleObj[k].passage;
			var id = articleObj[k].postKey;
			var user = articleObj[k].user;
			var email = articleObj[k].email;
			var accountType = articleObj[k].accountType;
			
			var commentHolder = document.createElement('div');
			commentHolder.className = "commentHolder";
			commentHolder.innerHTML = email + ": " + passage;
			commentHolder.setAttribute("postKey", id);
			
			/*if(email == "testcase@gmail.com")
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
			}*/
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
	firebase.database().ref('/Users/').once('value').then(function(snapshot) {
		var keys2 = Object.keys(snapshot.val());
		var email = "";
		var accountType = "";
		for(var j= 0; j < keys2.length; j++)
		{
			var q = snapshot.val();
			if(keys2[j] == globalUser.uid)
			{
				console.log(q[keys2[j]].email);
				email = (q[keys2[j]].email);
				accountType = (q[keys2[j]].accountType);
			}
		}
		var postKey = firebase.database().ref('Posts/').push().key;
		var updates = {};
		var postData = 
		{
			passage: $("#loggedFormPassage").val(),
			user: globalUser.uid,
			email: email,
			accountType: accountType,
			postKey: postKey
		}
		document.getElementById("loggedFormPassage").value = "";
		updates['/Posts/' + postKey] = postData;
		firebase.database().ref().update(updates);
	});
}

firebase.auth().onAuthStateChanged(function(user)
{
  if (user) {
    globalUser = user;
  } else {
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