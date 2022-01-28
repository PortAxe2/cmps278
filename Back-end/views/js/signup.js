function $(id){
    return document.getElementById(id)
}

window.onload = function(){
    $('checkbox').onclick = check
}

function check(){
    if($('checkbox').checked == true){
        $('emailNotif').value = "0"
    }
    else{
        $('emailNotif').value = "1"
    }
}