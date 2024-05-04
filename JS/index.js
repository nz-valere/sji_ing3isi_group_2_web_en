$('.xy').on('click', function(){
    // $('h2').html('<strong>orange</strong>');
    $('#login-container').slideToggle().animate({fontSize: '15px'});
    $('.xy').css('display','none');
});
$(document).ready(function() {
    $("#login-form").submit(function(event) {
        event.preventDefault();

        // Get username and password values
        const username = $("#username").val();
        const password = $("#password").val();

        // Check if username and password are correct (For demonstration purposes, let's say username: "user" and password: "password")
        if (username === "valere" && password === "1234") {
            // Redirect to dashboard
            alert("Login successful!");
        } else {
            // Display error message
            $("#error-message").text("Invalid username or password. Please try again.");
        }
    });
});
$('.zz').on('click', function(){
    $('.signup-container').slideToggle().animate({fontSize: '15px'});
    $('#login-container').css('display','none');
});
