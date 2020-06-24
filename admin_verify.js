$(document).ready(function () {
	update();
});

firebase.auth().onAuthStateChanged(function(user)
{
    console.log("Is user logged in?", user)
	if(user)
	{
		const ref = firebase.database().ref('Users/' + user.uid);
        ref.once("value", (data) => {
			var arter = data.val();
			if (arter["accountType"] != "admin") {
				//window.location.replace("portal.html");
			} 
		});
	}
	else
	{
		window.location.replace("portal.html");
	}
});

function update()
{
	var ref = firebase.database().ref('ProposedSchools');

    // var schoolName = "test high school";
    // var adminFirstName = "marian";
    // var adminLastName = "webster";
    // var schoolDescription = "description of some random school";
    // var schoolImageLink = "https://www.brown.edu/sites/g/files/dprerj316/files/styles/square_sml/public/2019-04/01_About.jpg";
    // var driversLicense = "https://s.hdnux.com/photos/70/31/77/14786535/8/920x920.jpg";
    // var schoolID = "https://www.idwholesaler.com/learning-center/wp-content/uploads/2018/03/student-school-id-card-1.png";
    // var otherVerificationInformation = "random other verification data";

    // const card_to_inject = "<div class=\"shadow p-5\"><h4>" + schoolName + "</h4><div class=\"d-flex flex-row justify-content-center align-items-center p-3\"><div class=\"px-2\"><p>Admin:" + adminFirstName + " " + adminLastName + "</p><p>Description:" + schoolDescription + "</p><p>Items Needed: </p><ul><li>Hair</li><li>Clothing</li></ul></div><div class=\"px-2\"><img id=\"school_image\" src=\"" + schoolImageLink + "\"alt=\"School Image\"></div></div><h4>Admin Verification Information</h4><div class=\"d-flex flex-row justify-content-center align-items-center p-3\"><div class=\"p-3\"><h6>User Drivers License</h6><img id=\"drivers_license\" src=\"" + driversLicense + "\" alt=\"\"></div><div class=\"p-3\"><h6>School ID</h6><img id=\"school_id\"src=\"" + schoolID + "\"alt=\"\"></div></div><p>Other Verification Information:" + otherVerificationInformation + "</p><div class=\"d-flex flex-row justify-content-around align-items-center\" id=\"INSERT_USER_UID_HERE\"><div class=\"mr-3\"><p>approve</p><svg class=\"bi bi-check2\" width=\"5vw\" height=\"5vw\" viewBox=\"0 0 16 16\" fill=\"currentColor\"xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\"d=\"M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z\" /></svg></div><div><p>reject</p><svg class=\"bi bi-x\" width=\"5vw\" height=\"5vw\" viewBox=\"0 0 16 16\" fill=\"currentColor\"xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\"d=\"M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z\" /><path fill-rule=\"evenodd\"d=\"M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z\" /></svg></div></div></div>"
    // $("#proposed_school_list").append(card_to_inject)

    ref.once("value", (data) => {
        var object = data.val();

        console.log("entire object ===================");
        console.log(object);

        var keys = Object.keys(object);
        console.log("keys", keys)

        var storageRef = firebase.storage();


        for (var i = 0; i < keys.length; i++) {
            var current_key = keys[i];
            var content = object[current_key];
            console.log("content", content)
            console.log(content)

            var schoolName = content["name"];
            var adminFirstName = content["adminFirstName"];
            var adminLastName = content["adminLastName"];
            var schoolDescription = content["description"];
            var schoolImageLink = content["imageUri"];
            var driversLicense = content["adminFirstName"];
            var schoolID = content["adminFirstName"];
            var otherVerificationInformation = content["otherVerificationInfo"];
            var driversLicense = "";
            var schoolID = "";

            // var splitDriver = content["selectedDriversLicense"].split(".")
            // var splitSchool = content["selectedSchoolId"].split(".")

            // const driversLicenseExtension = splitDriver[splitDriver.length - 1]
            // const schoolIDExtension = splitSchool[splitSchool.length - 1]

            //console.log("filename search", current_key + driversLicenseExtension)

            var driverRef = storageRef.ref('/AdminsToBeValidated/Drivers_' + current_key)
            var schoolIdRef = storageRef.ref('/AdminsToBeValidated/School_' + current_key)

            driverRef.getDownloadURL().then(function (url) {
                // Insert url into an <img> tag to "download"
                console.log("Download url for driver's license is " + url)

                driversLicense = url;

                schoolIdRef.getDownloadURL().then(function (url) {

                    console.log("Download url for school ID is " + url)
                    schoolID = url;

                    const card_to_inject = "<div class=\"shadow p-5\"><h4>" + schoolName + "</h4><div class=\"d-flex flex-row justify-content-center align-items-center p-3\"><div class=\"px-2\"><p>Admin:" + adminFirstName + " " + adminLastName + "</p><p>Description:" + schoolDescription + "</p><p>Items Needed: </p><ul><li>Hair</li><li>Clothing</li></ul></div><div class=\"px-2\"><img id=\"school_image\" src=\"" + schoolImageLink + "\"alt=\"School Image\"></div></div><h4>Admin Verification Information</h4><div class=\"d-flex flex-row justify-content-center align-items-center p-3\"><div class=\"p-3\"><h6>User Drivers License</h6><img id=\"drivers_license\" src=\"" + driversLicense + "\" alt=\"\"></div><div class=\"p-3\"><h6>School ID</h6><img id=\"school_id\"src=\"" + schoolID + "\"alt=\"\"></div></div><p>Other Verification Information:" + otherVerificationInformation + "</p><div class=\"d-flex flex-row justify-content-around align-items-center\" id=\"" + current_key + "\"><div class=\"mr-3\" id=\"check_div\"><p>approve</p><svg class=\"bi bi-check2\" width=\"5vw\" height=\"5vw\" viewBox=\"0 0 16 16\" fill=\"currentColor\"xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\"d=\"M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z\" /></svg></div><div id=\"reject_div\"><p>reject</p><svg class=\"bi bi-x\" width=\"5vw\" height=\"5vw\" viewBox=\"0 0 16 16\" fill=\"currentColor\"xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\"d=\"M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z\" /><path fill-rule=\"evenodd\"d=\"M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z\" /></svg></div></div></div>"

                    $("#proposed_school_list").append(card_to_inject)

                    $("#check_div").on("click", function () {
                        console.log("check clicked")
                        var userID = $(this).parent().attr('id');
                        console.log(userID)
                        acceptSchool(userID)

                        $("#" + userID).parent().parent().remove();
                    });
                    $("#reject_div").on("click", function () {
                        console.log("reject clicked")
                        var userID = $(this).parent().attr('id');
                        console.log(userID)
                        rejectSchool(userID);
                        $("#" + userID).parent().parent().remove();
                    });
                })
            })
        }
    }, null)

    function rejectSchool(UID) {
        const ref = firebase.database().ref('SchoolCodes/' + UID);
        ref.remove();
        return;
    }

    function acceptSchool(UID) {
        const ref = firebase.database().ref('ProposedSchools/' + UID);
        ref.once("value", (data) => {
            var json = data.val();

            console.log("accept school function")
            console.log(json);
            
            // adminFirstName: "sreehari"
            // adminLastName: "rammohan"
            // description: "sdlfkkj"
            // imageUri: "https://www.brown.edu/sites/g/files/dprerj316/files/styles/wide_sml/public/2020-04/PembrokeCampus_0.jpg"
            // items: ["sdkjf"]
            // name: "Cupertino High School"
            // organizerID: "YSVLzdUwIuSkYFXS7YokVtURTI83"
            // otherVerificationInfo: "sdfsdf"
            // schoolCode: 3116723917
            // schoolIndex: 6
            // selectedDriversLicense: "20190825-_DSF8733.JPG"
            // selectedSchoolId: "20190825-_DSF8733.JPG"

            let objectToPush = {
                description: json["description"],
                fundlink: "google.com",
                id: json["schoolIndex"],
                imageUri: json["imageUri"],
                items: json["items"],
                location: "37.89, -122.2",
                name: json["name"],
                organizerID: json["organizerID"],
                raisedMoney: 0,
                totalMoney: 100
            }

            var updates = {}
            updates["/Schools/" + json["schoolIndex"]] = objectToPush;
            firebase.database().ref().update(updates);
			
			firebase.database().ref('Users/' + json["organizerID"]).once('value').then(function(snapshot){
				firebase.database().ref('Users/' + json["organizerID"]).set({
					email: snapshot.val().email,
					password: snapshot.val().password,
					accountType: snapshot.val().accountType,
					schoolCode: json.schoolCode,
					progress: 2
				});
			});
			
			
			  
			var postKey = json["schoolCode"];
			var updates = {};
			var postData = json["schoolIndex"];
			updates['/SchoolCodes/' + postKey] = postData;
			firebase.database().ref().update(updates);
			
			
            ref.remove();
            return;
        })
    }
}

function logout()
{
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}