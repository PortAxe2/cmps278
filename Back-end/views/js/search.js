var userID;
var ajaxUser = new XMLHttpRequest();
var ajaxResult
var url


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
    
    if(!userID) {
        window.location.replace("http://localhost:8050/signin");
    }


    displayCountry()

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

    $('currency').onchange = currencyConvert;

    
   
}




function currencyConvert() {
    prices = document.getElementsByClassName('price');
    var currentCurrency = document.getElementById('currency').value;
    console.log(currentCurrency);
    var priceText;
    var price;
    for (i = 0 ; i < prices.length ; i++) {
        if (prices[i].innerHTML === "FREE") {
            continue;
        }
        priceText = prices[i].innerHTML;
        if (currentCurrency == "lira") {
            price = parseFloat(priceText.substr(1,priceText.length-1));
            prices[i].innerHTML =  (price*1500).toString() + " L.L";
        } else {
            price = parseFloat(priceText.substr(0,priceText.length-4));
            prices[i].innerHTML =  "$" + (price/1500).toString();
        }
        console.log(price);
    }
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


