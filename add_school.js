$(document).ready(function () {

	var ref = firebase.database().ref('SchoolCodes');


    $("#add_school_button_submit").click(function (e) {
        e.preventDefault();
        console.log("submit button clicked")

        var schoolName = $("#schoolInput").val();

        console.log(schoolName);

        //school post entry
        var schoolData = {
            name: schoolName

            //TODO add all the other fields here
        }



        ref.once('value', (data) => {
            console.log(data);
            var articleObj = data.val();
            console.log(articleObj);
            if(articleObj != null) {
                var keys = Object.keys(articleObj);
                
                var schoolCode = Math.floor(1000000000 + Math.random() * 9000000000)

                while(!checkDuplicates(schoolCode, keys)) {
                    schoolCode = Math.floor(1000000000 + Math.random() * 9000000000)
                }

                console.log("The school code is", schoolCode)

                //push the new school to firebase
                
                firebase.database().ref("Schools").once("value", (data) => {
                    var sortedKeys = Object.keys(data.val()).sort();

                    var newIndex = 1;

                    if(sortedKeys.length != 0) {
                        newIndex = parseInt(sortedKeys[sortedKeys.length-1]) + 1;
                    }

                    console.log("New school will be inserted here", newIndex)

                    var updates = {};

                    updates['/Schools/' + newIndex] = schoolData;
                    updates['/SchoolCodes/' + schoolCode] = newIndex;
                    return firebase.database().ref().update(updates);

                }, null)
                

        
            }
        },errData);

    });



});

function checkDuplicates(key, arr) {
    for(var i = 0; i < arr.length; i++) {
        if (arr[i] == key) {
            return false
        }
    }
    return true
}

function gotData(data){  
}

function errData(data)
{
	console.log(data);
}