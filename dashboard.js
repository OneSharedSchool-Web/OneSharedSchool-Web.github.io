
var globalUser;
var email;
var usertype = "";
var progress = 0;
var schoolCode;
var listOfNums = [];
function update()
{
	console.log(schoolCode);
	console.log(usertype);
		firebase.database().ref('Users/' + globalUser.uid).once("value", (data) => {
			var schoolId = data.val().school;
			firebase.database().ref('SchoolCodes/').once("value", (snapshot) => {
				var codes = snapshot.val()
				console.log(codes)
				for (var code in codes) {
					console.log(schoolId + ", " + code);
					listOfNums.push(snapshot.val()[code]);
					//firebase.database().ref('Schools/' + snapshot.val()[code]).once("value", (arter) =>{
					//	arter.val().name;
					//});
					var elem = document.createElement("DIV");
					elem.title = code;
					elem.id = "schoolCode";
					elem.onclick = function(e)
					{
						console.log(e);
						let obj = e.path[0].title;
						console.log(obj);
						schoolCode = obj;
						firebase.database().ref('Users/' + globalUser.uid).update({
							schoolCode: schoolCode
						});

						var ref = firebase.database().ref('Posts/' + schoolCode);
						ref.on('value', gotData	,errData);

					};
					document.getElementById("codes").appendChild(elem);
				}
				console.log(listOfNums);
				for(let i = 0; i < listOfNums.length; i++)
				{
					
					firebase.database().ref('Schools/' + listOfNums[i]).once("value", (arter) =>{
						console.log(arter.val().name);
						document.getElementById("codes").childNodes[i + 1].innerHTML = arter.val().name;
					});
				}
			});
		});
	
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
	else console.log("HE");
	firebase.database().ref('SchoolCodes/' + obj).once("value", (data) => {
		var arter = data.val();
		if (arter != undefined)
		{
			firebase.database().ref('Users/' + globalUser.uid).once("value", (data) => {
				var list = data.val().listOfCodes
				if(list == undefined)
				{
					list = [];

				}
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
	document.getElementById("block").style.display = "flex";
	update();
}

function gotData(data)
{
	console.log(data.val());
	const myNode = document.getElementById("comments");
	while (myNode.firstChild) 
	{
		myNode.removeChild(myNode.lastChild);
	}
	
	var articleObj = data.val();
	console.log(articleObj);
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
		console.log(usertype);
		// schoolCode = data.val().schoolCode;
		// console.log(schoolCode);
		if(usertype == "principal" && progress != 2)window.location.replace("portal.html");
		else if(usertype == "principal" && progress == 2)
		{
			update();
			document.getElementById("schoolCode").innerHTML = "School Code: " + schoolCode;
			document.getElementById("addASchool").style.display = "none";
		}
		else{
			update();
			document.getElementById("schoolCode").style.display = "none";
		}
		
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