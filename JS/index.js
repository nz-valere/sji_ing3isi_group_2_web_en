$(document).ready(function() {

    var users = [];

    $('.xy').on('click', function(){
        $('#login-container').slideToggle().animate({fontSize: '15px'});
        $('.xy').css('display','none');
    });
    
    $('.zz').on('click', function(){
        $('.signup-container').slideToggle().animate({fontSize: '15px'});
        $('#login-container').css('display','none');
    });

    // function to handle signup
    $("#signup-form").submit(function(event) {
        event.preventDefault();

        // Get username, password, and confirm password values
        var username = $("#signup-username").val();
        var password = $("#signup-password").val();
        var confirmPassword = $("#signup-confirm-password").val();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Check if username is already taken
        if (users.some(user => user.username === username)) {
            alert("Username already exists. Please choose a different one.");
            return;
        }

        // Store username and password
        users.push({ username: username, password: password });
        alert("Sign up successful!");
    });
    // function to check if username is already taken
    $("#login-form").submit(function(event) {
        event.preventDefault();

        // Get username and password values
        const username = $("#username").val();
        const password = $("#password").val();

        var user = users.find(user => user.username === username && user.password === password);
    
        if (user) {
            // Redirect to dashboard
            alert("Login successful!");
        } else {
            // Display error message
            $("#error-message").text("Invalid username or password. Please try again.");
        }
    });
});