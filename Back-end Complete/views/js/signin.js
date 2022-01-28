function $(id){
    return document.getElementById(id)
} 

window.onload = function(){
    sessionStorage.removeItem('userID')
    localStorage.removeItem('userID')

    $('errors').style.display = 'none'
    $('btn').onclick = signin
}


function signin(){
    $('errors').style.display = 'none'
    var username = $('username').value
    var password = $('password').value
    var remember = $('rememberMe')
    var credentials = {
        "username": username,
        "password": password
    }


    fetch("http://localhost:8050/users/signIn", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })
        .then(function (response) {
            if ((response.ok)) {
                return response.text();
            }
        })
        .then(function (text) {
            var results = JSON.parse(text);
            
            if(results.errors == 'true'){
                $('errors').style.display = 'block'
                $('success').style.display = 'none'
            }
            else{
                if(remember.checked == true){
                    sessionStorage.removeItem('userID');
                    localStorage.setItem('userID', results.userId);
                    localStorage.setItem('remember', true);
                }
                else{
                    localStorage.removeItem('userID');
                    sessionStorage.setItem('userID', results.userId);
                    localStorage.setItem('remember', false);
                }

                window.location.replace("http://localhost:8050/homepage");
            }
        })
       
}




/*var signinButton;

var errorMessage;
var ajaxUserCheck = new XMLHttpRequest();
var ajaxResult;
var emailPattern  = /(^[a-z0-9-\._]{1,}(@)[a-zA-Z-_\.]{1,}(?:^-_\.|[a-zA-Z0-9])(\.)[a-zA-Z]{2,}$)/g;
var incorrectInfo = sessionStorage.getItem('incorrectCombo');
var successLogin = false;

window.onload = function() {
    sessionStorage.removeItem('userID');
    localStorage.removeItem('userID');
    errorMessage = document.getElementById('loginError');
    signinButton = document.getElementById('loginButton');
    var signupButton= document.getElementById('signupButton');
    if (incorrectInfo == true) {
        errorMessage.style.display = 'block';
    }
    signinButton.onclick = function() {
        signIn();
    };
}

function signIn() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var remember = document.getElementById('rememberMe');
    var credentials = {
        "username": username,
        "password": password
    };
    console.log(credentials);
    ajaxUserCheck.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            ajaxResult = JSON.parse(this.response);
            console.log(ajaxResult);
            if(ajaxResult.length != 0) {
                successLogin = true;
                if(remember.checked == true){
                    sessionStorage.removeItem('userID');
                    localStorage.setItem('userID', ajaxResult[0]._id);
                    localStorage.setItem('remember', true);
                }
                else{
                    localStorage.removeItem('userID');
                    sessionStorage.setItem('userID', ajaxResult[0]._id);
                    localStorage.setItem('remember', false);
                }
                window.location.replace("http://localhost:8050/homepage");
            }
            else {
                successLogin = false;
                errorMessage.style.display = "block";
                setTimeout(function() {
                    errorMessage.style.display = "none";
                }, 5000);
            }
            console.log(successLogin);
        }
        
    };
    ajaxUserCheck.open("POST", "http://localhost:8050/users/signIn", true);
    ajaxUserCheck.setRequestHeader('Content-type', 'application/json')
    ajaxUserCheck.send(JSON.stringify(credentials));
}
*/