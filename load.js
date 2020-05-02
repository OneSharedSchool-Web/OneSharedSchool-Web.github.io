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
	
	if(articleObj != null)
	{
		var keys = Object.keys(articleObj);
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
	else
	{
		document.getElementById("loggedDisplay").innerHTML = "No News Posted";
	}
}
function errData(err)
{
	console.log(err);
}

