var userID
var wishlist = [];
var lastVisited = [];
var ajaxUser = new XMLHttpRequest();

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
    
    if(!userID) {
        window.location.replace("http://localhost:8050/signin");
    }

    displayCountry()

    getWishList()
    getLastVisited()
    getProfile()

    document.getElementById('currency').onchange = currencyConvert;



    $('clock').onclick = showclock;
    $('wish').onclick = showwish;
    $('profileInfo').onclick = showprofile;
    

    $('wishlist').style.display = 'none'
    $('lastvisited').style.display = 'none'

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

function getWishList(){
    fetch("http://localhost:8050/users/getWishList", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username : userID})
    })
        .then(function (response) {
            if ((response.ok)) {
                return response.text();
            }
        })
        .then(function (text) {
            var results = JSON.parse(text);
            results = results[0].wishlistIDs

            for(var i =0 ; i<results.length ; i++){
                wishlist.push(results[i])
            }
            wishlist.reverse()

            showWishList()

        })
       
}

function showWishList(){
    var div = $('wishlist')
    for(var i=0; i< wishlist.length; i++){
        fetch("http://localhost:8050/items/showWishList", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({wishlist : wishlist[i]})
        })
            .then(function (response) {
                if ((response.ok)) {
                    return response.text();
                }
            })
            .then(function (text) {
               var results = JSON.parse(text);
          
                
               var wishitem = `<li class="list-group-item d-flex list-group-item-secondary">
                                <a class="pmd-avatar-list-img" href="http://localhost:8050/items/itemDetail?reviews=five&itemID=${results[0]['_id']}"> 
                                    <img data-holder-rendered="true" src="${results[0].itemImageURL}" class="img-fluid"  alt="40x40">
                                </a>
                                <div class="media-body">
                                <h6 class="pmd-list-title">${results[0].itemName}</h6>
                                <p class="pmd-list-subtitle text-success price">${results[0].itemPrice != 0 ? "$" + (results[0].itemPrice).toString() : "FREE"}</p> 
                                </div>
                                <div class="media-body btn-remove">
                                        <button value="${results[0]['_id']}" class="btn btn-outline-danger remove">Remove from wishlist</button>
                                </div>
                                </li>`

                                div.innerHTML += wishitem

                                var btnLength = document.getElementsByClassName('remove').length - 1;

                                for(var j=0 ; j<=btnLength; j++){
                                    document.getElementsByClassName('remove')[j].onclick = removeWish;
                                }

            })
            


            
    }
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



function removeWish(){
    
    fetch("http://localhost:8050/users/removeFromWishlist", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username : userID, itemId : this.value})
    })
  
    location.reload();


}

function setActions(i){
    //document.getElementsByClassName('remove')[i].onclick        
}


function getLastVisited(){
    fetch("http://localhost:8050/users/getLastVisited", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username : userID})
    })
        .then(function (response) {
            if ((response.ok)) {
                return response.text();
            }
        })
        .then(function (text) {
            var results = JSON.parse(text);
            results = results[0].lastVisited

            for(var i =0 ; i<results.length ; i++){
                lastVisited.push(results[i])
            }
          
            lastVisited.reverse()

            showLastVisited()

        })
       
}



function showLastVisited(){
    var div = $('lastvisited')
    var x = '';

    for(var i=0; i< lastVisited.length; i++){
        fetch("http://localhost:8050/items/showWishList", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({wishlist : lastVisited[i]})
        })
            .then(function (response) {
                if ((response.ok)) {
                    return response.text();
                }
            })
            .then(function (text) {
               var results = JSON.parse(text);
        
               var listitem = `<li class="list-group-item d-flex list-group-item-secondary">
                                <a class="pmd-avatar-list-img" href="http://localhost:8050/items/itemDetail?reviews=five&itemID=${results[0]['_id']}"> 
                                    <img data-holder-rendered="true" src="${results[0].itemImageURL}" class="img-fluid"  alt="40x40">
                                </a>
                                <div class="media-body">
                                <h6 class="pmd-list-title">${results[0].itemName}</h6>
                                <p class="pmd-list-subtitle text-success price">${results[0].itemPrice != 0 ? "$" + (results[0].itemPrice).toString() : "FREE"}</p> 
                                </div>
                                </li>`

                                div.innerHTML += listitem    

            })
           


            
    }
}

function showclock(){
    $('lastvisited').style.display = 'block'
    $('wishlist').style.display = 'none'
    $('profileDetails').style.display = 'none'
}


function showwish(){
    $('wishlist').style.display = 'block'
    $('lastvisited').style.display = 'none'
    $('profileDetails').style.display = 'none'
}

