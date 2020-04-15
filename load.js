var selectedFile;
var globalUser;
update();

function hide()
{
	var blackborder = document.getElementById("blackborder");
	blackborder.style.display = "none";
}

function setText(passage)
{
	content.innerHTML = passage;
	console.log(passage);
	document.getElementById("blackborder").style.display = "flex";
}

function update()
{
	var ref = firebase.database().ref('Articles');
	ref.on('value', gotData	,errData);
}

function gotData(data)
{
	const myNode = document.getElementById("loggedDisplay");
	while (myNode.firstChild) 
	{
		myNode.removeChild(myNode.lastChild);
	}
	
	var articleObj = data.val();
	var keys = Object.keys(articleObj);
	console.log(keys);
	
	for(var i = 0; i < keys.length; i++)
	{
		var k = keys[i];
		var url = articleObj[k].url;
		var title = articleObj[k].title;
		var passage = articleObj[k].passage;
		var user = articleObj[k].user;
	
		console.log(user);
		console.log(url);
		console.log(title);
		console.log(passage);
		
		var icon = document.createElement('div');
		icon.className = "icon";
		icon.style.cssText = "background-image: url('" + url + "')";
		icon.onclick = function(){setText(passage)};
		
		var titleElement = document.createElement('div');
		titleElement.className = "iconTitle";
		titleElement.innerHTML = title;
		icon.appendChild(titleElement);
		
		var parent = document.getElementById("loggedDisplay");
		parent.appendChild(icon);
		
		/*var passageElement = document.createElement('div');
		passageElement.className = "iconPassage";
		passageElement.innerHTML = passage;
		
		var divholder = document.createElement('div');
		divholder.className = "itemHolder";
		divholder.appendChild(icon);
		divholder.appendChild(passageElement);*/
		
	}
}
function errData(err)
{
	console.log(err);
}

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
		
		updates['/Articles/' + postKey] = postData;
		firebase.database().ref().update(updates);
		console.log(downloadURL);
	});
}
