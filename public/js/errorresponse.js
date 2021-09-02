// const { default: swal } = require("sweetalert");



function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


function getParameterByName(name, url) {
    if (!url) {
    url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
   }
var response =  getParameterByName('response');
var url ="/"+getParameterByName('dir');


if (response==undefined || url==undefined) {
    console.log("Techsnapie Solutions");
} else {
   // swal.fire('hello');
    alert(response);
    window.location.replace(url);
}


var logout = document.getElementById('logout');

logout.addEventListener('click',logOut);


function logOut(){
 
 document.cookie = "x-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
 window.location.reload();
}