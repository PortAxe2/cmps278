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
var isLiked = [];
var thumbUp;
var isDisLiked = [];
var thumbDown;
var reviews;
var isWish;

function $(id){
    return document.getElementById(id)
}

window.onload = function() {
    //itemType = localStorage.getItem('itemType');
    //itemName = localStorage.getItem('itemName');
   
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

    params = {
        _id: userID
    };

    
    const URLparameters = new URLSearchParams(window.location.search);
    itemID = URLparameters.get('itemID');
    reviews = URLparameters.get('reviews')
    console.log(itemID);
    
    fetchWishList();
    fetchItemInfo();
    fetchItemReviews();
    fetchUserInfo();
    addToLastVisited();
    $('addReview').onsubmit = function() {
        location.reload();
    }
    $('currency').onchange = currencyConvert;

    if(reviews == 'all'){
        $('AllReviews').style.display = 'none'
    }
    
    $('addWish').onclick = addWish;
    $('removeWish').onclick = removeWish;
  
}

function fetchUserInfo() {
    ajaxUser.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            ajaxResult = JSON.parse(this.response);
            $('userImg').src = ajaxResult.userImageURL;
            $('itemID').value = itemID;
            $('username').value = ajaxResult.username;
            $('picture').value = ajaxResult.userImageURL;
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
                                <h4 name="reviewerName">${reviews[i].reviewerUsername}</h4><br>
                                <p name="reviewContent">${reviews[i].reviewText}</p>
                                <br>
                                <span class="commentId">${reviews[i]._id}</span>
                                <span class="index">${i}</span>
                                <i id="${i}" class="fa fa-thumbs-up"></i>
                                <span class="numberOfLikes" name="numberOfLikes">${reviews[i].numberOfLikes}</span>
                                <i id="No${i}" class="fa fa-thumbs-down"></i>
                                <span class="numberOfDisLikes" name="numberOfDisLikes">${reviews[i].numberOfDisLikes}</span><br><br>
                                <button class="btn btn-danger reportButton">REPORT</button>
                            </div>
                                <br>`;
                $('reviews').innerHTML += newReview;

                var x = 0;
                
                for (var j = 0; j < reviews[i].likedby.length; j++) {
                    if(reviews[i].likedby[j] == userID){
                        x = 1;
                    }
                  }
                  isLiked.push(x)

                  x = 0;

                  for (var j = 0; j < reviews[i].dislikedby.length; j++) {
                    if(reviews[i].dislikedby[j] == userID){
                        x = 1;
                    }
                  }

                  isDisLiked.push(x)

                  if(isLiked[i] == 1 ){
                      $(i).style.color='blue';
                  }

                  if(isDisLiked[i] == 1 ){
                    $("No" + i).style.color='red';
                }

                $('AllReviews').href = 'http://localhost:8050/items/itemDetail?reviews=all&itemID=' + itemID

            }

            thumbUp = document.getElementsByClassName('fa-thumbs-up')
            for(var j=0 ; j<thumbUp.length; j++){
                thumbUp[j].onclick = like;
            }

            thumbDown = document.getElementsByClassName('fa-thumbs-down')
            for(var j=0 ; j<thumbDown.length; j++){
                thumbDown[j].onclick = dislike;
            }

            var reportButton = document.getElementsByClassName("reportButton")
            for(var j=0; j<reportButton.length; j++){
                reportButton[j].onclick = report;
            }

        }
    };
    ajaxReviews.open("GET", `http://localhost:8050/itemsReview/${reviews}/${itemID}`, true);
    ajaxReviews.send();

}


function fetchItemInfo() {
    ajaxRequestItemInfo.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            itemInfo = JSON.parse(this.response);
            $('itemName').innerHTML = itemInfo.itemName;
            $('title').innerHTML = itemInfo.itemName;
            $('description').innerHTML = itemInfo.itemDesc;
            $('total-reviews').innerHTML = itemInfo.totalNumReviews;
            $('itemImage').setAttribute("src", itemInfo.itemImageURL);
            $('credit').innerHTML += itemInfo.movieCredit
        
            for (i = 1 ; i <= parseInt(itemInfo.averageRating) ; i++) {
                $(`star${i}`).className += " checked";
            }

            if (itemInfo.itemPrice === 0) {
                $('price').innerHTML = "FREE";
            }else{
                $('price').innerHTML = "$" + (itemInfo.itemPrice).toString();
            }

            for (i = 0 ; i < itemInfo.itemGenre.length ; i++) {
                if(i== itemInfo.itemGenre.length -1){
                    $('genre').innerHTML += " " + (itemInfo.itemGenre[i]).toString();
                }
                else{
                    $('genre').innerHTML += " " + (itemInfo.itemGenre[i]).toString()+", ";
                }
              
            }

            for (i = 0 ; i < itemInfo.movieCast.length ; i++) {
                if(i== itemInfo.movieCast.length -1){
                    $('cast').innerHTML += " " + (itemInfo.movieCast[i]).toString();
                }
                else{
                    $('cast').innerHTML += " " + (itemInfo.movieCast[i]).toString()+", ";
                }
              
            }


            if (itemInfo.itemType == "Movie") {
                $('movieDiv').style.display  = "block";
                $('cast').style.display  = "block";
                $('credit').style.display  = "block";
                $('trailer').setAttribute("src", itemInfo.movieTrailerURL);
            }
            else{
                $('altImgs').style.display = "block"
                $('cast').style.display  = "none";
                $('credit').style.display  = "none";
                for(var i=0; i<itemInfo.extraImages.length; i++){
                    $('altImgs').innerHTML += `<img class="altImgs" src=${itemInfo.extraImages[i]}>`
                }
          
             
            }

            getSimilarItems(itemInfo.itemGenre, itemInfo.itemType, itemInfo.itemName)
        }
    };
    ajaxRequestItemInfo.open("GET", `http://localhost:8050/items/find/${itemID}`, true);
    ajaxRequestItemInfo.send();
}


