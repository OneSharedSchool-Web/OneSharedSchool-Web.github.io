window.onload = update();

function update()
{
	var ref = firebase.database().ref('Posts');
	ref.on('value', gotData	,errData);
}

function hide(commentHolder)
{
	commentHolder.style.display = "none";
	console.log("hi");
}

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
			var user = articleObj[k].user;
			var email = firebase.auth().currentUser.email;
			var id = articleObj[k].postKey;
			
			var commentHolder = document.createElement('div');
			commentHolder.className = "commentHolder";
			commentHolder.innerHTML = email + ": " + passage;
			commentHolder.setAttribute("postKey", id);
			
			if(email == "testcase@gmail.com")
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