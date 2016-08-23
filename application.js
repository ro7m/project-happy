$(document).ready(function() {
    var nextPageToken, currentQuery;
    var $resultDisplay = $('#search-result'),
        $spinner = $('.spinner'),
        $loadMoreButton = $('#load-more-results');

    if (localStorage['lastQuery']) {
        $spinner.css('display', 'block');
        currentQuery = localStorage['lastQuery'];
        performVideosSearch(currentQuery, null, function(res) {
            nextPageToken = res.nextPageToken;
            $resultDisplay.append('<h4>Suggestions based on your most recent search:</h4>')
            res.items.forEach(function(item) {
                $resultDisplay.append(searchResult(item.snippet));
            });
            $resultDisplay.show();
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        })
    }

    $('#video-search').on( 'submit', function() {
        event.preventDefault();
        $spinner.css('display', 'block');
        $loadMoreButton.hide();
        currentQuery = $(this).find('input').val();
        localStorage['lastQuery'] = currentQuery;
        $resultDisplay.html('');
        performVideosSearch(currentQuery, null, function(res) {
            // console.log(res)
            nextPageToken = res.nextPageToken;
            res.items.forEach(function(item) {
                $resultDisplay.append(searchResult(item.snippet));
            });
            $resultDisplay.show();
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        })
    });

    $loadMoreButton.click(function() {
        $(this).hide();
        performVideosSearch(currentQuery, nextPageToken, function(res) {
            nextPageToken = res.nextPageToken;
            res.items.forEach(function(item) {
                $resultDisplay.append(searchResult(item.snippet));
            });
            $resultDisplay.show();
            $('.spinner').hide();
            $('#load-more-results').css('display', 'block');
        });
    });
});

function performVideosSearch(query, token, callback) {
    var data = {
        key: 'AIzaSyDZYAKp1cVowIRmnV4jXh_C2x0vDVLHvYU',
        part: 'snippet',
        type: 'video',
        q: query,
        videoDimension: '2d',
        videoEmbeddable: 'true'
    };
    if (token) data.pageToken = token;
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        type: 'GET',
        data: data
    }).done(function(res) {
        callback(res)
    }).fail(function(res) {
        alert('Fail to make search request! Try again!');
    })
}

//design
var searchResult = function(videoData) {
    return '<div class="row result">\
              <div class="col-sm-3 col-xs-12">\
                <img class="img-responsive" src="' + videoData.thumbnails.medium.url + '" />\
              </div>\
              <div class="col-sm-9 col-xs-12">\
                <h4>' + videoData.title + '</h4>\
                <p class="text-muted">' + videoData.channelTitle + '</p>\
                <p>' + videoData.description + '</p>\
              </div>\
            </div>';
}
