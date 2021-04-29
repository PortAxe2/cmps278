var ajaxRequestItemInfo = new XMLHttpRequest();
var ajaxReviews         = new XMLHttpRequest();
var itemInfo;
var itemType;
var reviews;
var itemName;

window.onload = function() {
    //itemType = localStorage.getItem('itemType');
    //itemName = localStorage.getItem('itemName');
    itemName = "Black Panther";
    itemType = "Movie";
    fetchItemInfo();
    fetchItemReviews();
}

function fetchItemReviews() {
    ajaxReviews.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            reviews = JSON.parse(this.response);
            console.log(reviews);
            var newReview;
            for (i = 0 ; i < reviews.length ; i++) {
                console.log(reviews[i].reviewerUsername);
                newReview = `<div class="review">
                                <img id="reviewerIcon" src="" alt="">
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
    }
    ;
    ajaxReviews.open("GET", `http://localhost:8080/MoviesReview/${itemName}`, true);
    ajaxReviews.send();
}

function fetchItemInfo() {
    ajaxRequestItemInfo.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            itemInfo = JSON.parse(this.response);
            console.log(itemInfo);
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
    ajaxRequestItemInfo.open("GET", "http://localhost:8080/Movies/all", true);
    ajaxRequestItemInfo.send();
}