window.onload = update();

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
			
			schoolInfo.appendChild(schoolTitle);
			schoolInfo.appendChild(schoolDescription);
			schoolInfo.appendChild(schoolMoney);
			schoolCard.appendChild(schoolInfo);
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