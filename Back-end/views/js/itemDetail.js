var ajaxRequestItemInfo = new XMLHttpRequest();
var ajaxReviews         = new XMLHttpRequest();
var ajaxUser = new XMLHttpRequest();
var ajaxResult;
var itemInfo;
var itemType;
var reviews;
var itemName = "Black Panther";
var itemID;
var userID;
var wishButton;
var params;

window.onload = function() {
    //itemType = localStorage.getItem('itemType');
    //itemName = localStorage.getItem('itemName');
    if(localStorage.getItem('userID')){
        userID = localStorage.getItem('userID')
    }
    else if (sessionStorage.getItem('userID')) {
        userID = sessionStorage.getItem('userID');
    }
    
    if(!userID) {
        window.location.replace("http://localhost:8050/signin");
    }

    params = {
        _id: userID
    };

    document.getElementById('addWish').onclick = function() {
        addToWishlist(itemID, userID);
    }
    const URLparameters = new URLSearchParams(window.location.search);
    itemID = URLparameters.get('itemID');
    console.log(itemID);
    itemType = "Movie";
    fetchItemInfo();
    fetchItemReviews();
    fetchUserInfo();
    document.getElementById('addReview').onsubmit = function() {
        location.reload();
    }
    document.getElementById('currency').onchange = currencyConvert;
}

function fetchUserInfo() {
    ajaxUser.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            ajaxResult = JSON.parse(this.response);
            document.getElementById('userImg').src = ajaxResult.userImageURL;
            document.getElementById('itemID').value = itemID;
            document.getElementById('username').value = ajaxResult.username;
            document.getElementById('picture').value = ajaxResult.userImageURL;
        }
    };
    ajaxUser.open("POST", "http://localhost:8050/users/getInfo", true);
    ajaxUser.setRequestHeader('Content-type', 'application/json')
    ajaxUser.send(JSON.stringify(params));   
}

function fetchItemReviews() {
    ajaxReviews.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            reviews = JSON.parse(this.response);
            //console.log(reviews);
            var newReview;
            for (i = 0 ; i < reviews.length ; i++) {
                //console.log(reviews[i].reviewerUsername);
                newReview = `<div class="review">
                                <img id="reviewerIcon" src="${reviews[i].reviewerPicture}" alt="">
                                <h3 name="reviewerName">${reviews[i].reviewerUsername}</h3><br>
                                <p name="reviewContent">${reviews[i].reviewText}</p>
                                <br>
                                <i class="fa fa-thumbs-up"></i>
                                <i class="fa fa-thumbs-down"></i><br>
                                <span>Number of likes</span>
                                <span name="numberOfLikes">${reviews[i].numberOfLikes}</span><br><br>
                                <button class="reportButton">REPORT REVIEW</button>
                            </div>
                                <br>`;
                document.getElementById('reviews').innerHTML += newReview;
            }
        }
    };
    ajaxReviews.open("GET", `http://localhost:8050/itemsReview/lastfive/${itemID}`, true);
    ajaxReviews.send();
}


function fetchItemInfo() {
    ajaxRequestItemInfo.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            itemInfo = JSON.parse(this.response);
            document.getElementById('itemName').innerHTML = itemInfo.itemName;
            document.getElementById('description').innerHTML = itemInfo.itemDesc;
            document.getElementById('total-reviews').innerHTML = itemInfo.totalNumReviews;
            document.getElementById('itemImage').setAttribute("src", itemInfo.itemImageURL);
            for (i = 1 ; i <= parseInt(itemInfo.averageRating) ; i++) {
                document.getElementById(`star${i}`).className += " checked";
            }

            if (itemInfo.itemPrice === 0) {
                document.getElementById('price').innerHTML = "FREE";
            }else{
                document.getElementById('price').innerHTML = "$" + (itemInfo.itemPrice).toString();
            }

            for (i = 0 ; i < itemInfo.itemGenre.length ; i++) {
                document.getElementById('genre').innerHTML += " " + (itemInfo.itemGenre[i]).toString();
            }
            if (itemType == "Movie") {
                document.getElementById('movieDiv').style.display  = "block";
                document.getElementById('trailer').setAttribute("src", itemInfo.movieTrailerURL);
            }
        }
    };
    ajaxRequestItemInfo.open("GET", `http://localhost:8050/items/find/${itemID}`, true);
    ajaxRequestItemInfo.send();
}

function addToWishlist(itemID, userID) {
    console.log({itemID}, {userID});
    var ajaxWishlist = new XMLHttpRequest();
    ajaxWishlist.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.response);
            document.getElementById('addWish').disabled = true;
            document.getElementById('addWish').style.backgroundColor = "gray";
            if(result.nModified == 1) {
                document.getElementById('wishAdded').style.display = "block";
            }
            else {
                document.getElementById('wishAlreadyAdded').style.display = "block";
            }
        }
    }
    ajaxWishlist.open("POST", `http://localhost:8050/users/addToWishlist?userID=${userID}&itemID=${itemID}`);
    ajaxWishlist.send();
}

function currencyConvert() {
    prices = document.getElementById('price');
    var currentCurrency = document.getElementById('currency').value;
    var priceText;
    var price;
    if (prices.innerHTML === "FREE") {
        return;
    }
    priceText = prices.innerHTML;
    if (currentCurrency == "lira") {
        price = parseFloat(priceText.substr(1,priceText.length-1));
        prices.innerHTML =  (price*1500).toString() + " L.L";
    } else {
        price = parseFloat(priceText.substr(0,priceText.length-4));
        prices.innerHTML =  "$" + (price/1500).toString();
    }
    console.log(price);
}