function showprofile(){
    $('wishlist').style.display = 'none'
    $('lastvisited').style.display = 'none'
    $('profileDetails').style.display = 'block'
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

function getProfile(){

    fetch("http://localhost:8050/users/profile", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userID : userID })
    })
        .then(function (response) {
            if ((response.ok)) {
                return response.text();
            }
        })
        .then(function (text) {
           var results = JSON.parse(text);


            var profile = `<li class="list-group-item d-flex list-group-item-secondary">
                                <a class="pmd-avatar-list-img"> 
                                    <img id="myImg" data-holder-rendered="true" src="${results[0].userImageURL}" class="img-fluid"  alt="40x40">
                                </a>
                                <div class="media-body">
                                <h4 id="username" class="pmd-list-title">${results[0].username}</h4>
                                <h4 id="username" class="pmd-list-title">${results[0].email}</h4>
                                <button id="changePicture" class="btn btn-outline-info">Change Profile Picture</button>
                                </div>
                                <div class="media-body btn-remove text-center">
                                        <button style="margin-bottom:10px" id="signout" class="btn btn-outline-info">Sign Out</button><br>
                                        <button id="changebtn"  class="btn btn-outline-info">Change Password</button>
                                </div>
                                </li>

                                <div id="passChange">
                                <li  class="list-group-item d-flex list-group-item-secondary">

                                <form>
                       

                                 <li  class="list-group-item d-flex list-group-item-secondary">
                                <input type="password" id="oPass" name="oPass" placeholder="Current Password">
                                </li>
                                <li class="list-group-item d-flex list-group-item-secondary">
                                <input type="password" id="nPass" name="nPass" placeholder="New Password">
                                </li>

                                <li class="list-group-item d-flex list-group-item-secondary">
                                <input type="password" id="cPass" name="cPass" placeholder="Confirm Password">
                                </li>

                                <li class=" list-group-item d-flex list-group-item-secondary">
                                <input id="passChangeBtn" type="button" class="btn btn-outline-info" value="Change Password">
                                </li>
                            
                       
                       </form>
                       <div style="margin-left:30px;" class="media-body" id"errorChange">
                       <p id="error1" class="text-danger">Passwords do not match</p>
                       <p id="error2" class="text-danger">Password must at least be 6 characters</p>
                       <p id="error3" class="text-danger">Incorrect password</p>
                       <p id="success1" class="text-success">Password changed successfully!</p>
                       </div>
                       </li>

                       
                       </div>
                                
                        <li id="uploadImg" class="list-group-item d-flex list-group-item-secondary">
                                <form action="http://localhost:8050/users/upload" method="post" enctype="multipart/form-data">
                                <input type="file" accept="image/*" name="photo" >
                                <input type="text" class="hidden" name="id" value=${userID}>
                                <input type="submit" value="upload">
                                </form>
                       </li>
                                `

            $("profileDetails").innerHTML += profile 
            $('changePicture').onclick = showInfo;

            $('changebtn').onclick = showPass;
            $("signout").onclick = logout;

            $('passChangeBtn').onclick = changePassword

            $('error1').style.display = 'none'
            $('error2').style.display = 'none'
            $('error3').style.display = 'none'
            $('success1').style.display = 'none'

        })
      

}

function showInfo(){
    $('uploadImg').style.visibility = 'visible'
}

function logout(){
    window.location.replace("http://localhost:8050");
}

function showPass(){
    $('passChange').style.display = 'block'
    
}

function changePassword(){
    var oPass = $('oPass').value
    var nPass = $('nPass').value
    var cPass = $('cPass').value

    $('error1').style.display = 'none'
    $('error2').style.display = 'none'
    $('error3').style.display = 'none'
    $('success1').style.display = 'none'


    bool = 1

    if(cPass != nPass){
       bool = 0  
       $('error1').style.display = 'block'      
    }
    if(nPass.length < 6){
        $('error2').style.display = 'block'
        bool = 0        
    }

    if(bool == 1){
        fetch("http://localhost:8050/users/changePassword", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username : userID, oPass : oPass, nPass : nPass, cPass : cPass })
        })
            .then(function (response) {
                if ((response.ok)) {
                    return response.text();
                }
            })
            .then(function (text) {
                var results = JSON.parse(text);
                
                if(results[0] == 'f'){
                    $('error3').style.display = 'block'
                }
                else if(results[0] == 't'){
                    $('success1').style.display = 'block'
                    $('oPass').value = ''
                    $('nPass').value = ''
                    $('cPass').value = ''
                }
               
    
            })
    }

 
        
}