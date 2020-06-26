window.onload = update();
var ids = [];

function update()
{
	var ref = firebase.database().ref('Schools');
	ref.on('value', gotData	,errData);
}

function gotData(data)
{
	const myNode = document.getElementById("schoolContainer");
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
			console.log("**************************");
			var k = keys[i];
			var name = articleObj[k].name;
			var description = articleObj[k].description;
			var url = articleObj[k].imageUri;
			var RM = articleObj[k].raisedMoney;
			var TM = articleObj[k].totalMoney;
			var fundLink = articleObj[k].fundLink;
			var organizerID = articleObj[k].organizerID;
			console.log(organizerID);
			
			var schoolCard = document.createElement('div');
			schoolCard.className = "schoolCard";
			schoolCard.style.cssText = "background-image: url('" + url + "')";
			
			var schoolInfo = document.createElement('div');
			schoolInfo.className = "schoolInfo";
			
			var schoolTitle = document.createElement('span');
			schoolTitle.className = "schoolTitle";
			schoolTitle.innerHTML = name;
			
			var schoolDescription = document.createElement('p');
			schoolDescription.className = "schoolDescription";
			schoolDescription.innerHTML = description;
			
			var schoolMoney = document.createElement('span');
			schoolMoney.className = "schoolMoney";
			schoolMoney.innerHTML = "$" + RM + " / " + "$" + TM;
				
			schoolID = document.createElement('span');
			schoolID.className = "schoolMoney schoolID";
			handle(organizerID);
			
			var schoolLink = document.createElement('a');
			schoolLink.href =  fundLink;
			schoolLink.innerHTML = "Click Here for Go Fund Me"
			
			schoolInfo.appendChild(schoolTitle);
			schoolInfo.appendChild(schoolDescription);
			schoolInfo.appendChild(schoolID);
			schoolInfo.appendChild(schoolMoney);
			schoolInfo.appendChild(schoolLink);
			schoolCard.appendChild(schoolInfo);
			/*schoolCard.onclick = function()
			{
				var myNode = document.getElementById("content");
				while (myNode.firstChild) 
				{
					myNode.removeChild(myNode.lastChild);
				}
				document.getElementById("blackborder").style.display = "flex";
				var obj = document.getElementById("content");
				
				var schoolTitle = document.createElement('span');
				var schoolDescription = document.createElement('p');
				var schoolMoney = document.createElement('span');
				
				schoolTitle.id = "schoolTitleInside";
				schoolDescription.id = "schoolDescriptionInside";
				schoolMoney.id = "schoolMoneyInside";
				schoolMoney.innerHTML = "$" + RM + " / " + "$" + TM;
				
				schoolTitle.innerHTML = name;
				schoolDescription.innerHTML = description;
				
				obj.appendChild(schoolTitle);
				obj.appendChild(schoolDescription);
				obj.appendChild(schoolMoney);
			}*/
			document.getElementById("schoolContainer").appendChild(schoolCard);
		}
	}
	else
	{
		document.getElementById("schoolContainer").innerHTML = "No School Posted";
	}
}
function errData(err)
{
	console.log(err);
}

function hide()
{
	document.getElementById("blackborder").style.display = "none";
}

function handle(a)
{
	console.log("hi");
	var tname = "";
	firebase.database().ref('/Users/').once('value').then(function(snapshot) {
		var keys2 = Object.keys(snapshot.val());
		console.log(a);
		for(var j= 0; j < keys2.length; j++)
		{
			var q = snapshot.val();
			//console.log(q[keys2[j]].name);
			//console.log(keys2[j]);
			//console.log(organizerID);
			if(keys2[j] == a)
			{	
				console.log("YAY");
				console.log(q[keys2[j]].name);
				ids.push(q[keys2[j]].name);
			}
		}
		end();
	});
	console.log(ids);
}

function end()
{
	var links = document.getElementsByClassName("schoolID");
	for(var i = 0; i < links.length; i++)
	{
		links[i].innerHTML = ids[i];
	}
}