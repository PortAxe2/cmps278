var signinButton;
var signoutButton;
var errorMessage;
var emailPattern  = /(^[a-z0-9-\._]{1,}(@)[a-zA-Z-_\.]{1,}(?:^-_\.|[a-zA-Z0-9])(\.)[a-zA-Z]{2,}$)/g;
var incorrectInfo = sessionStorage.getItem('incorrectCombo');

window.onload = function() {
    errorMessage = document.getElementById('loginError');
    signinButton = document.getElementById('loginButton');
    signoutButton= document.getElementById('signoutButton');
    if (incorrectInfo == true) {
        errorMessage.style.display = 'block';
    }
    signinButton.onclick = signIn;
}

function signIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    window.location.replace('./homepage.html')
}
