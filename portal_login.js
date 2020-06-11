$(document).ready(function () {
    console.log("Portal JS is ready");
    $("#createUserRadio").on("click", createUserRadioClicked)
    $("#loginRadio").on("click", loginUserRadioClicked)

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
         
          //redirect to request page

          window.location = "add_school.html"
          // ...
        } else {
          // User is signed out.
          // ...
        }
      });
});

function createUserRadioClicked() {
    console.log("Create user radio clicked")
    $("#title").text("Create Account")
    $("#submit").text("Create Account")

}

function loginUserRadioClicked() {
    console.log("Login user radio clicked")
    $("#title").text("Log In")
    $("#submit").text("Log In")

}

function clickTheSubmitButton() {
    var email = $("#email").val();
    var password = $("#password").val();

    console.log("clicked the submit button", email, password);

    console.log("status", $('#createUserRadio').is(':checked'))

    if ($('#createUserRadio').is(':checked')) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("Error creating user")
        });
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log("Error signing in user")
        });
    }
}