function currencyConvert() {
    prices = $('price');
    var currentCurrency = $('currency').value;
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

function like(){
    var index =  this.previousSibling.previousSibling.innerHTML
    var likeCount = parseInt(document.getElementsByClassName("numberOfLikes")[index].innerHTML)
    var bool = false;
    var dislikeCount = parseInt(document.getElementsByClassName("numberOfDisLikes")[index].innerHTML)

    var commentId = document.getElementsByClassName('commentId')[index].innerHTML

    if(isLiked[index] == 0){
        if(isDisLiked[index]==1){
            isDisLiked.splice(index,1,0);
            bool = true;
            dislikeCount--;
            document.getElementsByClassName("numberOfDisLikes")[index].innerHTML = dislikeCount
            document.getElementsByClassName("fa-thumbs-down")[index].style = 'black'
        }
    
        isLiked.splice(index,1,1);
        likeCount++;
         document.getElementsByClassName("numberOfLikes")[index].innerHTML = likeCount
         this.style.color='blue';

        fetch('/itemsReview/addLikes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({username : userID,
                              commentId : commentId,
                              bool : bool
        }),
        })
        

    }
    else{
        isLiked.splice(index,1,0);
        likeCount--;
        document.getElementsByClassName("numberOfLikes")[index].innerHTML = likeCount
         this.style.color='black';

        fetch('/itemsReview/removeLikes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({username : userID,
                              commentId : commentId
        }),
        })
        
    }    

}




function dislike(){

    var index = this.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML
    var dislikeCount = parseInt(document.getElementsByClassName("numberOfDisLikes")[index].innerHTML)
    var likeCount = parseInt(document.getElementsByClassName("numberOfLikes")[index].innerHTML)
    var commentId = document.getElementsByClassName('commentId')[index].innerHTML
    var bool = false;

    if(isDisLiked[index] == 0){

        if(isLiked[index]==1){
            isLiked.splice(index,1,0);
            likeCount--;
            bool = true;
            document.getElementsByClassName("numberOfLikes")[index].innerHTML = likeCount
            document.getElementsByClassName("fa-thumbs-up")[index].style = 'black'
        }
      
            isDisLiked.splice(index,1,1);
            dislikeCount++;
            document.getElementsByClassName("numberOfDisLikes")[index].innerHTML = dislikeCount
            this.style.color='red';
   
           fetch('/itemsReview/addDisLikes', {
           method: 'POST',
           headers: {
           'Content-Type': 'application/json',
           },
           body: JSON.stringify({username : userID,
                                 commentId : commentId,
                                bool:bool
           }),
           })
        
    
    }
    else{
        isDisLiked.splice(index,1,0);
        dislikeCount--;
        document.getElementsByClassName("numberOfDisLikes")[index].innerHTML = dislikeCount
         this.style.color='black';

        fetch('/itemsReview/removeDisLikes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({username : userID,
                              commentId : commentId
        }),
        })
        
    }    

}


function allReviews(){
    $('AllReviews').style.display = 'none'
}

function fetchWishList(){   
  
        fetch("http://localhost:8050/users/checkWishlist", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username : userID, itemId : itemID})
    })
        .then(function (response) {
            if ((response.ok)) {
                return response.text();
            }
        })
        .then(function (text) {
            isWish = text;

            if(isWish == 'true'){
                $('addWish').style.display='none'
                $('removeWish').style.display='inline'
            }
            else{
                $('addWish').style.display='inline'
                $('removeWish').style.display='none'
            }
        })
        
}


function addWish(){
    fetch("http://localhost:8050/users/addToWishlist", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username : userID, itemId : itemID})
    })
     
    $('addWish').style.display='none'
    $('wishAdded').style.display = "inline";
    $('removeWish').style.display='inline'
    $('wishAlreadyAdded').style.display = "none";

}

function removeWish(){
    
    fetch("http://localhost:8050/users/removeFromWishlist", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username : userID, itemId : itemID})
    })
     
    $('addWish').style.display='inline'
    $('wishAdded').style.display = "none";
    $('removeWish').style.display='none'
    $('wishAlreadyAdded').style.display = "inline";
}


function addToLastVisited(){
       
    fetch("http://localhost:8050/users/addToLastVisited", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username : userID, itemId : itemID})
        })
      
        
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


function getSimilarItems(genre, type, name){
    var alreadyAdded = []
    var imageUrl = []
    var imageId = []
    var bool = false
    for(var i=0; i<genre.length; i++){
        fetch("http://localhost:8050/items/similar", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({genre : genre[i], itemType: type})
        })
            .then(function (response) {
                if ((response.ok)) {
                    return response.text();
                }
            })
            .then(function (text) {
                var results = JSON.parse(text)
              
          
                for(var i=0; i<results.length; i++){
                    bool = false
                    if(results[i].itemName != name){
                       for(var j=0; j<alreadyAdded.length; j++){
                           if(results[i].itemName == alreadyAdded[j]){
                               bool = true
                           }
                       }
                       if(bool == false){
                        alreadyAdded.push(results[i].itemName)
                        $('similar').innerHTML += `<a href="http://localhost:8050/items/itemDetail?reviews=five&itemID=${results[i]._id}"><img class="similar" src=${results[i].itemImageURL}></a>`
                       }
                        
                    }
                }


                
            })
            
    }
   
    
}


function report(){
    var index = this.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML
    var id = document.getElementsByClassName("commentId")[index].innerHTML
    var url = `http://localhost:8050/itemsReview/report/id/${id}`
    window.open(url, '_blank', "width=600,height=400")
}