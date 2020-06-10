$(document).ready(function () {

	var ref = firebase.database().ref('SchoolCodes');
	ref.once('value', gotData,errData);


    $("#add_school_button_submit").click(function (e) {
        e.preventDefault();
        console.log("submit button clicked")

        var schoolName = $("#schoolInput").val();

        console.log(schoolName);
    });



});

function gotData(data)
{
	console.log(data);
	var articleObj = data.val();
	console.log(articleObj);
	if(articleObj != null)
	{
		var keys = Object.keys(articleObj);
		for(var i = 0; i < keys.length; i++)
		{
			console.log(keys[i]);
		}
	}
}

function errData(data)
{
	console.log(data);
}