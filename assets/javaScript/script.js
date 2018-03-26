$(document).ready(function(){

var topics = ["toy story", "jungle book", "lion king"];

createButtons();
showFavs();
$('#goButton').on("click", function(event){
    event.preventDefault();
    $('#buttonsHere').empty();
    let topicInput = $('#topicHere').val().trim();
    if($('#topicHere').val() !== "" && topics.indexOf(topicInput) === -1){
    topics.push(topicInput);
    console.log(topics);
    }
    createButtons();
    $('#topicHere').val("");
})
function createButtons(){
    for (i = 0; i < topics.length; i++){
        var btn = $('<button>');
        btn.text(topics[i].toUpperCase());
        btn.addClass('gifButton');
        btn.attr('data-name', topics[i]);
        if (topics.length > 0){
        $('#buttonsHere').prepend(btn);
        } else {
            $('#buttonsHere').prepend();
        }
    }
}
function storeFavs() {
    if (('localStorage' in window) && window['localStorage'] !== null) {
        let savedFavs = $('#favsHere').html();
        localStorage.setItem('favs', savedFavs);
    }
}
function showFavs(){
    if ('favs' in localStorage) {
        $("#favsHere").html(localStorage.getItem('favs'));
    }
};
$(document).on("click", ".gifButton", function(){
    var gifTopic = $(this).attr('data-name');
    var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + gifTopic + "&limit=10&api_key=dBPu8CQRih7tcTC6dmXrTx8FR7RO29pl";
    $.ajax({
        url: queryUrl,
        method: "GET"
    }) 
    .then(function(response){
        let gifInfo = response.data;
        for (j = 0; j < gifInfo.length; j++){
            let gifRating = gifInfo[j].rating;
            let gifTitle = gifInfo[j].title;
            let p = $("<p> <h4>Title: </h4>" + gifTitle.toUpperCase() + "<br> <h4>Rating: </h4>" + gifRating.toUpperCase() + "</p>") 
            let img = $("<img>");
            img.addClass("gifs");
            img.attr("state", "animate");
            img.attr("data-animate", gifInfo[j].images.fixed_height_small.url);
            img.attr("data-still", gifInfo[j].images.fixed_height_small_still.url)
            img.attr("src", gifInfo[j].images.fixed_height_small.url);
            let newDiv = $('<div id="newDiv">');
            newDiv.append(p);
            newDiv.append(img);
            $("#gifsHere").prepend(newDiv);
            // ------------------
            $("#newDiv").dblclick(function(){
            let original = $(this);
            let clone = $(this).clone();
            clone.addClass("clones");            
            $('#favsHere').prepend(clone);            
            // ----------------- local storage
            localStorage.clear();
            storeFavs();
            console.log(localStorage);
            })
        }
    })
});
$(document).on("click", ".gifs", function(){
    if ($(this).attr("state") === "animate"){
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("state", "still");
    } else if ($(this).attr("state") === "still"){
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("state", "animate");
    }
})
$('#clearFavs').on("click", function(event){
    event.preventDefault();
    localStorage.clear();
    $("#favsHere").html("")
});

})