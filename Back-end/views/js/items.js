var userID;
var ajaxUser = new XMLHttpRequest();
var ajaxResult
var url
var allGames =[]
var genres = []
var type


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

    url = window.location.href
    url = url.split('/')
    url = url[url.length-1]
    var capitalized = url.charAt(0).toUpperCase() + url.slice(1)
    $('title').innerHTML = capitalized

    displayCountry()
    $('select').style.color = $('h1').style.color
   

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

    
    getItems()
}

function getItems(){
   
  

    if(url == "movies"){
        type = "Movie"
    }
    else if(url == "games"){
        type = "Game"
    }
    else if(url == "books"){
        type = "Book"
    }
    else if(url == "applications"){
        type = "App"
    }


    fetch(`http://localhost:8050/items/getType/${type}`)
    .then( res => res.json())
    .then(response => {
        var topItems = []
        var newReleases = []
        var recommendedGames =[]
        var genreGames = []
       
        var bool
        for(var i= 0 ;i<response.length;i++){
            topItems.push(response[i])
            allGames.push(response[i])
            newReleases.push(response[i])
            recommendedGames.push(response[i])

            bool = false
            for(var j=0; j<response[i].itemGenre.length; j++){
                genres.push(response[i].itemGenre[j])
            }
        }

        
        for(var i= 0 ;i<response.length;i++){
            if(response[i].itemGenre.includes(genres[0]) == true){
                genreGames.push(response[i])
            }
        }
        
        

        topItems.sort((a, b) => parseFloat(b.totalNumReviews) - parseFloat(a.totalNumReviews));
        newReleases.sort((a, b) => parseFloat(b.releaseDate) - parseFloat(a.releaseDate));
        recommendedGames.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
        
        var len = genreGames.length
        displayGames(topItems, 'topMovies',10)
        displayGames(newReleases, 'newMovies',10)
        displayGames(recommendedGames, 'recommend',10)
        displayGames(genreGames, 'filtered',len)
        
        genres = [...new Set(genres)];

        for(var i=0; i<genres.length; i++){
            $('select').innerHTML += `<option value=${genres[i]}>${genres[i]}</option>`
        }
        $('select').onchange = filter

    })
   
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
    
}

function displayGames(items, div, len){
    for(var i=0; i< len; i++){
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
        
        for (var j = 1 ; j <= parseInt(items[i].averageRating) ; j++) {
            eval(`star${j}`).className += " checked";
        }

        $(div).innerHTML += `<a class="movieLink" href="/items/itemDetail?reviews=five&itemID=${items[i]._id}">
        <div style="background-color: white;" class="movie">
             <div class="moviePoster" style="background-image: url(${items[i].itemImageURL})"></div>
             <h2 class="movieTitle">${items[i].itemName}</h2>
             <div class="break"></div>
             ${star1.outerHTML}
             ${star2.outerHTML}
             ${star3.outerHTML}
             ${star4.outerHTML}
             ${star5.outerHTML}
             <div class="break"></div>
             <p class="price">${items[i].itemPrice != 0 ? "$" + (items[i].itemPrice).toString() : "FREE"}</p>
         </div>   
     </a>  `
    }
}


function filter(){
    var filteredArray = []
    var genre = $('select').value
    var div = $('filtered')



    div.innerHTML = ""
    for(var i=0; i<allGames.length; i++){
        for(var j=0; j<allGames[i].itemGenre.length; j++){
            if(allGames[i].itemGenre[j].indexOf(genre) != -1){
         
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
                for (var j = 1 ; j <= parseInt(allGames[i].averageRating) ; j++) {
                    eval(`star${j}`).className += " checked";
                }
        
                div.innerHTML += `<a class="movieLink" href="/items/itemDetail?reviews=five&itemID=${allGames[i]._id}">
                <div style="background-color: white;" class="movie">
                     <div class="moviePoster" style="background-image: url(${allGames[i].itemImageURL})"></div>
                     <h2 class="movieTitle">${allGames[i].itemName}</h2>
                     <div class="break"></div>
                     ${star1.outerHTML}
                     ${star2.outerHTML}
                     ${star3.outerHTML}
                     ${star4.outerHTML}
                     ${star5.outerHTML}
                     <div class="break"></div>
                     <p class="price">${allGames[i].itemPrice != 0 ? "$" + (allGames[i].itemPrice).toString() : "FREE"}</p>
                 </div>   
             </a>  `
            }
        }
        
    }

    
}



