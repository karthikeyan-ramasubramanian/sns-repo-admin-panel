
document.getElementById('search').onclick = function() {
    var q = document.getElementById('navbar-search-input').value;
    console.log(q);
    window.open('http://google.com/search?q='+q);
};

var txtbox = document.getElementById('navbar-search-input');
txtbox.onkeydown = function(e) {
  if (e.key == "Enter") {
    var q = document.getElementById('navbar-search-input').value;
        console.log(q);
        window.open('http://google.com/search?q='+q);
  }
  
};
