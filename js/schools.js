
var database = firebase.database();



function createSchoolCard(school) {
    var wrapper = document.createElement("DIV");
    wrapper.classList.add("col-6", "school-card-wrapper");

    var content = document.createElement("DIV");
    content.classList.add("school-card");

    var img = document.createElement("DIV");
    img.classList.add("school-card-image");
    img.style.backgroundImage = 'url("' + school["ImageURI"] + '")';
    content.appendChild(img);

    var name = document.createElement("H3");
    name.innerText = school['Name'];
    content.appendChild(name);

    var raised = document.createElement("P");
    raised.innerText = "Raised: $" + school['Raised'] + " / $" + school['Funding Goal'];
    content.appendChild(raised);

    var more = document.createElement("P");
    more.classList.add("school-card-more");
    more.innerText = "More";

    more.addEventListener("click", () => handleContentInfo(school));
    content.appendChild(more);
    wrapper.appendChild(content);

    return wrapper;
}

function handleContentInfo(school) {
    document.getElementById("school-card-info").style.display="block";

    document.getElementById("content-image").style.backgroundImage = 'url("' + school["ImageURI"] + '")';
    document.getElementById("content-name").innerText = school["Name"];
    document.getElementById("content-raised").innerText = "Raised: $" + school['Raised'] + " / $" + school['Funding Goal'];
    document.getElementById("content-description").innerText = school["Description"];

    document.getElementById("content-items-list").innerHTML= "";
    for (let i in school["Items"]) {
        var li = document.createElement("LI");
        li.innerText =  school["Items"][i];
        document.getElementById("content-items-list").appendChild(li);
    }

    var lat = parseFloat(school["Location"]);
    var long = parseFloat(school["Location"].substring(school["Location"].indexOf(",")+1));

    let map = new google.maps.Map(document.getElementById('content-map'), {
        center: {lat: lat, lng: long},
        zoom: 15
    });
    let marker = new google.maps.Marker({position: {lat, lng:long}, map: map})
}

function loadSchools() {
    database.ref('Schools').once('value').then(snapshot => {
        document.getElementById("school-list").innerHTML = "";
        snapshot.val().forEach((school, i) => {
            document.getElementById("school-list").appendChild(createSchoolCard(school));
        });
    });
}

loadSchools();


function handleInfoClick(e) {
    if (e.target.id == "school-card-info") {
        document.getElementById("school-card-info").style.display = "none";
    }
}

document.getElementById("school-card-info").addEventListener("click", handleInfoClick);

