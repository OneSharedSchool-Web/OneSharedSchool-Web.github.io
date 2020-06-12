$(document).ready(function () {
    // $("#proposed_school_list").append("<div class=\"shadow\"><h6>Adding this card</h6></div>")

    var ref = firebase.database().ref('ProposedSchools');

    ref.once("value", (data) => {
        var object = data.val();
        
        var keys = Object.keys(object);

        var content = data[keys[0]];

        console.log(content)

        console.log("object keys: ", keys);
    }, null)

});

