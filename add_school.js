$(document).ready(function () {

    $("#add_school_button_submit").click(function (e) {
        e.preventDefault();
        console.log("submit button clicked")

        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var schoolEmail = $("#schoolEmail").val();
        var schoolName = $("#schoolName").val();
        var photoLink = $("#photoLink").val();
        var schoolDescription = $("#schoolDescription").val();
        var donationsUsedFor = $("#donationsUsedFor").val();
        var gofundmeLink = $("#gofundme").val();
        var otherVerificationInfo = $("#otherVerificationInfo").val();
        const selectedDriversLicense = document.getElementById('driversLicense').files[0];
        const selectedSchoolId = document.getElementById("schoolIDcard").files[0];

        console.log(selectedDriversLicense.name)
        if (!(firstName && lastName && schoolEmail && schoolName && photoLink &&
            schoolDescription && donationsUsedFor && gofundmeLink && selectedDriversLicense
            && selectedSchoolId)) {
            alert("Please fill out all fields and try again")
            return
        }


        var organizerID = firebase.auth().currentUser.uid;

        //school post entry
        var proposedSchoolObject = {
            adminFirstName: firstName,
            adminLastName: lastName,
            otherVerificationInfo: otherVerificationInfo,
            name: schoolName,
            description: schoolDescription,
            imageUri: photoLink,
            items: donationsUsedFor.split(","),
            organizerID: organizerID,
            selectedDriversLicense: selectedDriversLicense,
            selectedSchoolId: selectedSchoolId
            //TODO add all the other fields here
        }

        const ref = firebase.database().ref('SchoolCodes');

        ref.once('value', (data) => {
            var articleObj = data.val();
            if (articleObj != null) {
                var keys = Object.keys(articleObj);

                var schoolCode = Math.floor(1000000000 + Math.random() * 9000000000)

                while (!checkDuplicates(schoolCode, keys)) {
                    schoolCode = Math.floor(1000000000 + Math.random() * 9000000000)
                }

                console.log("The school code is", schoolCode)

                //push the new school to firebase

                firebase.database().ref("Schools").once("value", (data) => {
                    var sortedKeys = Object.keys(data.val()).sort();

                    var newIndex = 1;

                    if (sortedKeys.length != 0) {
                        newIndex = parseInt(sortedKeys[sortedKeys.length - 1]) + 1;
                    }

                    console.log("New school will be inserted here", newIndex)

                    try {
                        console.log("Selected file", selectedDriversLicense.name)
                        var ext = selectedDriversLicense.name.split(".")[1]
                        var driverRef = firebase.storage().ref().child("AdminsToBeValidated/Drivers_" + organizerID + "." + ext);
                        driverRef.put(selectedDriversLicense).then(function (snapshot) {
                            console.log("Uploaded file successfully! :)")
                        })

                        ext = selectedDriversLicense.name.split(".")[1]
                        var schoolIDref = firebase.storage().ref().child("AdminsToBeValidated/School_" + organizerID + "." + ext);
                        schoolIDref.put(selectedSchoolId).then(function (snapshot) {
                            console.log("Uploaded file successfully! :)")
                        })

                        var updates = {};
                        proposedSchoolObject["schoolCode"] = schoolCode;
                        proposedSchoolObject["schoolIndex"] = newIndex;
                        updates['/ProposedSchools/' + organizerID] = proposedSchoolObject;
                        return firebase.database().ref().update(updates);
                    } catch (e) {
                        console.log("Error updating firebase with new school records :(")
                        console.log(e)
                    }
                }, null)

            }
        }, errData);

    });



});

function checkDuplicates(key, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == key) {
            return false
        }
    }
    return true
}

function gotData(data) {
}

function errData(data) {
    console.log("error finding the school code")
    console.log(data);
}