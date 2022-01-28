var userID;
var ajaxUser = new XMLHttpRequest();
var ajaxResult;

function $(id){
    return document.getElementById(id)
}

window.onload = function() {
    if(localStorage.getItem('userID')){
        userID = localStorage.getItem('userID')
    }
    else if (sessionStorage.getItem('userID')) {
        userID = sessionStorage.getItem('userID');
    }
    
    displayCountry()

    if(!userID) {
        window.location.replace("http://localhost:8050/signin");
    }

    var params = {
        _id: userID
    };

    ajaxUser.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            ajaxResult = JSON.parse(this.response);
            document.getElementById('userImg').src = ajaxResult.userImageURL;
        }
    };
    ajaxUser.open("POST", "http://localhost:8050/users/getInfo", true);
    ajaxUser.setRequestHeader('Content-type', 'application/json')
    ajaxUser.send(JSON.stringify(params));
    
}

function displayCountry(){
    fetch('https://extreme-ip-lookup.com/json/')
    .then( res => res.json())
    .then(response => {
        var country = response.countryCode
        country = country.toLowerCase()
        $('country').innerHTML += `<li><i class="text-center flag-icon flag-icon-${country}"></i></li>`
    })
    .catch((data, status) => {
        console.log('Request failed');
    })
}