var userID;
var ajaxUser = new XMLHttpRequest();
var ajaxTopMovies = new XMLHttpRequest();
var ajaxResult;
var ajaxMovies;

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
    getTopMovies() ;

    document.getElementById('currency').onchange = currencyConvert;

}

function getTopMovies() {
    ajaxTopMovies.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            ajaxMovies = JSON.parse(this.response);
            var ajaxTopMoviesSorted = JSON.parse(JSON.stringify(ajaxMovies));
            var ajaxNewMoviesSorted = JSON.parse(JSON.stringify(ajaxMovies));
            ajaxTopMoviesSorted.sort(function (a,b) {
                return b.averageRating - a.averageRating;
            });
            ajaxNewMoviesSorted.sort(function (a,b) {
                var dateA = new Date(a.releaseDate);
                var dateB = new Date(b.releaseDate);
                return  dateB - dateA;
            });
            var newTopMovie;
            var newMovies;
            for (i = 0 ; i < 10 ; i++) {
                if (i >= ajaxMovies.length) {break;}
                var star1 = document.createElement('span');
                var star2 = document.createElement('span');
                var star3 = document.createElement('span');
                var star4 = document.createElement('span');
                var star5 = document.createElement('span');
                star1.className = "fa fa-star";
                star2.className = "fa fa-star";
                star3.className = "fa fa-star";
                star4.className = "fa fa-star";
                star5.className = "fa fa-star";
                for (j = 1 ; j <= parseInt(ajaxTopMoviesSorted[i].averageRating) ; j++) {
                    eval(`star${j}`).className += " checked";
                }
                
                newTopMovie = `<a class="movieLink" href="/items/itemDetail?reviews=five&itemID=${ajaxTopMoviesSorted[i]._id}">
                                   <div class="movie">
                                        <div class="moviePoster" style="background-image: url(${ajaxTopMoviesSorted[i].itemImageURL})"></div>
                                        <h2 class="movieTitle">${ajaxTopMoviesSorted[i].itemName}</h2>
                                        <div class="break"></div>
                                        ${star1.outerHTML}
                                        ${star2.outerHTML}
                                        ${star3.outerHTML}
                                        ${star4.outerHTML}
                                        ${star5.outerHTML}
                                        <div class="break"></div>
                                        <p class="price">${ajaxTopMoviesSorted[i].itemPrice != 0 ? "$" + (ajaxTopMoviesSorted[i].itemPrice).toString() : "FREE"}</p>
                                    </div>
                                </a>
                                `;
                star1.className = "fa fa-star";
                star2.className = "fa fa-star";
                star3.className = "fa fa-star";
                star4.className = "fa fa-star";
                star5.className = "fa fa-star";
                for (j = 1 ; j <= parseInt(ajaxNewMoviesSorted[i].averageRating) ; j++) {
                    eval(`star${j}`).className += " checked";
                }
                newNewMovie = `<a class="movieLink" href="/items/itemDetail?reviews=five&itemID=${ajaxNewMoviesSorted[i]._id}">
                    <div class="movie">
                        <div class="moviePoster" style="background-image: url(${ajaxNewMoviesSorted[i].itemImageURL})"></div>
                        <h2 class="movieTitle">${ajaxNewMoviesSorted[i].itemName}</h2>
                        <div class="break"></div>
                        ${star1.outerHTML}
                        ${star2.outerHTML}
                        ${star3.outerHTML}
                        ${star4.outerHTML}
                        ${star5.outerHTML}
                        <div class="break"></div>
                        <p class="price">${ajaxNewMoviesSorted[i].itemPrice != 0 ? "$" + (ajaxNewMoviesSorted[i].itemPrice).toString() : "FREE"}</p>
                    </div>
                </a>
                `;


                document.getElementById('topMovies').innerHTML += newTopMovie;
                document.getElementById('newMovies').innerHTML += newNewMovie;
              
            }


            
        }
    };
    ajaxTopMovies.open("GET", "http://localhost:8050/items/getType/Movie", true);
    ajaxTopMovies.send();
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

