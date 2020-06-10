$(document).ready(function () {


    firebase.database()
        .ref("SchoolCodes")
        .once('value')
        .then((snapshot) => { 
            console.log("snap " + snapshot.val())
            snapshot.forEach(function(snap) {
                console.log("inner: " + snap.val()) 
            })
            
        });


    $("#add_school_button_submit").click(function (e) {
        e.preventDefault();
        console.log("submit button clicked")

        var schoolName = $("#schoolInput").val();

        console.log(schoolName);
    });



});