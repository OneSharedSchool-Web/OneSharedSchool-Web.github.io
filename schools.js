window.onload = update();
update();
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
			var k = keys[i];
			var name = articleObj[k].name;
			var description = articleObj[k].description;
			var url = articleObj[k].imageUri;
			var RM = articleObj[k].raisedMoney;
			var TM = articleObj[k].totalMoney;
			var fundLink = articleObj[k].fundLink;
			
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
			
			var schoolLink = document.createElement('a');
			schoolLink.href =  fundLink;
			schoolLink.innerHTML = "Click Here for Go Fund Me"
			
			schoolInfo.appendChild(schoolTitle);
			schoolInfo.appendChild(schoolDescription);
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