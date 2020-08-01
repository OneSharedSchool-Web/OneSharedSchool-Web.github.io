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
			if (arter["usertype"] != "admin") {
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
            var adminName = content["adminName"];
            var email = content["email"];
            var schoolDescription = content["description"];
            var schoolImageLink = content["imageUri"];
            var driversLicense = content["adminName"];
            var schoolID = content["adminName"];
            var otherVerificationInformation = content["otherVerificationInfo"];
            var driversLicense = "";
            var schoolID = "";
            // var splitDriver = content["selectedDriversLicense"].split(".")
            // var splitSchool = content["selectedSchoolId"].split(".")

            // const driversLicenseExtension = splitDriver[splitDriver.length - 1]
            // const schoolIDExtension = splitSchool[splitSchool.length - 1]

            //console.log("filename search", current_key + driversLicenseExtension)
			console.log(current_key);
            var driverRef = storageRef.ref('/AdminsToBeValidated/Drivers_' + current_key)
			console.log(driverRef);	
            var schoolIdRef = storageRef.ref('/AdminsToBeValidated/School_' + current_key)

            driverRef.getDownloadURL().then(function (url) {
                // Insert url into an <img> tag to "download"
                console.log("Download url for driver's license is " + url)

                driversLicense = url;

                schoolIdRef.getDownloadURL().then(function (url) {

                    console.log("Download url for school ID is " + url)
                    schoolID = url;

                    const card_to_inject = "<div class=\"shadow p-5\"><h4>" + schoolName + "</h4><div class=\"d-flex flex-row justify-content-center align-items-center p-3\"><div class=\"px-2\"><p>Admin:" + adminName + "</p><p>Description:" + schoolDescription + "</p><p>Items Needed: </p><ul><li>Hair</li><li>Clothing</li></ul></div><div class=\"px-2\"><img id=\"school_image\" src=\"" + schoolImageLink + "\"alt=\"School Image\"></div></div><h4>Admin Verification Information</h4><div class=\"d-flex flex-row justify-content-center align-items-center p-3\"><div class=\"p-3\"><h6>User Drivers License</h6><img id=\"drivers_license\" src=\"" + driversLicense + "\" alt=\"\"></div><div class=\"p-3\"><h6>School ID</h6><img id=\"school_id\"src=\"" + schoolID + "\"alt=\"\"></div></div><p>Other Verification Information:" + " Email of admin: " + email + "<br>" + otherVerificationInformation + "</p><div class=\"d-flex flex-row justify-content-around align-items-center\" id=\"" + current_key + "\"><div class=\"mr-3\" id=\"check_div\"><p>approve</p><svg class=\"bi bi-check2\" width=\"5vw\" height=\"5vw\" viewBox=\"0 0 16 16\" fill=\"currentColor\"xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\"d=\"M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z\" /></svg></div><div id=\"reject_div\"><p>reject</p><svg class=\"bi bi-x\" width=\"5vw\" height=\"5vw\" viewBox=\"0 0 16 16\" fill=\"currentColor\"xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\"d=\"M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z\" /><path fill-rule=\"evenodd\"d=\"M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z\" /></svg></div></div></div>"

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
        const ref = firebase.database().ref('ProposedSchools/' + UID);
        ref.remove();
        return;
    }

    function acceptSchool(UID) {
        const ref = firebase.database().ref('ProposedSchools/' + UID);
        ref.once("value", (data) => {
            var json = data.val();

            console.log("accept school function")
            console.log(json);
            
            firebase.database().ref("Schools").once("value", (data) => {
                var sortedKeys = Object.keys(data.val()).sort();

                var newIndex = 1;

                if (sortedKeys.length != 0) {
                    newIndex = parseInt(sortedKeys[sortedKeys.length - 1]) + 1;
                }

                console.log("New school will be inserted here", newIndex)

                let objectToPush = {
                    description: json["description"],
                    fundLink: json["fundLink"],
                    id: newIndex + "",
                    imageUri: json["imageUri"],
                    items: json["items"],
                    location: json["location"],
                    name: json["name"],
                    organizerID: json["organizerID"],
                    raisedMoney: "0.0",
                    totalMoney: "0.0"
                }
                
                var updates = {}
                updates[newIndex] = objectToPush;
                firebase.database().ref("/Schools/").update(updates);
    
                // var result = {
                //     location: ,
                //     school: newIndex+"",
                //     progress: 2
                // }
                geocodeLatLng(json["location"], json)
                // firebase.database().ref("/Users/"+json["organizerID"]).update(result);
                // firebase.database().ref("/Users/"+json["organizerID"]+"/school").update(newIndex+"");
                // firebase.database().ref("/Users/"+json["organizerID"]+"/progress").update(2);

                var postKey = json["schoolCode"];
                var updates = {};
                updates[postKey] = newIndex;
                firebase.database().ref("/SchoolCodes/").update(updates);
                
                
                // ref.remove();
                rejectSchool(UID)
                return;
            }, null)

            
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
function geocodeLatLng(input, json) {
	var latlngStr = input.split(', ', 2);
	var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	var geocoder = new google.maps.Geocoder;

	geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {

                var locString = results[0];
                var locArray = parse_place(locString);
                location2 = locArray['city'] + ", " + locArray['country'];
                console.log("Loc: " + location2);
                
                firebase.database().ref('Users/' + json["organizerID"]).update({
                    progress: 2,
                    school: ""+json["schoolIndex"],
                    location: location2
                    
                });
            }
        } 
		return "-1"
	});
	
  }

function parse_place(place){
    var location = [];

    for (var ac = 0; ac < place.address_components.length; ac++)
    {
        var component = place.address_components[ac];

        switch(component.types[0])
        {
            case 'locality':
                location['city'] = component.long_name;
                break;
            case 'administrative_area_level_1':
                location['state'] = component.long_name;
                break;
            case 'country':
                location['country'] = component.long_name;
                break;
        }
    };

    return location;
}