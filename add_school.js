$(document).ready(function () {

	var ref = firebase.database().ref('SchoolCodes');


    $("#add_school_button_submit").click(function (e) {
        e.preventDefault();
        console.log("submit button clicked")

        var schoolName = $("#schoolInput").val();

        console.log(schoolName);

        var description = $("#schoolDescription").val();
        var imageURI = $("#photoLink").val();
        var donationsUsedFor = $("#donationsUsedFor").val();

        var organizerID = firebase.auth().currentUser.uid;

        console.log("printing form values", description, imageURI, donationsUsedFor, organizerID)

        //school post entry
        var schoolData = {
            name: "Carneggie Mellon U",
            description: "we are in CMU",
            imageUri: "https://www.cmu.edu/assets/images/site/meta-image-cmu.jpg",
            items: "====",
            organizerID: organizerID
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
                    
                    schoolData["schoolCode"] = schoolCode;
                    schoolData["schoolIndex"] = newIndex;

                    updates['/ProposedSchools/' + organizerID] = schoolData;
                    return firebase.database().ref().update(updates);
                }, null)
                
                try {
                    const selectedDriversLicense = document.getElementById('driversLicense').files[0];
                    console.log("Selected file", selectedDriversLicense.name)
                    var ext = selectedDriversLicense.name.split(".")[1]
                    var driverRef = firebase.storage().ref().child("AdminsToBeValidated/Drivers_" + organizerID + "." + ext);
                    driverRef.put(selectedDriversLicense).then(function(snapshot) {
                        console.log("Uploaded file successfully! :)")
                    })
                    
                    const selectedSchoolId = document.getElementById("schoolIDcard").files[0];
                    ext = selectedDriversLicense.name.split(".")[1]
                    var schoolIDref = firebase.storage().ref().child("AdminsToBeValidated/School_" + organizerID + "." + ext);
                    schoolIDref.put(selectedSchoolId).then(function(snapshot) {
                        console.log("Uploaded file successfully! :)")
                    })
                } catch(e) {
                    console.log(e)
                }
               
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
    console.log("error finding the school code")
	console.log(data);
}