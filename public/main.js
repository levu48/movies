var xhr = new XMLHttpRequest();
var currentSearch = [];

function search() {
    var key = document.getElementById('key').value;
    xhr.open('GET', "//www.omdbapi.com/?s=" + key.replace(' ', '+') + "&r=json");
    xhr.send();

    xhr.addEventListener("readystatechange", processSearch, false);
}

function processSearch(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);

        var el = document.getElementById('movies'); //HTML element
        var str = "<ul>"; // composing html string
        currentSearch = res.Search;
        for (var i=0; i< currentSearch.length; i++) {
            str += "<li><a href='/detail?i=" + currentSearch[i].imdbID + "'>" + currentSearch[i].Title + "</a></li>\n";
        }
        str += "</ul>";
        el.innerHTML = str;
    }
}

function getDetail() {
    var imdbID = window.location.search.slice(3);
    xhr.open('GET', "//www.omdbapi.com/?i=" + imdbID + "&r=json");
    xhr.send();

    xhr.addEventListener("readystatechange", processDetail, false);
}

function processDetail() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var movie = JSON.parse(xhr.responseText);
        var str = "<h1>" + movie.Title + "</h1>";
        str += "<ul>";
        var keys = Object.keys(movie);
        for (var i=0; i<keys.length; i++) {
            if (keys[i] !== 'Title') {
                str += "<li><b>" + keys[i] + "</b>: " + movie[keys[i]] + "</li>";
            }
        }
        str += "</ul>";
        document.getElementById('detail').innerHTML = str;
        document.getElementById('addFav').innerHTML = "<a href='/addfav?t=" + movie.Title + "&i=" + movie.imdbID + "'>Add to favorite list</a>";
    }
}